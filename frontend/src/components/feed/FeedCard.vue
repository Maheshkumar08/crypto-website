<script setup>
import { computed, onBeforeUnmount, ref } from "vue";
import { formatRelativeTime } from "../../composables/text";
import { optimizedUrl } from "../../services/cloudinary";
import { prefetchRoute } from "../../composables/usePrefetch";
import { useBookmarks } from "../../composables/useBookmarks";
import { useLikes } from "../../composables/useLikes";
import {
  incrementArticleLikes,
  decrementArticleLikes,
} from "../../services/articles";
import CategoryChip from "../sections/blog/CategoryChip.vue";
import AuthorAvatar from "../sections/blog/AuthorAvatar.vue";

const props = defineProps({
  post: { type: Object, required: true },
});

const { isBookmarked, toggle: toggleBookmark } = useBookmarks();
const { isLiked, toggle: toggleLike } = useLikes();

const shareOpen = ref(false);

const shareUrl = computed(
  () => `${window.location.origin}/articles/${props.post.slug}`,
);
const shareLinks = computed(() => {
  const u = encodeURIComponent(shareUrl.value);
  const t = encodeURIComponent(props.post.title);
  return [
    { id: "x", href: `https://twitter.com/intent/tweet?url=${u}&text=${t}` },
    {
      id: "linkedin",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`,
    },
    {
      id: "facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${u}`,
    },
  ];
});

function onLikeClick(e) {
  e.preventDefault();
  e.stopPropagation();
  const nowLiked = toggleLike(props.post.id);
  props.post.likes = Math.max(0, (props.post.likes || 0) + (nowLiked ? 1 : -1));
  if (nowLiked) incrementArticleLikes(props.post.id);
  else decrementArticleLikes(props.post.id);
}

function onBookmarkClick(e) {
  e.preventDefault();
  e.stopPropagation();
  toggleBookmark(props.post.id);
}

function onShareToggle(e) {
  e.preventDefault();
  e.stopPropagation();
  shareOpen.value = !shareOpen.value;
  if (shareOpen.value) window.addEventListener("click", closeShare);
}

function closeShare() {
  shareOpen.value = false;
  window.removeEventListener("click", closeShare);
}

async function copyLink(e) {
  e.preventDefault();
  e.stopPropagation();
  try {
    await navigator.clipboard.writeText(shareUrl.value);
  } catch {
    /* clipboard unavailable — ignore silently */
  }
  closeShare();
}

onBeforeUnmount(() => window.removeEventListener("click", closeShare));
</script>

