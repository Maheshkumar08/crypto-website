<script setup>
import {
  getArticle,
  getArticles,
  incrementArticleViews,
} from "../services/articles";

import ArticlePage from "../components/article/ArticlePage.vue";
</script>

<template>
  <ArticlePage
    :get-fn="getArticle"
    :list-fn="getArticles"
    :increment-views-fn="incrementArticleViews"
    base-path="/exchanges"
    list-route-name="articles"
    json-ld-type="Article"
  />
</template>
