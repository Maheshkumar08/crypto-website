// Vite dedupes repeated dynamic import() calls for the same module, so
// calling a route's loader again on hover just warms the browser's cache
// before the user actually clicks — no separate prefetch API needed.
const loaders = {
  'blog-details': () => import('../pages/BlogDetails.vue'),
  'article-details': () => import('../pages/ArticleDetails.vue'),
}

export function prefetchRoute(name) {
  loaders[name]?.()
}