<template>
  <article
    class="group overflow-hidden rounded-[32px] border border-[#E8EEF5] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_64px_-24px_rgba(15,23,42,0.18)]"
  >
    <router-link
      :to="`/articles/${post.slug}`"
      target="_blank"
      rel="noopener noreferrer"
      class="block"
      data-cursor-hover
      @mouseenter="prefetchRoute('article-details')"
    >
      <div class="flex items-center gap-3 px-7 pt-7 sm:px-9 sm:pt-9">
        <AuthorAvatar
          :name="post.author || 'cryptolearner.us Team'"
          size="sm"
        />
        <div class="min-w-0 flex-1">
          <p class="truncate text-sm font-semibold text-gray-800">
            {{ post.author || "cryptolearner.us Team" }}
          </p>
          <p class="text-xs text-gray-400">
            {{ formatRelativeTime(post.createdAt) }}
          </p>
        </div>
        <CategoryChip v-if="post.category" :label="post.category" size="sm" />
      </div>

      <h2
        class="mt-5 px-7 font-display text-2xl font-bold leading-snug tracking-tight text-gray-900 transition-colors group-hover:text-blue-700 sm:px-9 sm:text-[1.75rem]"
      >
        {{ post.title }}
      </h2>
      <p
        v-if="post.description"
        class="mt-2.5 line-clamp-2 px-7 text-[15px] leading-relaxed text-gray-500 sm:px-9"
      >
        {{ post.description }}
      </p>

      <div
        v-if="post.coverImage"
        class="mx-7 mt-6 overflow-hidden rounded-[24px] bg-slate-100 sm:mx-9"
      >
        <img
          :src="optimizedUrl(post.coverImage, { width: 960 })"
          :alt="post.title"
          loading="lazy"
          class="aspect-[16/9] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
      </div>
    </router-link>

    <div class="flex items-center justify-between px-7 py-6 sm:px-9">
      <div class="flex items-center gap-2 text-xs font-medium text-gray-400">
        <svg
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          stroke-width="1.6"
          class="h-4 w-4"
        >
          <circle cx="10" cy="10" r="7" />
          <path d="M10 6v4l3 2" />
        </svg>
        {{ post.readingTime }} min read
      </div>

      <div class="flex items-center gap-1.5">
        <button
          type="button"
          data-cursor-hover
          :aria-pressed="isBookmarked(post.id)"
          :aria-label="
            isBookmarked(post.id) ? 'Remove bookmark' : 'Bookmark this article'
          "
          class="flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300 hover:bg-slate-50"
          :class="isBookmarked(post.id) ? 'text-blue-600' : 'text-gray-500'"
          @click="onBookmarkClick"
        >
          <svg
            viewBox="0 0 20 20"
            :fill="isBookmarked(post.id) ? 'currentColor' : 'none'"
            stroke="currentColor"
            stroke-width="1.6"
            class="h-4 w-4"
          >
            <path
              d="M5.5 3.5h9a1 1 0 0 1 1 1v12l-5.5-3.2L4.5 16.5v-12a1 1 0 0 1 1-1Z"
              stroke-linejoin="round"
            />
          </svg>
        </button>

        <div class="relative">
          <button
            type="button"
            data-cursor-hover
            aria-label="Share this article"
            class="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition-all duration-300 hover:bg-slate-50"
            @click="onShareToggle"
          >
            <svg
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              stroke-width="1.6"
              class="h-4 w-4"
            >
              <circle cx="15" cy="5" r="2.2" />
              <circle cx="5" cy="10" r="2.2" />
              <circle cx="15" cy="15" r="2.2" />
              <path d="m7 8.8 6-2.6M7 11.2l6 2.6" />
            </svg>
          </button>

          <Transition
            enter-active-class="transition duration-150 ease-out"
            enter-from-class="opacity-0 scale-95 translate-y-1"
            enter-to-class="opacity-100 scale-100 translate-y-0"
            leave-active-class="transition duration-100 ease-in"
            leave-from-class="opacity-100 scale-100 translate-y-0"
            leave-to-class="opacity-0 scale-95 translate-y-1"
          >
            <div
              v-if="shareOpen"
              class="absolute right-0 top-full z-20 mt-2 flex items-center gap-1 rounded-2xl border border-[#E8EEF5] bg-white p-1.5 shadow-lift"
              @click.stop
            >
              <a
                v-for="link in shareLinks"
                :key="link.id"
                :href="link.href"
                target="_blank"
                rel="noopener noreferrer"
                data-cursor-hover
                class="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-slate-50 hover:text-gray-900"
              >
                <svg
                  v-if="link.id === 'x'"
                  viewBox="0 0 24 24"
                  class="h-3.5 w-3.5"
                  fill="currentColor"
                >
                  <path
                    d="M18.3 2H21l-6.7 7.6L22.2 22h-6.9l-5.4-6.9L3.7 22H1l7.2-8.2L1.1 2h7l4.9 6.3L18.3 2Zm-1.2 18h1.9L7 4H5l12.1 16Z"
                  />
                </svg>
                <svg
                  v-else-if="link.id === 'linkedin'"
                  viewBox="0 0 24 24"
                  class="h-3.5 w-3.5"
                  fill="currentColor"
                >
                  <path
                    d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-1 1.83-2.1 3.76-2.1 4.02 0 4.76 2.6 4.76 6V21h-4v-5.5c0-1.3-.02-3-1.83-3-1.83 0-2.1 1.4-2.1 2.9V21h-4V9Z"
                  />
                </svg>
                <svg
                  v-else
                  viewBox="0 0 24 24"
                  class="h-3.5 w-3.5"
                  fill="currentColor"
                >
                  <path
                    d="M13.5 22v-8h2.7l.4-3.2h-3.1V8.7c0-.9.25-1.6 1.6-1.6h1.7V4.2C16.5 4.1 15.4 4 14.2 4c-2.6 0-4.4 1.6-4.4 4.5v2.3H7v3.2h2.8v8h3.7Z"
                  />
                </svg>
              </a>
              <button
                type="button"
                data-cursor-hover
                aria-label="Copy link"
                class="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-slate-50 hover:text-gray-900"
                @click="copyLink"
              >
                <svg
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.6"
                  class="h-3.5 w-3.5"
                >
                  <rect x="7" y="7" width="10" height="10" rx="2" />
                  <path d="M4 13V5a2 2 0 0 1 2-2h8" />
                </svg>
              </button>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </article>
</template>
