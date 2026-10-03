import { handleRouteScroll } from "../composables/routeScroll";

// IMPORTANT
export const routes = [
  { path: "/", name: "home", component: () => import("../pages/Home.vue") },

  {
    path: "/about",
    name: "about",
    component: () => import("../pages/About.vue"),
  },

  {
    path: "/contact",
    name: "contact",
    component: () => import("../pages/Contact.vue"),
  },

  {
    path: "/blog",
    name: "blog",
    component: () => import("../pages/Blog.vue"),
  },

  {
    path: "/blog/:slug",
    name: "blog-details",
    component: () => import("../pages/BlogDetails.vue"),
    meta: { serverRendered: true },
  },

  {
    path: "/articles",
    name: "articles",
    component: () => import("../pages/Articles.vue"),
  },

  {
    path: "/articles/:slug",
    name: "article-details",
    component: () => import("../pages/ArticleDetails.vue"),
    meta: { serverRendered: true },
  },
  {
    path: "/getting-started/:slug",
    name: "guide-getting-started",
    component: () => import("../pages/ArticleDetails.vue"),
    meta: { serverRendered: true },
  },

  {
    path: "/safety/:slug",
    name: "guide-safety",
    component: () => import("../pages/ArticleDetails.vue"),
    meta: { serverRendered: true },
  },

  {
    path: "/coins/:slug",
    name: "guide-coins",
    component: () => import("../pages/ArticleDetails.vue"),
    meta: { serverRendered: true },
  },

  {
    path: "/exchanges/:slug",
    name: "guide-exchanges",
    component: () => import("../pages/ArticleDetails.vue"),
    meta: { serverRendered: true },
  },

  {
    path: "/taxes/:slug",
    name: "guide-taxes",
    component: () => import("../pages/ArticleDetails.vue"),
    meta: { serverRendered: true },
  },

  {
    path: "/glossary/:slug",
    name: "guide-glossary",
    component: () => import("../pages/ArticleDetails.vue"),
    meta: { serverRendered: true },
  },
  // ================= ADMIN =================

  {
    path: "/admin/login",
    name: "admin-login",
    component: () => import("../pages/admin/Login.vue"),
    meta: { layout: "auth" },
  },

  {
    path: "/admin",
    redirect: {
      name: "admin-dashboard",
    },
  },

  {
    path: "/admin/dashboard",
    name: "admin-dashboard",
    component: () => import("../pages/admin/Dashboard.vue"),
    meta: {
      layout: "admin",
      requiresAuth: true,
    },
  },

  {
    path: "/admin/blogs",
    name: "admin-blogs",
    component: () => import("../pages/admin/BlogList.vue"),
    meta: {
      layout: "admin",
      requiresAuth: true,
    },
  },

  {
    path: "/admin/blogs/new",
    name: "admin-blog-new",
    component: () => import("../pages/admin/PostEditor.vue"),
    props: {
      postType: "blog",
    },
    meta: {
      layout: "admin",
      requiresAuth: true,
    },
  },

  {
    path: "/admin/blogs/:id/edit",
    name: "admin-blog-edit",
    component: () => import("../pages/admin/PostEditor.vue"),
    props: (route) => ({
      postType: "blog",
      id: route.params.id,
    }),
    meta: {
      layout: "admin",
      requiresAuth: true,
    },
  },

  {
    path: "/admin/articles",
    name: "admin-articles",
    component: () => import("../pages/admin/ArticleList.vue"),
    meta: {
      layout: "admin",
      requiresAuth: true,
    },
  },

  {
    path: "/admin/articles/new",
    name: "admin-article-new",
    component: () => import("../pages/admin/PostEditor.vue"),
    props: {
      postType: "article",
    },
    meta: {
      layout: "admin",
      requiresAuth: true,
    },
  },

  {
    path: "/admin/articles/:id/edit",
    name: "admin-article-edit",
    component: () => import("../pages/admin/PostEditor.vue"),
    props: (route) => ({
      postType: "article",
      id: route.params.id,
    }),
    meta: {
      layout: "admin",
      requiresAuth: true,
    },
  },

  {
    path: "/admin/guides",
    name: "admin-guides",
    component: () => import("../pages/admin/GuideCardList.vue"),
    meta: {
      layout: "admin",
      requiresAuth: true,
    },
  },

  {
    path: "/admin/guides/new",
    name: "admin-guide-new",
    component: () => import("../pages/admin/GuideCardEditor.vue"),
    meta: {
      layout: "admin",
      requiresAuth: true,
    },
  },

  {
    path: "/admin/guides/:id/edit",
    name: "admin-guide-edit",
    component: () => import("../pages/admin/GuideCardEditor.vue"),
    props: (route) => ({
      id: route.params.id,
    }),
    meta: {
      layout: "admin",
      requiresAuth: true,
    },
  },

  {
    path: "/admin/pages",
    name: "admin-pages",
    component: () => import("../pages/admin/PageList.vue"),
    meta: {
      layout: "admin",
      requiresAuth: true,
    },
  },

  {
    path: "/admin/pages/new",
    name: "admin-page-new",
    component: () => import("../pages/admin/PageEditor.vue"),
    meta: {
      layout: "admin",
      requiresAuth: true,
    },
  },

  {
    path: "/admin/pages/:id/edit",
    name: "admin-page-edit",
    component: () => import("../pages/admin/PageEditor.vue"),
    props: (route) => ({
      id: route.params.id,
    }),
    meta: {
      layout: "admin",
      requiresAuth: true,
    },
  },

  // ============ PAGES ============

  {
    path: "/getting-started",
    component: () => import("../views/Learn.vue"),
  },

  {
    path: "/safety",
    component: () => import("../views/Safety.vue"),
  },

  {
    path: "/coins",
    component: () => import("../views/coin.vue"),
  },

  {
    path: "/exchanges",
    component: () => import("../views/Exchanges.vue"),
  },

  {
    path: "/taxes",
    component: () => import("../views/Taxes.vue"),
  },

  {
    path: "/glossary",
    component: () => import("../views/Glossary.vue"),
  },

  {
    path: "/privacy",
    component: () => import("../views/Privacy.vue"),
  },

  {
    path: "/terms",
    component: () => import("../views/Terms.vue"),
  },

  {
    path: "/disclosures",
    component: () => import("../views/Disclosures.vue"),
  },

  {
    path: "/category/:slug",
    name: "category",
    component: () => import("../pages/TaxonomyArchive.vue"),
    props: { kind: "category" },
    meta: { serverRendered: true },
  },

  {
    path: "/tag/:slug",
    name: "tag",
    component: () => import("../pages/TaxonomyArchive.vue"),
    props: { kind: "tag" },
    meta: { serverRendered: true },
  },

  {
    path: "/:slug",
    name: "page-view",
    component: () => import("../pages/PageView.vue"),
    meta: { serverRendered: true },
  },

  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: () => import("../pages/NotFound.vue"),
  },
];

