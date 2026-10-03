<script setup>
import { computed, nextTick, onMounted, ref, watch } from "vue";
import { getBlogs } from "../services/blogs";
import { usePostListing } from "../composables/usePostListing";
import { useSeoMeta, SITE_URL } from "../composables/useSeoMeta";
import { gsap } from "../composables/gsapSetup";
import BlogSidebar from "../components/sections/blog/BlogSidebar.vue";
import BlogSidebarSkeleton from "../components/sections/blog/BlogSidebarSkeleton.vue";
import SearchBar from "../components/sections/blog/SearchBar.vue";
import FilterBar from "../components/sections/blog/FilterBar.vue";
import SearchFilterSkeleton from "../components/sections/blog/SearchFilterSkeleton.vue";
import BlogGridCard from "../components/sections/blog/BlogGridCard.vue";
import BlogGridCardSkeleton from "../components/sections/blog/BlogGridCardSkeleton.vue";
import EmptyState from "../components/sections/blog/EmptyState.vue";
import LoadMore from "../components/sections/blog/LoadMore.vue";

const PAGE_STEP = 9;

const {
  posts,
  loading,
  error,
  search,
  category,
  difficulty,
  readingTimeBucket,
  sortBy,
  categories,
  difficulties,
  isFiltering,
} = usePostListing(getBlogs);

// The sidebar's "category" rail; 'all' and 'featured' are structural, every
// other value is a real, dynamically-discovered post category.
const activeSidebar = ref("all");
const sidebarCategories = computed(() =>
  categories.value.filter((c) => c !== "all"),
);

const visibleCount = ref(PAGE_STEP);
const loadingMore = ref(false);

watch(activeSidebar, (val) => {
  category.value = val === "featured" ? "all" : val;
});

watch(
  [search, category, difficulty, readingTimeBucket, sortBy, activeSidebar],
  () => {
    visibleCount.value = PAGE_STEP;
  },
);

function matchesReadingTimeBucket(minutes, bucket) {
  if (bucket === "all") return true;
  const t = minutes || 0;
  if (bucket === "under5") return t < 5;
  if (bucket === "5to10") return t >= 5 && t <= 10;
  if (bucket === "over10") return t > 10;
  return true;
}

// There is no separate featured-hero section on this page anymore, so —
// unlike `usePostListing`'s `latest` — this deliberately does NOT exclude
// whichever post its own hero-fallback logic would've promoted to
// "featured": every matching post belongs in the grid.
const gridPosts = computed(() => {
  const q = search.value.trim().toLowerCase();
  const base = posts.value.filter((p) => {
    if (
      q &&
      !p.title?.toLowerCase().includes(q) &&
      !p.description?.toLowerCase().includes(q)
    )
      return false;
    if (category.value !== "all" && p.category !== category.value) return false;
    if (difficulty.value !== "all" && p.difficulty !== difficulty.value)
      return false;
    if (!matchesReadingTimeBucket(p.readingTime, readingTimeBucket.value))
      return false;
    return true;
  });

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
  } else sorted.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  return sorted;
});

const displayPosts = computed(() => {
  if (activeSidebar.value === "featured")
    return posts.value.filter((p) => p.featured);
  return gridPosts.value;
});

const visiblePosts = computed(() =>
  displayPosts.value.slice(0, visibleCount.value),
);
const hasMore = computed(() => visibleCount.value < displayPosts.value.length);

function loadMore() {
  loadingMore.value = true;
  // The next batch is already in memory — a short delay keeps the button's
  // loading state legible instead of the grid just snapping to a new size.
  setTimeout(() => {
    visibleCount.value += PAGE_STEP;
    loadingMore.value = false;
  }, 250);
}

function clearFilters() {
  search.value = "";
  difficulty.value = "all";
  readingTimeBucket.value = "all";
  activeSidebar.value = "all";
}

const headerEl = ref(null);
const gridEl = ref(null);

onMounted(() => {
  gsap.fromTo(
    headerEl.value,
    { opacity: 0, y: 16 },
    { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
  );
});

// Cards fade+stagger in whenever the visible set changes — new search
// results, a filter switch, or a "Load more" batch — rather than only once
// on scroll, since the grid updates from clicks/typing, not scrolling.
watch(
  visiblePosts,
  async () => {
    await nextTick();
    const cards = gridEl.value?.querySelectorAll("[data-blog-card]");
    if (!cards?.length) return;
    gsap.fromTo(
      cards,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", stagger: 0.08 },
    );
  },
  { immediate: true },
);

useSeoMeta(() => ({
  title: "Blog",
  description: "Learn blockchain, wallets and crypto through simple articles.",
  path: "/blog",
  jsonLd: {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "cryptolearner.us Blog",
    url: `${SITE_URL}/blog`,
  },
}));
</script>

<template>
  <div class="bg-[#F7F9FC] pt-28 pb-10 sm:pt-32 sm:pb-14">
    <div class="mx-auto max-w-[1500px] px-6 lg:px-10">
      <div
        ref="headerEl"
        class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
      >
        <div>
          <h1
            class="font-display text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
          >
            Blog
          </h1>
          <p class="mt-2 max-w-lg text-sm leading-relaxed text-gray-500">
            Learn blockchain, wallets and crypto through simple articles.
          </p>
        </div>

        <div class="relative">
          <Transition name="crossfade">
            <SearchFilterSkeleton v-if="loading" key="search-filter-skeleton" />
            <div
              v-else
              key="search-filter-real"
              class="flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <div class="sm:w-72">
                <SearchBar v-model="search" />
              </div>
              <FilterBar
                v-model:difficulty="difficulty"
                v-model:reading-time-bucket="readingTimeBucket"
                v-model:sort-by="sortBy"
                :difficulties="difficulties"
              />
            </div>
          </Transition>
        </div>
      </div>

      <p
        v-if="error"
        class="mt-8 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
        role="alert"
      >
        {{ error }}
      </p>

      <div class="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
        <div class="relative">
          <Transition name="crossfade">
            <BlogSidebarSkeleton v-if="loading" key="sidebar-skeleton" />
            <BlogSidebar
              v-else
              key="sidebar-real"
              v-model="activeSidebar"
              :categories="sidebarCategories"
              :posts="posts"
            />
          </Transition>
        </div>

        <div class="relative min-w-0">
          <Transition name="crossfade">
            <div
              v-if="loading"
              key="loading"
              class="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3"
            >
              <BlogGridCardSkeleton v-for="i in PAGE_STEP" :key="i" />
            </div>

            <EmptyState
              v-else-if="!visiblePosts.length"
              key="empty"
              :title="
                isFiltering || activeSidebar !== 'all'
                  ? 'No articles found'
                  : 'No articles yet'
              "
              :message="
                isFiltering || activeSidebar !== 'all'
                  ? 'Try a different search term or clear your filters.'
                  : 'New lessons and updates will show up here as soon as they’re published.'
              "
              @clear="clearFilters"
            >
              <template v-if="isFiltering || activeSidebar !== 'all'" #action
                >Clear filters</template
              >
            </EmptyState>

            <div v-else key="content">
              <div
                ref="gridEl"
                class="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3"
              >
                <BlogGridCard
                  v-for="post in visiblePosts"
                  :key="post.id"
                  :post="post"
                  base-path="/blog"
                  data-blog-card
                />
              </div>

              <div v-if="hasMore" class="mt-12 flex justify-center">
                <LoadMore :loading="loadingMore" @click="loadMore" />
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </div>
</template>
