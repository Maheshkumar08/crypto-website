<script setup>
import { computed } from "vue";
import { optimizedUrl } from "../../../services/cloudinary";
import { prefetchRoute } from "../../../composables/usePrefetch";
import AuthorAvatar from "./AuthorAvatar.vue";

const props = defineProps({
  post: { type: Object, required: true },
  basePath: { type: String, default: "/blog" },
});

// Same deterministic hash-to-swatch as CategoryChip, kept local since this
// card shows the category as a colored dot + label rather than a chip.
const PALETTE = [
  { bg: "#EAF2FF", fg: "#1D4ED8" },
  { bg: "#EAFBF3", fg: "#047857" },
  { bg: "#FFF3E0", fg: "#B45309" },
  { bg: "#F4EEFF", fg: "#6D28D9" },
  { bg: "#FDEAEF", fg: "#BE185D" },
  { bg: "#E8FBFC", fg: "#0E7490" },
];

const categorySwatch = computed(() => {
  const label = props.post.category || "";
  let hash = 0;
  for (let i = 0; i < label.length; i++)
    hash = (hash * 31 + label.charCodeAt(i)) % PALETTE.length;
  return PALETTE[Math.abs(hash)];
});
</script>

<template>
  <router-link
    :to="`${basePath}/${post.slug}`"
    data-cursor-hover
    class="group flex h-full flex-col overflow-hidden rounded-[24px] border border-[#E8EEF5] bg-white shadow-[0_10px_40px_rgba(15,23,42,0.05)] transition-all duration-[350ms] ease-out hover:-translate-y-2 hover:shadow-[0_24px_60px_-12px_rgba(15,23,42,0.14)]"
    @mouseenter="prefetchRoute('blog-details')"
  >
    <div class="aspect-video overflow-hidden rounded-t-[24px] bg-slate-100">
      <img
        v-if="post.coverImage"
        :src="optimizedUrl(post.coverImage, { width: 640 })"
        :alt="post.title"
        loading="lazy"
        class="h-full w-full object-cover transition-transform duration-[350ms] ease-out group-hover:scale-105"
      />
      <div
        v-else
        class="flex h-full w-full items-center justify-center text-sm text-gray-300"
      >
        No cover image
      </div>
    </div>

    <div class="flex flex-1 flex-col p-6">
      <h3
        class="text-lg font-semibold leading-snug text-gray-900 transition-colors duration-[350ms] group-hover:text-blue-600"
      >
        {{ post.title }}
      </h3>
      <p class="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-500">
        {{ post.description }}
      </p>

      <span
        v-if="post.category"
        class="mt-4 inline-flex w-fit items-center gap-1.5 text-xs font-semibold"
        :style="{ color: categorySwatch.fg }"
      >
        <span
          class="h-2 w-2 shrink-0 rounded-full"
          :style="{ backgroundColor: categorySwatch.fg }"
        />
        {{ post.category }}
      </span>

      <div class="mt-auto flex items-center gap-2 pt-5 text-sm text-gray-500">
        <AuthorAvatar
          :name="post.author || 'cryptolearner.us Team'"
          size="sm"
        />
        <span class="font-medium text-gray-700">{{
          post.author || "cryptolearner.us Team"
        }}</span>
        <span>•</span>
        <span>{{ post.readingTime }} min read</span>
      </div>
    </div>
  </router-link>
</template>
