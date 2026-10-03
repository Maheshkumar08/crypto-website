<script setup>
import { formatDate } from "../../../composables/text";
import { optimizedUrl } from "../../../services/cloudinary";
import { prefetchRoute } from "../../../composables/usePrefetch";
import { useBookmarks } from "../../../composables/useBookmarks";
import CategoryChip from "./CategoryChip.vue";
import AuthorAvatar from "./AuthorAvatar.vue";

const props = defineProps({
  post: { type: Object, required: true },
  basePath: { type: String, default: "/blog" },
});

const { isBookmarked, toggle } = useBookmarks();
// Article cards (anything but blog posts) open in a new tab.
const isArticle = props.basePath !== "/blog";

function onBookmarkClick(e) {
  e.preventDefault();
  e.stopPropagation();
  toggle(props.post.id);
}
</script>

<template>
  <router-link
    :to="`${basePath}/${post.slug}`"
    :target="isArticle ? '_blank' : undefined"
    :rel="isArticle ? 'noopener noreferrer' : undefined"
    data-cursor-hover
    class="group flex h-full flex-col overflow-hidden rounded-[28px] border border-[#E8EEF5] bg-white transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-[0_20px_48px_-20px_rgba(15,23,42,0.16)]"
    @mouseenter="prefetchRoute('blog-details')"
  >
    <div class="flex flex-1 flex-col p-6">
      <div class="flex items-center gap-2 text-xs text-gray-400">
        <span
          v-if="post.difficulty"
          class="rounded-full bg-slate-50 px-2 py-0.5 font-semibold text-gray-500"
          >{{ post.difficulty }}</span
        >
        <span>{{ post.readingTime }} min read</span>
      </div>

      <h3
        class="mt-3 text-lg font-semibold leading-snug text-gray-900 transition-colors group-hover:text-blue-700"
      >
        {{ post.title }}
      </h3>

      <p class="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-gray-500">
        {{ post.description }}
      </p>

      <div
        class="mt-5 flex items-center justify-between border-t border-slate-100 pt-4"
      >
        <div class="flex items-center gap-2.5">
          <AuthorAvatar
            :name="post.author || 'cryptolearner.us Team'"
            size="sm"
          />
          <div class="leading-tight">
            <p class="text-xs font-medium text-gray-700">
              {{ post.author || "cryptolearner.us Team" }}
            </p>
            <p class="text-[11px] text-gray-400">
              {{ formatDate(post.createdAt) }}
            </p>
          </div>
        </div>

        <span
          class="flex items-center gap-1 text-xs font-semibold text-blue-600 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100"
        >
          Read
          <svg
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            class="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1"
          >
            <path d="M4 10h12M11 5l5 5-5 5" />
          </svg>
        </span>
      </div>
    </div>
  </router-link>
</template>
