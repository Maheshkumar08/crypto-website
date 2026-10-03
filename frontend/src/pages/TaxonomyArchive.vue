<script setup>
import {
  computed,
  inject,
  onServerPrefetch,
  ref,
  useSSRContext,
  watch,
} from "vue";
import { useRoute } from "vue-router";
import { getArticles } from "../services/articles";
import { getBlogs } from "../services/blogs";
import { useSeoMeta, SITE_URL } from "../composables/useSeoMeta";
import { breadcrumbSchema } from "../composables/seoSchemas";
import { slugify } from "../composables/text";
import {
  PRERENDER_STATE,
  getServerPosts,
  reviveDates,
} from "../composables/serverData";
import PageHero from "../components/sections/PageHero.vue";
import BlogCard from "../components/sections/blog/BlogCard.vue";
import NotFound from "./NotFound.vue";

/**
 * /category/:slug and /tag/:slug — every published article and blog post
 * whose category (or one of whose tags) slugifies to :slug. Rendered by the
 * Express backend from MongoDB; the browser hydrates from embedded data.
 */
const props = defineProps({
  kind: { type: String, required: true }, // 'category' | 'tag'
});

const route = useRoute();
const prerenderState = inject(PRERENDER_STATE, null);

const label = ref("");
const items = ref([]);
const loading = ref(true);

const stateKey = `${props.kind}:${route.params.slug}`;
const kindLabel = computed(() => (props.kind === "tag" ? "Tag" : "Category"));
const path = computed(() => `/${props.kind}/${route.params.slug}`);

function toCard({ content, faqs, keyTakeaways, ...rest }, basePath) {
  return { ...rest, basePath };
}

function matches(post, slug) {
  if (props.kind === "tag") {
    return (post.tags || []).some((t) => slugify(String(t)) === slug);
  }
  return !!post.category && slugify(post.category) === slug;
}

function labelFor(post, slug) {
  if (props.kind === "tag") {
    return (post.tags || []).find((t) => slugify(String(t)) === slug) || slug;
  }
  return post.category;
}

function select(articles, blogs, slug) {
  const found = [
    ...articles.filter((p) => matches(p, slug)).map((p) => toCard(p, "/articles")),
    ...blogs.filter((p) => matches(p, slug)).map((p) => toCard(p, "/blog")),
  ].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

  items.value = found;
  label.value = found.length ? labelFor(found[0], slug) : "";
  loading.value = false;
}

if (import.meta.env.SSR) {
  const ssrContext = useSSRContext();

  onServerPrefetch(async () => {
    const [articles, blogs] = await Promise.all([
      getServerPosts("articles"),
      getServerPosts("blogs"),
    ]);
    select(articles, blogs, route.params.slug);

    if (ssrContext && !items.value.length) ssrContext.statusCode = 404;
    if (prerenderState) {
      prerenderState[stateKey] = { label: label.value, items: items.value };
    }
  });
} else {
  const prerendered = prerenderState?.[stateKey];

  if (prerendered) {
    delete prerenderState[stateKey];
    const state = reviveDates(prerendered);
    label.value = state.label;
    items.value = state.items;
    loading.value = false;
  }

  // `npm run dev` only — in production the backend renders this page.
  watch(
    () => route.params.slug,
    async (slug) => {
      loading.value = true;
      const [articles, blogs] = await Promise.all([getArticles(), getBlogs()]);
      select(articles, blogs, slug);
    },
    { immediate: !prerendered },
  );
}

useSeoMeta(() => {
  if (loading.value || !items.value.length) return null;

  const url = `${SITE_URL}${path.value}`;
  const title = `${label.value} — ${kindLabel.value}`;
  const description = `${items.value.length} plain-language ${
    items.value.length === 1 ? "guide" : "guides"
  } on ${label.value} from the cryptolearner.us team.`;

  return {
    title,
    description,
    path: path.value,
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "CollectionPage",
          "@id": `${url}#collection`,
          url,
          name: title,
          description,
          isPartOf: { "@id": `${SITE_URL}/#organization` },
          mainEntity: {
            "@type": "ItemList",
            itemListElement: items.value.map((p, i) => ({
              "@type": "ListItem",
              position: i + 1,
              url: `${SITE_URL}${p.basePath}/${p.slug}`,
              name: p.title,
            })),
          },
        },
        breadcrumbSchema([{ label: `${kindLabel.value}: ${label.value}` }]),
      ],
    },
  };
});
</script>

<template>
  <div v-if="loading" class="px-6 pt-40 pb-16">
    <div class="mx-auto max-w-3xl animate-pulse space-y-6 text-center">
      <div class="mx-auto h-4 w-40 rounded-full bg-slate-100" />
      <div class="mx-auto h-10 w-3/4 rounded-2xl bg-slate-100" />
    </div>
  </div>

  <NotFound v-else-if="!items.length" />

  <div v-else>
    <PageHero
      :eyebrow="kindLabel"
      :heading="label"
      :subtitle="`${items.length} ${items.length === 1 ? 'article' : 'articles'}`"
    />

    <section class="px-6 pb-24 lg:px-10">
      <div
        class="mx-auto grid max-w-6xl grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3"
      >
        <BlogCard
          v-for="post in items"
          :key="post.id"
          :post="post"
          :base-path="post.basePath"
        />
      </div>
    </section>
  </div>
</template>
