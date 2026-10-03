import {
  computed,
  inject,
  onMounted,
  onServerPrefetch,
  ref,
  useSSRContext,
  watch,
} from "vue";
import { useRoute } from "vue-router";
import { withTableOfContents } from "./useTableOfContents";
import {
  PRERENDER_STATE,
  getServerPost,
  getServerPosts,
  reviveDates,
} from "./serverData";

// The listing only feeds related/prev/next cards; dropping the bodies keeps
// every article's full HTML out of each page's embedded state.
function toListItem({ content, faqs, keyTakeaways, ...rest }) {
  return rest;
}

/**
 * Shared fetch-by-slug + TOC + related + prev/next logic for BlogDetails/ArticleDetails.
 *
 * Production: the Express backend renders the post from MongoDB
 * (`collection` = 'articles' | 'blogs') and embeds the data in the page; the
 * browser hydrates from it and never calls the API. Only `npm run dev`
 * (no backend) falls back to fetching through getFn/listFn in the browser.
 */
export function usePostDetails({ getFn, listFn, incrementViewsFn, collection }) {
  const route = useRoute();
  const prerenderState = inject(PRERENDER_STATE, null);

  const post = ref(null);
  const allPosts = ref([]);
  const loading = ref(true);
  const notFound = ref(false);
  const error = ref("");

  const contentHtml = ref("");
  const headings = ref([]);

  // Trailing slash ignored: /articles/x and /articles/x/ are the same page.
  const stateKey = `post:${route.path.replace(/\/+$/, "") || "/"}`;

  function show(found, list) {
    allPosts.value = list;

    if (!found || !found.published) {
      notFound.value = true;
      post.value = null;
      return;
    }

    post.value = found;
    const parsed = withTableOfContents(found.content);
    contentHtml.value = parsed.html;
    headings.value = parsed.headings;
  }

  async function load(slug) {
    loading.value = true;
    notFound.value = false;
    error.value = "";

    try {
      const [found, list] = await Promise.all([
        getFn(slug),
        listFn({ publishedOnly: true }),
      ]);
      show(found, list);
      if (post.value) incrementViewsFn?.(post.value.id);
    } catch (err) {
      console.error("[post-details] load failed:", err.code, err.message, err);
      error.value = import.meta.env.DEV
        ? `${err.code || "unknown-error"} — ${err.message || "Load failed."}`
        : "Could not load this post. Check the server connection.";
    } finally {
      loading.value = false;
    }
  }

  if (import.meta.env.SSR) {
    const ssrContext = useSSRContext();

    onServerPrefetch(async () => {
      try {
        const [found, list] = await Promise.all([
          getServerPost(collection, route.params.slug),
          getServerPosts(collection),
        ]);
        show(found, list.map(toListItem));
      } catch (err) {
        console.error("[post-details] server render failed:", err);
        error.value = "Could not load this post. Please try again shortly.";
      }
      loading.value = false;

      if (ssrContext) {
        if (error.value) ssrContext.statusCode = 500;
        else if (notFound.value) ssrContext.statusCode = 404;
      }

      if (!prerenderState) return;
      if (post.value) {
        const { content, ...postData } = post.value;
        prerenderState[stateKey] = {
          post: postData,
          allPosts: allPosts.value,
          contentHtml: contentHtml.value,
          headings: headings.value,
        };
      } else {
        prerenderState[stateKey] = { notFound: notFound.value, error: error.value };
      }
    });
  } else {
    const prerendered = prerenderState?.[stateKey];

    if (prerendered) {
      // Hydrate from exactly what the server rendered.
      delete prerenderState[stateKey];
      const state = reviveDates(prerendered);
      post.value = state.post || null;
      allPosts.value = state.allPosts || [];
      contentHtml.value = state.contentHtml || "";
      headings.value = state.headings || [];
      notFound.value = !!state.notFound;
      error.value = state.error || "";
      loading.value = false;

      if (post.value) onMounted(() => incrementViewsFn?.(post.value.id));
    }

    watch(
      () => route.params.slug,
      (slug) => slug && load(slug),
      { immediate: !prerendered },
    );
  }

  const related = computed(() => {
    if (!post.value) return [];

    const isGuide = !!post.value.guideCardId;

    return allPosts.value
      .filter((p) => {
        if (p.id === post.value.id) return false;

        if (isGuide) {
          return p.guideCardId && p.category === post.value.category;
        }

        return !p.guideCardId && p.category === post.value.category;
      })
      .slice(0, 3);
  });

  const sortedForNav = computed(() =>
    [...allPosts.value].sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0)),
  );

  const prevPost = computed(() => {
    if (!post.value) return null;
    const idx = sortedForNav.value.findIndex((p) => p.id === post.value.id);
    return idx > 0 ? sortedForNav.value[idx - 1] : null;
  });

  const nextPost = computed(() => {
    if (!post.value) return null;
    const idx = sortedForNav.value.findIndex((p) => p.id === post.value.id);
    return idx >= 0 && idx < sortedForNav.value.length - 1
      ? sortedForNav.value[idx + 1]
      : null;
  });

  return {
    post,
    loading,
    notFound,
    error,
    contentHtml,
    headings,
    related,
    prevPost,
    nextPost,
  };
}
