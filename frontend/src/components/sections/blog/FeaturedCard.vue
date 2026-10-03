<script setup>
import { formatDate } from "../../../composables/text";
import { optimizedUrl } from "../../../services/cloudinary";
import { prefetchRoute } from "../../../composables/usePrefetch";
import CategoryChip from "./CategoryChip.vue";
import AuthorAvatar from "./AuthorAvatar.vue";

defineProps({
  post: { type: Object, required: true },
  basePath: { type: String, default: "/blog" },
});
</script>

<template>
  <router-link
    :to="`${basePath}/${post.slug}`"
    data-cursor-hover
    class="group grid grid-cols-1 overflow-hidden rounded-[28px] border border-[#E8EEF5] bg-white transition-shadow duration-300 hover:shadow-[0_24px_60px_-24px_rgba(15,23,42,0.18)] md:grid-cols-2"
    @mouseenter="prefetchRoute('blog-details')"
  >
    <div
      class="relative aspect-[16/11] overflow-hidden bg-slate-100 md:aspect-auto"
    >
      <img
        v-if="post.coverImage"
        :src="optimizedUrl(post.coverImage, { width: 960 })"
        :alt="post.title"
        loading="lazy"
        class="h-full w-full object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.04]"
      />
      <div
        v-else
        class="flex h-full w-full items-center justify-center text-sm text-gray-300"
      >
        No cover image
      </div>

      <span
        v-if="post.featured"
        class="absolute left-5 top-5 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-gray-900 shadow-sm backdrop-blur"
      >
        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          class="h-3 w-3 text-amber-500"
        >
          <path
            d="M10 1.5 12.4 7l6 .9-4.3 4.2 1 6-5.1-2.7-5.1 2.7 1-6-4.3-4.2 6-.9L10 1.5Z"
          />
        </svg>
        Featured
      </span>
    </div>

    <div class="flex flex-col justify-center p-8 lg:p-10">
      <div class="flex flex-wrap items-center gap-2">
        <CategoryChip v-if="post.category" :label="post.category" />
        <span
          v-if="post.difficulty"
          class="rounded-full bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-gray-500"
          >{{ post.difficulty }}</span
        >
        <span class="text-xs text-gray-400"
          >{{ post.readingTime }} min read</span
        >
      </div>

      <h2
        class="mt-5 font-display text-2xl font-bold leading-tight tracking-tight text-gray-900 transition-colors group-hover:text-blue-700 lg:text-3xl"
      >
        {{ post.title }}
      </h2>

      <p class="mt-4 line-clamp-3 text-[15px] leading-relaxed text-gray-500">
        {{ post.description }}
      </p>

      <div class="mt-7 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <AuthorAvatar :name="post.author || 'cryptolearner.us Team'" />
          <div class="leading-tight">
            <p class="text-sm font-medium text-gray-900">
              {{ post.author || "cryptolearner.us Team" }}
            </p>
            <p class="text-xs text-gray-400">
              {{ formatDate(post.createdAt) }}
            </p>
          </div>
        </div>

        <span
          class="flex items-center gap-1.5 text-sm font-semibold text-blue-600"
        >
          Read article
          <svg
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            class="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
          >
            <path d="M4 10h12M11 5l5 5-5 5" />
          </svg>
        </span>
      </div>
    </div>
  </router-link>
</template>
