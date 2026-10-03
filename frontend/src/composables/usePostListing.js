import { computed, inject, onMounted, onServerPrefetch, ref, watch } from "vue";
import { PRERENDER_STATE, getServerPosts, reviveDates } from "./serverData";

const PAGE_SIZE = 9;

// Cards never show the body; leaving it out keeps the page state small.
function toListItem({ content, faqs, keyTakeaways, ...rest }) {
  return rest;
}

/**
 * Shared search + category/tag filter + pagination + featured/trending logic for Blog/Articles listings.
 *
 * The posts are loaded on the server (so the cards are in the page's HTML)
 * and handed to the browser in the page state; the browser fetches them
 * itself only when there is no server state (e.g. a client-side navigation).
 */
export function usePostListing(fetchFn) {
  const posts = ref([]);
  const loading = ref(true);
  const error = ref("");
  const search = ref("");
  const category = ref("all");
  const tag = ref("all");
  const difficulty = ref("all");
  const readingTimeBucket = ref("all"); // 'all' | 'under5' | '5to10' | 'over10'
  const sortBy = ref("newest"); // 'newest' | 'oldest' | 'popular' | 'trending' | 'az'
  const page = ref(1);

  const prerenderState = inject(PRERENDER_STATE, null);
  const collection = fetchFn.collection; // "articles" | "blogs" (services/posts.js)
  const stateKey = collection ? `list:${collection}` : null;

  if (import.meta.env.SSR) {
    onServerPrefetch(async () => {
      if (!collection) return;
      try {
        posts.value = (await getServerPosts(collection)).map(toListItem);
      } catch (err) {
        console.error("[post-listing] server render failed:", err);
        error.value = "Could not load posts. Check the server connection.";
      }
      loading.value = false;
      if (prerenderState && !error.value) prerenderState[stateKey] = posts.value;
    });
  } else {
    const prerendered = stateKey ? prerenderState?.[stateKey] : null;
    if (prerendered) {
      delete prerenderState[stateKey];
      posts.value = reviveDates(prerendered);
      loading.value = false;
    } else {
      onMounted(async () => {
        try {
          posts.value = await fetchFn({ publishedOnly: true });
        } catch (err) {
          console.error("[post-listing] load failed:", err.code, err.message, err);
          error.value = import.meta.env.DEV
            ? `${err.code || "unknown-error"} — ${err.message || "Load failed."}`
            : "Could not load posts. Check the server connection.";
        } finally {
          loading.value = false;
        }
      });
    }
  }

  const categories = computed(() => {
    const set = new Set(posts.value.map((p) => p.category).filter(Boolean));
    return ["all", ...set];
  });

  const allTags = computed(() => {
    const set = new Set(posts.value.flatMap((p) => p.tags || []));
    return [...set].sort();
  });

  // Mirrors `categories`: entirely derived from whatever posts actually have
  // a `difficulty` set, so a new difficulty label an editor starts using
  // shows up as a filterable option with no frontend change required.
  const difficulties = computed(() => {
    const set = new Set(posts.value.map((p) => p.difficulty).filter(Boolean));
    return ["all", ...set];
  });

  function matchesReadingTimeBucket(minutes, bucket) {
    if (bucket === "all") return true;
    const t = minutes || 0;
    if (bucket === "under5") return t < 5;
    if (bucket === "5to10") return t >= 5 && t <= 10;
    if (bucket === "over10") return t > 10;
    return true;
  }

  // Multiple posts can be marked featured — used for the hero carousel.
  const featuredPosts = computed(() => {
    const marked = posts.value.filter((p) => p.featured);
    return marked.length ? marked : posts.value.slice(0, 1);
  });
  const featured = computed(() => featuredPosts.value[0] || null);

  const byViewsDesc = computed(() =>
    [...posts.value].sort((a, b) => (b.views || 0) - (a.views || 0)),
  );
  const trending = computed(() => byViewsDesc.value.slice(0, 5));
  // The next tier down from Trending — a distinct section, not a repeat.
  const editorsChoice = computed(() => byViewsDesc.value.slice(5, 9));

  const recentlyUpdated = computed(() =>
    [...posts.value]
      .filter(
        (p) =>
          p.updatedAt &&
          p.createdAt &&
          p.updatedAt.getTime() - p.createdAt.getTime() > 60000,
      )
      .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))
      .slice(0, 6),
  );

  const filtered = computed(() => {
    const q = search.value.trim().toLowerCase();
    return posts.value.filter((p) => {
      if (
        q &&
        !p.title?.toLowerCase().includes(q) &&
        !p.description?.toLowerCase().includes(q)
      )
        return false;
      if (category.value !== "all" && p.category !== category.value)
        return false;
      if (tag.value !== "all" && !p.tags?.includes(tag.value)) return false;
      if (difficulty.value !== "all" && p.difficulty !== difficulty.value)
        return false;
      if (!matchesReadingTimeBucket(p.readingTime, readingTimeBucket.value))
        return false;
      return true;
    });
  });

  const isFiltering = computed(
    () =>
      !!search.value.trim() ||
      category.value !== "all" ||
      tag.value !== "all" ||
      difficulty.value !== "all" ||
      readingTimeBucket.value !== "all",
  );

  const featuredIds = computed(
    () => new Set(featuredPosts.value.map((p) => p.id)),
  );

  // "Trending" favors what's both popular AND recent (views per day since
  // publish), so an old post's all-time view count can't bury this week's
  // breakout — distinct from "Popular", which is a pure all-time view sort.
  const latest = computed(() => {
    const base = isFiltering.value
      ? filtered.value
      : posts.value.filter((p) => !featuredIds.value.has(p.id));
    const sorted = [...base];
    if (sortBy.value === "oldest")
      sorted.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
    else if (sortBy.value === "popular")
      sorted.sort((a, b) => (b.views || 0) - (a.views || 0));
    else if (sortBy.value === "trending") {
      const score = (p) => {
        const ageDays = p.createdAt
          ? Math.max(1, (Date.now() - p.createdAt.getTime()) / 86400000)
          : 1;
        return (p.views || 0) / ageDays;
      };
      sorted.sort((a, b) => score(b) - score(a));
    } else if (sortBy.value === "az")
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    else sorted.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    return sorted;
  });

  watch([search, category, tag, difficulty, readingTimeBucket, sortBy], () => {
    page.value = 1;
  });

  const totalPages = computed(() =>
    Math.max(1, Math.ceil(latest.value.length / PAGE_SIZE)),
  );

  const paged = computed(() => {
    const start = (page.value - 1) * PAGE_SIZE;
    return latest.value.slice(start, start + PAGE_SIZE);
  });

  function relatedTo(post, count = 3) {
    return posts.value
      .filter((p) => p.id !== post.id && p.category === post.category)
      .slice(0, count);
  }

  return {
    posts,
    loading,
    error,
    search,
    category,
    tag,
    difficulty,
    readingTimeBucket,
    sortBy,
    page,
    categories,
    allTags,
    difficulties,
    featured,
    featuredPosts,
    trending,
    editorsChoice,
    recentlyUpdated,
    isFiltering,
    latest,
    paged,
    totalPages,
    relatedTo,
  };
}
