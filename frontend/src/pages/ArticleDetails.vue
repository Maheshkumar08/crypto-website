<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";

import {
  getArticle,
  getArticles,
  incrementArticleViews,
} from "../services/articles";

import ArticlePage from "../components/article/ArticlePage.vue";

const route = useRoute();

const guidePaths = [
  "getting-started",
  "safety",
  "coins",
  "exchanges",
  "taxes",
  "glossary",
];

const basePath = computed(() => {
  const first = route.path.split("/")[1];

  return guidePaths.includes(first) ? `/${first}` : "/articles";
});

const listRouteName = computed(() => {
  const first = route.path.split("/")[1];

  return guidePaths.includes(first) ? first : "articles";
});
</script>

<template>
  <ArticlePage
    :get-fn="getArticle"
    :list-fn="getArticles"
    :increment-views-fn="incrementArticleViews"
    :base-path="basePath"
    :list-route-name="listRouteName"
    json-ld-type="Article"
    collection="articles"
  />
</template>
