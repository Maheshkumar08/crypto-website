<script setup>
import { optimizedUrl } from "../../services/cloudinary";

defineProps({
  prevPost: { type: Object, default: null },
  nextPost: { type: Object, default: null },
  basePath: { type: String, default: "/blog" },
});
</script>

<template>
  <nav
    v-if="prevPost || nextPost"
    class="grid grid-cols-1 gap-4 sm:grid-cols-2"
  >
    <router-link
      v-if="prevPost"
      :to="`${basePath}/${prevPost.slug}`"
      data-cursor-hover
      class="group flex items-center gap-4 overflow-hidden rounded-2xl border border-slate-200 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-soft"
    >
      <div class="min-w-0">
        <p class="flex items-center gap-1 text-xs font-medium text-gray-400">
          <svg
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            class="h-3 w-3"
          >
            <path d="M12 4 6 10l6 6" />
          </svg>
          Previous article
        </p>
        <p
          class="mt-1 truncate text-sm font-semibold text-gray-900 group-hover:text-blue-600"
        >
          {{ prevPost.title }}
        </p>
      </div>
    </router-link>
    <div v-else class="hidden sm:block" />

    <router-link
      v-if="nextPost"
      :to="`${basePath}/${nextPost.slug}`"
      data-cursor-hover
      class="group flex items-center justify-end gap-4 overflow-hidden rounded-2xl border border-slate-200 p-5 text-right transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-soft"
    >
      <div class="min-w-0">
        <p
          class="flex items-center justify-end gap-1 text-xs font-medium text-gray-400"
        >
          Next article
          <svg
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            class="h-3 w-3"
          >
            <path d="m8 4 6 6-6 6" />
          </svg>
        </p>
        <p
          class="mt-1 truncate text-sm font-semibold text-gray-900 group-hover:text-blue-600"
        >
          {{ nextPost.title }}
        </p>
      </div>
    </router-link>
  </nav>
</template>
