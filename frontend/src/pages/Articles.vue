<script setup>
import { computed, nextTick, onMounted, ref, watch } from "vue";
import { getArticles } from "../services/articles";
import { usePostListing } from "../composables/usePostListing";
import { useSeoMeta, SITE_URL } from "../composables/useSeoMeta";
import { gsap } from "../composables/gsapSetup";
import Sidebar from "../components/sections/blog/Sidebar.vue";
import SearchBar from "../components/sections/blog/SearchBar.vue";
import LoadMore from "../components/sections/blog/LoadMore.vue";
import EmptyState from "../components/sections/blog/EmptyState.vue";
import TrendingTicker from "../components/feed/TrendingTicker.vue";
import FeedFilters from "../components/feed/FeedFilters.vue";
import FeedCard from "../components/feed/FeedCard.vue";
import FeedCardSkeleton from "../components/feed/FeedCardSkeleton.vue";

const PAGE_STEP = 6;

const {
  posts,
  loading,
  error,
  search,
  category,
  sortBy,
  categories,
  isFiltering,
  trending,
} = usePostListing(getArticles);

// The sidebar's "category" rail; 'all' and 'featured' are structural, every
// other value is a real, dynamically-discovered category from the articles
// an admin has actually published — nothing here is hardcoded.
const activeSidebar = ref("all");
const sidebarCategories = computed(() =>
  categories.value.filter((c) => c !== "all"),
);

const visibleCount = ref(PAGE_STEP);
const loadingMore = ref(false);

watch(activeSidebar, (val) => {
  category.value = val === "featured" ? "all" : val;
});

watch([search, category, sortBy, activeSidebar], () => {
  visibleCount.value = PAGE_STEP;
});

// A flat feed shows every article, unlike Blog's hero+grid split — so this
// intentionally does NOT reuse `usePostListing`'s `latest`, which silently
// excludes whichever post its own hero-fallback logic promotes to
// "featured" when nothing was explicitly flagged.
const feedPosts = computed(() => {
  const q = search.value.trim().toLowerCase();
  const base = posts.value.filter((p) => {
    // Guide se linked articles Articles page par mat dikhao
    if (p.guideCardId) return false;

    if (
      q &&
      !p.title?.toLowerCase().includes(q) &&
      !p.description?.toLowerCase().includes(q)
    )
      return false;

    if (category.value !== "all" && p.category !== category.value) return false;

    return true;
  });

  const sorted = [...base];
  if (sortBy.value === "popular") {
    sorted.sort((a, b) => (b.views || 0) - (a.views || 0));
  } else if (sortBy.value === "trending") {
    const score = (p) => {
      const ageDays = p.createdAt
        ? Math.max(1, (Date.now() - p.createdAt.getTime()) / 86400000)
        : 1;
      return (p.views || 0) / ageDays;
    };
    sorted.sort((a, b) => score(b) - score(a));
  } else {
    sorted.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  }
  return sorted;
});

const displayPosts = computed(() => {
  if (activeSidebar.value === "featured") {
    return posts.value.filter((p) => p.featured && !p.guideCardId);
  }

  return feedPosts.value;
});

const visiblePosts = computed(() =>
  displayPosts.value.slice(0, visibleCount.value),
);
const hasMore = computed(() => visibleCount.value < displayPosts.value.length);

// The ticker surfaces whatever is actually trending right now — top by view
// count, computed from real MongoDB data, never a fixed list.
const tickerItems = computed(() =>
  trending.value.slice(0, 8).map((p) => ({
    id: p.id,
    slug: p.slug,
    label: p.title,
    meta: `${(p.views || 0).toLocaleString()} views`,
  })),
);

function loadMore() {
  loadingMore.value = true;
  setTimeout(() => {
    visibleCount.value += PAGE_STEP;
    loadingMore.value = false;
  }, 250);
}

function clearFilters() {
  search.value = "";
  sortBy.value = "newest";
  activeSidebar.value = "all";
}

const headerEl = ref(null);
const feedEl = ref(null);

onMounted(() => {
  gsap.fromTo(
    headerEl.value,
    { opacity: 0, y: 16 },
    { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
  );
});

// Cards fade+stagger in one by one whenever the visible set changes — a
// search, a filter switch, a "Load more" batch — not just once on scroll.
watch(
  visiblePosts,
  async () => {
    await nextTick();
    const cards = feedEl.value?.querySelectorAll("[data-feed-card]");
    if (!cards?.length) return;
    gsap.fromTo(
      cards,
      { opacity: 0, y: 28 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", stagger: 0.1 },
    );
  },
  { immediate: true },
);

useSeoMeta(() => ({
  title: "Articles",
  description:
    "In-depth, plain-language articles on blockchain, wallets, and digital assets from the cryptolearner.us team.",
  path: "/articles",
  jsonLd: {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "cryptolearner.us Articles",
    url: `${SITE_URL}/articles`,
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
          <div class="flex items-center gap-3">
            <h1
              class="font-display text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
            >
              Articles
            </h1>
            <span
              class="rounded-full bg-white px-3 py-1 text-xs font-semibold text-gray-500 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
            >
              {{ loading ? "…" : displayPosts.length }} Reports
            </span>
          </div>
          <p class="mt-2 max-w-lg text-sm leading-relaxed text-gray-500">
            In-depth, plain-language research on blockchain, wallets, and
            digital assets.
          </p>
        </div>

        <div class="sm:w-80">
          <SearchBar v-model="search" placeholder="Search articles…" />
        </div>
      </div>

      <p
        v-if="error"
        class="mt-8 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
        role="alert"
      >
        {{ error }}
      </p>

      <div class="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
        <Sidebar
          v-model="activeSidebar"
          :categories="sidebarCategories"
          :posts="displayPosts"
        />

        <div class="min-w-0">
          <FeedFilters v-model="sortBy" />

          <div v-if="loading" class="mt-6 space-y-8">
            <FeedCardSkeleton v-for="i in 3" :key="i" />
          </div>

          <EmptyState
            v-else-if="!visiblePosts.length"
            :title="
              isFiltering || activeSidebar !== 'all'
                ? 'No articles found'
                : 'No articles yet'
            "
            :message="
              isFiltering || activeSidebar !== 'all'
                ? 'Try a different search term or clear your filters.'
                : 'New reports will show up here as soon as they’re published.'
            "
            @clear="clearFilters"
          >
            <template v-if="isFiltering || activeSidebar !== 'all'" #action
              >Clear filters</template
            >
          </EmptyState>

          <template v-else>
            <div ref="feedEl" class="mt-6 space-y-8">
              <FeedCard
                v-for="post in visiblePosts"
                :key="post.id"
                :post="post"
                data-feed-card
              />
            </div>

            <div v-if="hasMore" class="mt-10 flex justify-center">
              <LoadMore :loading="loadingMore" @click="loadMore" />
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
