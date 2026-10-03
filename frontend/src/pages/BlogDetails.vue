<script setup>
import { getBlog, getBlogs, incrementBlogViews } from '../services/blogs'
import ArticlePage from '../components/article/ArticlePage.vue'
</script>

<template>
  <ArticlePage
    :get-fn="getBlog"
    :list-fn="getBlogs"
    :increment-views-fn="incrementBlogViews"
    base-path="/blog"
    list-route-name="blog"
    json-ld-type="BlogPosting"
    collection="blogs"
  />
</template>
