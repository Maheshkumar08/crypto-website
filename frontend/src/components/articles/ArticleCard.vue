<script setup>
import { formatDate } from '../../composables/text'
import { optimizedUrl } from '../../services/cloudinary'
import { prefetchRoute } from '../../composables/usePrefetch'
import Badge from '../ui/Badge.vue'

defineProps({
  post: { type: Object, required: true },
  variant: { type: String, default: 'default' }, // 'default' | 'large' | 'minimal'
})
</script>

<template>
  <router-link
    v-if="variant === 'large'"
    :to="`/articles/${post.slug}`"
    data-cursor-hover
    class="group grid grid-cols-1 gap-6 border-b border-slate-200 py-10 first:pt-0 sm:grid-cols-[1fr,1fr] sm:items-center sm:gap-10"
    @mouseenter="prefetchRoute('article-details')"
  >
    <div class="order-2 aspect-[16/10] overflow-hidden rounded-2xl bg-slate-100 shadow-soft sm:order-1">
      <img
        v-if="post.coverImage"
        :src="optimizedUrl(post.coverImage, { width: 700 })"
        :alt="post.title"
        loading="lazy"
        class="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />
      <div v-else class="flex h-full w-full items-center justify-center text-sm text-gray-300">No cover image</div>
    </div>
    <div class="order-1 sm:order-2">
      <Badge v-if="post.category" color="cyan" variant="outline">{{ post.category }}</Badge>
      <h3 class="mt-3 font-display text-2xl font-bold leading-snug text-gray-900 transition-colors group-hover:text-blue-600 sm:text-3xl">
        {{ post.title }}
      </h3>
      <p class="mt-3 line-clamp-3 text-base leading-relaxed text-gray-500">{{ post.description }}</p>
      <div class="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-400">
        <span class="font-medium text-gray-600">{{ post.author }}</span>
        <span>·</span>
        <span>{{ formatDate(post.createdAt) }}</span>
        <span>·</span>
        <span>{{ post.readingTime }} min read</span>
      </div>
    </div>
  </router-link>

  <router-link
    v-else-if="variant === 'minimal'"
    :to="`/articles/${post.slug}`"
    data-cursor-hover
    class="group flex items-center justify-between gap-6 border-b border-slate-200 py-6 first:pt-0"
    @mouseenter="prefetchRoute('article-details')"
  >
    <div class="min-w-0">
      <span v-if="post.category" class="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">{{ post.category }}</span>
      <h3 class="mt-1.5 truncate font-display text-xl font-bold text-gray-900 transition-colors group-hover:text-blue-600">
        {{ post.title }}
      </h3>
      <p class="mt-1 text-xs text-gray-400">{{ formatDate(post.createdAt) }} · {{ post.readingTime }} min read</p>
    </div>
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" class="h-4 w-4 shrink-0 text-gray-300 transition-all duration-300 group-hover:translate-x-1 group-hover:text-blue-600">
      <path d="M4 10h12M11 5l5 5-5 5" />
    </svg>
  </router-link>

  <router-link
    v-else
    :to="`/articles/${post.slug}`"
    data-cursor-hover
    class="group grid grid-cols-1 gap-5 border-b border-slate-200 py-8 first:pt-0 sm:grid-cols-[220px,1fr] sm:gap-8"
    @mouseenter="prefetchRoute('article-details')"
  >
    <div class="aspect-[4/3] overflow-hidden rounded-xl bg-slate-100 sm:aspect-[16/11]">
      <img
        v-if="post.coverImage"
        :src="optimizedUrl(post.coverImage, { width: 440 })"
        :alt="post.title"
        loading="lazy"
        class="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />
      <div v-else class="flex h-full w-full items-center justify-center text-sm text-gray-300">No cover image</div>
    </div>

    <div class="flex flex-col justify-center">
      <span v-if="post.category" class="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">
        {{ post.category }}
      </span>
      <h3 class="mt-2.5 font-display text-xl font-bold leading-snug text-gray-900 transition-colors group-hover:text-blue-600 sm:text-2xl">
        {{ post.title }}
      </h3>
      <p class="mt-2.5 line-clamp-2 text-sm leading-relaxed text-gray-500">{{ post.description }}</p>

      <div class="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-400">
        <span class="font-medium text-gray-600">{{ post.author }}</span>
        <span>·</span>
        <span>{{ formatDate(post.createdAt) }}</span>
        <span>·</span>
        <span>{{ post.readingTime }} min read</span>
      </div>
    </div>
  </router-link>
</template>
