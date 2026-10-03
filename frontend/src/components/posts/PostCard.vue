<script setup>
import { formatDate } from '../../composables/text'
import { optimizedUrl } from '../../services/cloudinary'
import { prefetchRoute } from '../../composables/usePrefetch'
import Badge from '../ui/Badge.vue'

const props = defineProps({
  post: { type: Object, required: true },
  basePath: { type: String, required: true },
  variant: { type: String, default: 'grid' }, // 'grid' | 'landscape' | 'minimal'
})

// Glow-follow only (no 3D tilt) — a full attachTilt() feels right for a
// single hero card, but rotating every card in a dense grid reads as busy.
function onMove(e) {
  const rect = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty('--glow-x', `${((e.clientX - rect.left) / rect.width) * 100}%`)
  e.currentTarget.style.setProperty('--glow-y', `${((e.clientY - rect.top) / rect.height) * 100}%`)
}
</script>

<template>
  <router-link
    v-if="variant === 'landscape'"
    :to="`${basePath}/${post.slug}`"
    data-cursor-hover
    class="hover-glow group grid grid-cols-1 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-soft transition-shadow duration-300 hover:shadow-lift sm:grid-cols-2"
    @mouseenter="prefetchRoute(basePath === '/blog' ? 'blog-details' : 'article-details')"
    @mousemove="onMove"
  >
    <div class="relative aspect-[16/10] overflow-hidden bg-slate-100 sm:aspect-auto">
      <img
        v-if="post.coverImage"
        :src="optimizedUrl(post.coverImage, { width: 700 })"
        :alt="post.title"
        loading="lazy"
        class="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />
      <div v-else class="flex h-full w-full items-center justify-center text-sm text-gray-300">No cover image</div>
    </div>
    <div class="relative flex flex-col justify-center p-7 sm:p-8">
      <Badge v-if="post.category" color="blue" variant="soft" class="w-fit">{{ post.category }}</Badge>
      <h3 class="mt-3 font-display text-xl font-bold leading-snug text-gray-900 transition-colors group-hover:text-blue-600">
        {{ post.title }}
      </h3>
      <p class="mt-2.5 line-clamp-2 text-sm leading-relaxed text-gray-500">{{ post.description }}</p>
      <div class="mt-5 flex items-center gap-2 text-xs text-gray-400">
        <span>{{ formatDate(post.createdAt) }}</span>
        <span>·</span>
        <span>{{ post.readingTime }} min read</span>
      </div>
    </div>
  </router-link>

  <router-link
    v-else-if="variant === 'minimal'"
    :to="`${basePath}/${post.slug}`"
    data-cursor-hover
    class="group flex items-start gap-4 border-b border-slate-100 py-5 first:pt-0 last:border-0"
    @mouseenter="prefetchRoute(basePath === '/blog' ? 'blog-details' : 'article-details')"
  >
    <div class="w-14 shrink-0 pt-1 text-xs font-medium uppercase tracking-wide text-gray-400">
      {{ post.category }}
    </div>
    <div class="min-w-0 flex-1">
      <p
        class="text-base font-semibold leading-snug text-gray-900 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-blue-600"
      >
        {{ post.title }}
      </p>
      <p class="mt-1 text-xs text-gray-400">{{ formatDate(post.createdAt) }} · {{ post.readingTime }} min read</p>
    </div>
  </router-link>

  <router-link
    v-else
    :to="`${basePath}/${post.slug}`"
    data-cursor-hover
    class="hover-glow group flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift"
    @mouseenter="prefetchRoute(basePath === '/blog' ? 'blog-details' : 'article-details')"
    @mousemove="onMove"
  >
    <div class="relative aspect-[16/10] overflow-hidden bg-slate-100">
      <img
        v-if="post.coverImage"
        :src="optimizedUrl(post.coverImage, { width: 640 })"
        :alt="post.title"
        loading="lazy"
        class="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
      />
      <div v-else class="flex h-full w-full items-center justify-center text-sm text-gray-300">No cover image</div>
      <span v-if="post.category" class="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-blue-700 shadow-soft backdrop-blur">
        {{ post.category }}
      </span>
    </div>

    <div class="relative flex flex-1 flex-col p-6">
      <h3 class="text-lg font-semibold leading-snug text-gray-900 transition-colors group-hover:text-blue-600">
        {{ post.title }}
      </h3>
      <p class="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-gray-500">{{ post.description }}</p>

      <div class="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-gray-400">
        <div class="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span>{{ formatDate(post.createdAt) }}</span>
          <span>·</span>
          <span>{{ post.readingTime }} min read</span>
          <template v-if="post.views">
            <span>·</span>
            <span>{{ post.views.toLocaleString() }} views</span>
          </template>
        </div>
      </div>

      <div class="mt-4 flex items-center gap-1.5 text-sm font-medium text-blue-600 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100">
        Read article
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" class="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1">
          <path d="M4 10h12M11 5l5 5-5 5" />
        </svg>
      </div>
    </div>
  </router-link>
</template>
