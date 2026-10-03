<script setup>
import { optimizedUrl } from '../../services/cloudinary'

defineProps({
  posts: { type: Array, required: true },
  basePath: { type: String, required: true },
})
</script>

<template>
  <div v-if="posts.length" class="hover-glow rounded-2xl border border-slate-200/80 bg-white p-6 shadow-soft">
    <div class="flex items-center justify-between">
      <h3 class="text-sm font-semibold text-gray-900">Most popular</h3>
      <span class="text-[10px] font-semibold uppercase tracking-wide text-gray-400">By reads</span>
    </div>
    <div class="mt-5 space-y-4">
      <router-link
        v-for="(post, i) in posts"
        :key="post.id"
        :to="`${basePath}/${post.slug}`"
        data-cursor-hover
        class="group flex items-center gap-3"
      >
        <span class="rank-numeral w-6 shrink-0 text-2xl">{{ i + 1 }}</span>
        <div class="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-slate-100">
          <img
            v-if="post.coverImage"
            :src="optimizedUrl(post.coverImage, { width: 96 })"
            :alt="post.title"
            loading="lazy"
            class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
        <p class="line-clamp-2 text-sm font-medium leading-snug text-gray-700 transition-colors group-hover:text-blue-600">
          {{ post.title }}
        </p>
      </router-link>
    </div>
  </div>
</template>
