<script setup>
import { inject, onMounted, onBeforeUnmount, onServerPrefetch, ref } from "vue";
import { getPages } from "../../../services/pages";
import { revealHeading, revealUp } from "../../../composables/useReveal";
import { attachTilt } from "../../../composables/useTilt";
import { PRERENDER_STATE, getServerPageList, reviveDates } from "../../../composables/serverData";

const sectionEl = ref(null);
const headingEl = ref(null);
const gridEl = ref(null);
const cardEls = ref([]);
const pages = ref([]);
const loading = ref(true);
let cleanups = [];

// Loaded on the server (the cards are in the page's HTML) and handed to the
// browser in the page state; fetched in the browser only without it.
const prerenderState = inject(PRERENDER_STATE, null);
const STATE_KEY = "explore-pages";

if (import.meta.env.SSR) {
  onServerPrefetch(async () => {
    try {
      pages.value = (await getServerPageList()).map(({ content, ...page }) => page);
      if (prerenderState) prerenderState[STATE_KEY] = pages.value;
    } catch (err) {
      console.error("[ExplorePages] server render failed:", err);
    }
    loading.value = false;
  });
} else if (prerenderState?.[STATE_KEY]) {
  pages.value = reviveDates(prerenderState[STATE_KEY]);
  delete prerenderState[STATE_KEY];
  loading.value = false;
}

onMounted(async () => {
  if (loading.value) {
    try {
      pages.value = await getPages({ publishedOnly: true });
    } catch (err) {
      console.error("[ExplorePages] Failed to load pages:", err);
    } finally {
      loading.value = false;
    }
  }

  if (headingEl.value && sectionEl.value) {
    revealHeading(headingEl.value, {
      type: "words",
      trigger: sectionEl.value,
      stagger: 0.03,
    });
  }

  if (gridEl.value?.children?.length) {
    revealUp(gridEl.value.children, {
      trigger: gridEl.value,
      start: "top 85%",
      y: 40,
      stagger: 0.08,
    });

    cleanups = cardEls.value.filter(Boolean).map((el) => attachTilt(el, { max: 4 }));
  }
});

onBeforeUnmount(() => {
  cleanups.forEach((fn) => fn());
});
</script>

<template>
  <section
    v-if="loading || pages.length"
    ref="sectionEl"
    class="relative mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-18"
  >
    <!-- Section Header -->
    <div class="mx-auto max-w-3xl text-center">
      <span
        class="inline-flex rounded-full bg-blue-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600 border border-blue-100"
      >
        Featured Learning Pages
      </span>

      <h2
        ref="headingEl"
        class="mt-5 text-3xl font-extrabold tracking-tight text-[#0D1B2A] sm:text-4xl md:text-5xl"
      >
        Explore <span class="text-[#0D8BF2]">Pages</span>
      </h2>

      <p class="mx-auto mt-4 max-w-2xl text-base sm:text-lg leading-relaxed text-slate-600">
        In-depth standalone learning hubs covering core crypto, blockchain, and Web3 topics from start to finish.
      </p>
    </div>

    <!-- Skeletons while loading -->
    <div
      v-if="loading"
      class="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
    >
      <div
        v-for="i in 3"
        :key="i"
        class="overflow-hidden rounded-3xl border border-slate-200 bg-white p-4 shadow-sm animate-pulse"
      >
        <div class="h-48 w-full rounded-2xl bg-slate-200" />
        <div class="p-4 space-y-3">
          <div class="h-5 w-3/4 rounded bg-slate-200" />
          <div class="h-4 w-full rounded bg-slate-200" />
          <div class="h-4 w-2/3 rounded bg-slate-200" />
        </div>
      </div>
    </div>

    <!-- Page Cards Grid -->
    <div
      v-else-if="pages.length"
      ref="gridEl"
      class="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
    >
      <RouterLink
        v-for="(page, i) in pages"
        :key="page.id || page.slug"
        :to="'/' + page.slug"
        :ref="(el) => (cardEls[i] = el?.$el ?? el)"
        class="group flex flex-col overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-blue-300 hover:shadow-xl"
      >
        <!-- Cover Image or Clean Branded Placeholder -->
        <div class="relative h-52 w-full overflow-hidden bg-slate-100">
          <img
            v-if="page.coverImage"
            :src="page.coverImage"
            :alt="page.title"
            loading="lazy"
            class="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />

          <!-- Placeholder when no image exists -->
          <div
            v-else
            class="relative flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-600 to-sky-500 p-6 text-white"
          >
            <!-- Decorative circle blur -->
            <div
              class="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-xl pointer-events-none"
            />
            <div
              class="absolute -left-8 -bottom-8 h-32 w-32 rounded-full bg-black/10 blur-xl pointer-events-none"
            />

            <div
              class="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur shadow-sm transition-transform duration-300 group-hover:scale-110"
            >
              <svg
                class="h-7 w-7 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
                <path d="M6 6h10" />
                <path d="M6 10h10" />
              </svg>
            </div>
            <span class="mt-3 text-xs font-semibold uppercase tracking-wider text-blue-100">
              Learning Page
            </span>
          </div>
        </div>

        <!-- Card Body -->
        <div class="flex flex-1 flex-col justify-between p-6 sm:p-7">
          <div>
            <h3
              class="text-xl font-bold text-slate-900 transition-colors group-hover:text-blue-600 line-clamp-2"
            >
              {{ page.title }}
            </h3>

            <p class="mt-3 text-sm leading-relaxed text-slate-600 line-clamp-3">
              {{ page.shortDescription || 'Read our in-depth guide to understand the concepts, mechanics, and best practices.' }}
            </p>
          </div>

          <!-- Card Footer / Read More Button -->
          <div class="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
            <span
              class="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 transition-colors group-hover:text-blue-700"
            >
              Read More
              <svg
                class="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </span>

            <span
              class="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 transition-colors group-hover:bg-blue-600 group-hover:text-white"
            >
              Guide
            </span>
          </div>
        </div>
      </RouterLink>
    </div>
  </section>
</template>
