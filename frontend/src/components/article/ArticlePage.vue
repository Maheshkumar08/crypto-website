<script setup>
import { computed, ref } from "vue";
import { usePostDetails } from "../../composables/usePostDetails";
import { useSeoMeta, SITE_URL } from "../../composables/useSeoMeta";
import { articlePageSchema } from "../../composables/seoSchemas";
import TagList from "../posts/TagList.vue";

import ReadingProgress from "./ReadingProgress.vue";
import ArticleHero from "./ArticleHero.vue";
import TableOfContents from "./TableOfContents.vue";
import ArticleContent from "./ArticleContent.vue";
import AuthorCard from "./AuthorCard.vue";
import ShareButtons from "./ShareButtons.vue";
import RelatedArticles from "./RelatedArticles.vue";

import NextPrevious from "./NextPrevious.vue";

const props = defineProps({
  getFn: { type: Function, required: true },
  listFn: { type: Function, required: true },
  incrementViewsFn: { type: Function, default: null },
  basePath: { type: String, required: true }, // '/blog'
  listRouteName: { type: String, required: true }, // 'blog'
  jsonLdType: { type: String, default: "BlogPosting" },
  collection: { type: String, default: "" }, // 'articles' | 'blogs' — the server renderer's data source
});

const {
  post,
  loading,
  notFound,
  error,
  contentHtml,
  headings,
  related,
  prevPost,
  nextPost,
} = usePostDetails({
  getFn: props.getFn,
  listFn: props.listFn,
  incrementViewsFn: props.incrementViewsFn,
  collection: props.collection,
});

const articleEl = ref(null);
const listLabel = computed(() =>
  props.listRouteName === "blog" ? "Blog" : "Articles",
);
const shareUrl = computed(() =>
  post.value ? `${SITE_URL}${props.basePath}/${post.value.slug}` : SITE_URL,
);

useSeoMeta(() => {
  if (!post.value) return null;
  const p = post.value;
  const path = `${props.basePath}/${p.slug}`;
  const url = `${SITE_URL}${path}`;
  return {
    title: p.seoTitle || p.title,
    description: p.seoDescription || p.description,
    path,
    canonical: p.canonicalUrl || url,
    image: p.ogImage || p.coverImage,
    keywords: p.focusKeyword || p.tags?.join(", "),
    type: "article",
    // Optional per-post overrides (empty → the title/description above).
    ogTitle: p.ogTitle,
    ogDescription: p.ogDescription,
    twitterTitle: p.twitterTitle,
    twitterDescription: p.twitterDescription,
    publishedTime: p.createdAt?.toISOString?.(),
    modifiedTime: (p.updatedAt || p.createdAt)?.toISOString?.(),
    jsonLd: articlePageSchema({
      post: p,
      url,
      kind: props.jsonLdType,
      breadcrumbItems: [
        { label: listLabel.value, path: props.basePath },
        { label: p.title },
      ],
    }),
  };
});
</script>

<template>
  <ReadingProgress v-if="post" :target="articleEl" />

  <div v-if="loading" class="px-6 pt-40 pb-16">
    <div class="mx-auto max-w-3xl animate-pulse space-y-6 text-center">
      <div class="mx-auto h-4 w-40 rounded-full bg-slate-100" />
      <div class="mx-auto h-10 w-3/4 rounded-2xl bg-slate-100" />
      <div class="mx-auto h-10 w-1/2 rounded-2xl bg-slate-100" />
      <div
        class="mx-auto mt-10 h-[380px] w-full max-w-4xl rounded-[2rem] bg-slate-100"
      />
    </div>
  </div>

  <div
    v-else-if="notFound || error"
    class="mx-auto max-w-lg px-6 pt-40 pb-16 text-center"
  >
    <h1 class="font-display text-3xl font-bold text-gray-900">
      {{ error ? "Something went wrong" : "Article not found" }}
    </h1>
    <p class="mt-3 text-gray-500">
      {{ error || "This article may have been unpublished or moved." }}
    </p>
    <router-link
      :to="{ name: listRouteName }"
      class="mt-6 inline-block text-sm font-medium text-blue-600 hover:text-blue-700"
    >
      ← Back to {{ listLabel }}
    </router-link>
  </div>

  <article v-else ref="articleEl" class="bg-white pb-16">
    <ArticleHero :post="post" :base-path="basePath" :list-label="listLabel" />

    <div class="mt-16 px-6 lg:px-10">
      <div
        class="mx-auto grid max-w-6xl grid-cols-1 gap-14 lg:grid-cols-[1fr,300px]"
      >
        <div class="min-w-0 lg:order-1">
          <ArticleContent :html="contentHtml" />

          <div
            v-if="post.tags?.length"
            class="mt-10 border-t border-slate-100 pt-8"
          >
            <TagList :tags="post.tags" />
          </div>

          <div class="mt-8 border-t border-slate-100 pt-8">
            <p class="mb-3 text-sm font-medium text-gray-500">
              Share this article
            </p>
            <ShareButtons :title="post.title" :url="shareUrl" />
          </div>

          <div class="mt-8 lg:hidden">
            <AuthorCard :author="post.author" />
          </div>

          <div class="mt-10 border-t border-slate-100 pt-8">
            <NextPrevious
              :prev-post="prevPost"
              :next-post="nextPost"
              :base-path="basePath"
            />
          </div>
        </div>

        <aside class="hidden lg:order-2 lg:block">
          <div class="sticky top-28 space-y-6">
            <TableOfContents :headings="headings" />
            <AuthorCard :author="post.author" />
          </div>
        </aside>
      </div>
    </div>
  </article>

  <RelatedArticles v-if="post" :posts="related" :base-path="basePath" />
</template>
