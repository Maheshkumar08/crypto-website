<script setup>
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
import { getPageBySlug } from "../services/pages";
import { useSeoMeta, SITE_URL } from "../composables/useSeoMeta";
import { sanitizeArticleHtml } from "../composables/sanitizeArticleHtml";
import { breadcrumbSchema } from "../composables/seoSchemas";
import { formatDate } from "../composables/text";
import {
  PRERENDER_STATE,
  getServerPage,
  reviveDates,
} from "../composables/serverData";
import { useAuthStore } from "../stores/auth";
import NotFound from "./NotFound.vue";

const route = useRoute();
const authStore = useAuthStore();
const prerenderState = inject(PRERENDER_STATE, null);

const page = ref(null);
const loading = ref(true);
const notFound = ref(false);

const sanitizedContent = computed(() =>
  page.value?.content ? sanitizeArticleHtml(page.value.content) : "",
);

useSeoMeta(() => {
  if (notFound.value || !page.value) {
    return {
      title: "Page Not Found",
      description: "The requested page could not be found.",
      path: route.path,
    };
  }

  return {
    title: page.value.seoTitle || page.value.title,
    description:
      page.value.metaDescription || page.value.shortDescription || "",
    path: `/${page.value.slug}`,
    canonical: `${SITE_URL}/${page.value.slug}`,
    image: page.value.coverImage || "",
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebPage",
          "@id": `${SITE_URL}/${page.value.slug}#webpage`,
          url: `${SITE_URL}/${page.value.slug}`,
          name: page.value.seoTitle || page.value.title,
          description:
            page.value.metaDescription || page.value.shortDescription || undefined,
          dateModified: page.value.updatedAt?.toISOString?.(),
          isPartOf: { "@id": `${SITE_URL}/#organization` },
        },
        breadcrumbSchema([{ label: page.value.title }]),
      ],
    },
  };
});

async function fetchPage() {
  const slug = route.params.slug;

  loading.value = true;
  notFound.value = false;

  if (!slug) {
    page.value = null;
    loading.value = false;
    notFound.value = true;
    return;
  }

  try {
    const data = await getPageBySlug(slug);

    if (!data) {
      page.value = null;
      notFound.value = true;
      return;
    }

    if (!data.published && !authStore.isAuthenticated) {
      page.value = null;
      notFound.value = true;
      return;
    }

    page.value = data;
  } catch (err) {
    console.error("[PageView]", err);
    page.value = null;
    notFound.value = true;
  } finally {
    loading.value = false;
  }
}

const stateKey = `page:${route.params.slug}`;

if (import.meta.env.SSR) {
  // Rendered by the Express backend from MongoDB. The
  // server has no admin session, so unpublished pages render as 404.
  const ssrContext = useSSRContext();

  onServerPrefetch(async () => {
    let data = null;
    try {
      data = await getServerPage(route.params.slug);
    } catch (err) {
      console.error("[PageView] server render failed:", err);
    }
    page.value = data?.published ? data : null;
    notFound.value = !page.value;
    loading.value = false;

    if (ssrContext && notFound.value) ssrContext.statusCode = 404;
    if (prerenderState) {
      prerenderState[stateKey] = page.value
        ? { page: page.value }
        : { notFound: true, draft: !!data };
    }
  });
} else {
  const prerendered = prerenderState?.[stateKey];

  if (prerendered) {
    // Hydrate from exactly what the server rendered — no API request.
    delete prerenderState[stateKey];
    const state = reviveDates(prerendered);
    page.value = state.page || null;
    notFound.value = !!state.notFound;
    loading.value = false;

    // Draft preview: an unpublished page is only fetched (from the browser,
    // with the admin's own session) when a signed-in admin opens it.
    if (state.draft) {
      onMounted(async () => {
        await authStore.ensureLoaded();
        if (authStore.isAuthenticated) fetchPage();
      });
    }
  }

  watch(
    () => route.params.slug,
    () => {
      fetchPage();
    },
    {
      immediate: !prerendered,
    },
  );
}
</script>


<template>
  <div>
    <div
      v-if="loading"
      class="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 animate-pulse"
    >
      <div class="h-80 w-full rounded-3xl bg-slate-200 mb-8"></div>
      <div class="h-10 w-3/4 rounded-xl bg-slate-200"></div>
      <div class="mt-4 h-4 w-1/2 rounded bg-slate-200"></div>

      <div class="mt-10 space-y-4">
        <div class="h-4 w-full rounded bg-slate-200"></div>
        <div class="h-4 w-5/6 rounded bg-slate-200"></div>
        <div class="h-4 w-4/6 rounded bg-slate-200"></div>
      </div>
    </div>

    <NotFound v-else-if="notFound || !page" />

    <article v-else class="relative min-h-[70vh] py-12 sm:py-16">
      <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div
          v-if="!page.published"
          class="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
        >
          <div class="flex items-center gap-2">
            <span class="inline-block h-2 w-2 rounded-full bg-amber-500"></span>

            <span>
              <strong>Draft preview:</strong>
              This page is unpublished and only visible to signed-in admins.
            </span>
          </div>

          <router-link
            :to="{
              name: 'admin-page-edit',
              params: {
                id: page.id,
              },
            }"
            class="font-medium underline"
          >
            Edit in Admin
          </router-link>
        </div>

        <div
          v-if="page.coverImage"
          class="mb-10 overflow-hidden rounded-3xl border border-slate-200 shadow-sm"
        >
          <img
            :src="page.coverImage"
            :alt="page.title"
            class="w-full max-h-[520px] object-cover"
          />
        </div>

        <header class="mb-10">
          <h1
            class="font-display text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl md:text-5xl lg:text-6xl"
          >
            {{ page.title }}
          </h1>

          <p
            v-if="page.shortDescription"
            class="mt-4 text-lg leading-relaxed text-gray-600"
          >
            {{ page.shortDescription }}
          </p>

          <div v-if="page.updatedAt" class="mt-4 text-xs text-gray-400">
            Updated on {{ formatDate(page.updatedAt) }}
          </div>
        </header>

        <div class="article-content" v-html="sanitizedContent"></div>
      </div>
    </article>
  </div>
</template>