// The app is created by createApp() (src/main.js), which builds its own
// router from these options. Everything the router needs — scrollBehavior
// included — must live here; a router created anywhere else is never the
// one that actually handles navigation.
export const routerOptions = {
  routes,
  scrollBehavior: handleRouteScroll,
};

/**
 * Marketing pages remount on every path change, so a navigation behaves
 * like a fresh page load (onMounted animations, data fetching, ScrollTriggers
 * all start clean). Admin/auth views keep their instance across in-place URL
 * updates, e.g. the editor's `new` → `:id/edit` replace after a first save.
 */
export function pageKey(route) {
  return route.meta.layout ? undefined : route.path;
}

export function installGuards(router) {
  router.beforeEach(serverRenderedNavigation);
  router.beforeEach(requireAuth);
}

/**
 * Routes marked `serverRendered` (articles, blog posts, pages, categories,
 * tags) are rendered by the Express backend straight from MongoDB. Moving
 * to one inside the app does a normal page load, so the server renders it
 * too and the page always arrives as complete HTML — in `npm run dev` as
 * well, where the Vite dev server proxies these routes to the backend.
 */
function serverRenderedNavigation(to, from) {
  // The very first navigation is the page the server just rendered.
  if (!from.matched.length) return true;
  if (!to.meta.serverRendered || to.path === from.path) return true;

  window.location.assign(to.fullPath);
  return false;
}

async function requireAuth(to) {
  if (!to.meta.requiresAuth) return true;

  try {
    const { useAuthStore } = await import("../stores/auth");

    const auth = useAuthStore();

    await auth.ensureLoaded();

    if (!auth.isAuthenticated) {
      return {
        name: "admin-login",
        query: {
          redirect: to.fullPath,
        },
      };
    }

    return true;
  } catch {
    return {
      name: "admin-login",
      query: {
        redirect: to.fullPath,
      },
    };
  }
}
