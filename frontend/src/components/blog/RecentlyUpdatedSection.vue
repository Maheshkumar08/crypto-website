<script setup>
import { onMounted, ref } from 'vue'
import { optimizedUrl } from '../../services/cloudinary'
import { prefetchRoute } from '../../composables/usePrefetch'
import { revealHeading, revealUp } from '../../composables/useReveal'
import Badge from '../ui/Badge.vue'

defineProps({
  posts: { type: Array, required: true },
  basePath: { type: String, required: true },
})

const sectionEl = ref(null)
const headingEl = ref(null)
const listEl = ref(null)

onMounted(() => {
  revealHeading(headingEl.value, { type: 'words', trigger: sectionEl.value, stagger: 0.03 })
  if (listEl.value) revealUp(listEl.value.children, { trigger: listEl.value, y: 24, stagger: 0.08 })
})

// Short "updated X ago" phrasing reads more like a living, maintained
// resource than a bare absolute date would.
function timeAgo(date) {
  if (!date) return ''
  const d = date instanceof Date ? date : new Date(date)
  const seconds = Math.max(0, (Date.now() - d.getTime()) / 1000)
  const units = [
    ['year', 31536000],
    ['month', 2592000],
    ['week', 604800],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
  ]
  for (const [label, secs] of units) {
    const value = Math.floor(seconds / secs)
    if (value >= 1) return `${value} ${label}${value > 1 ? 's' : ''} ago`
  }
  return 'just now'
}
</script>

<template>
  <section v-if="posts.length" ref="sectionEl" class="mx-auto max-w-7xl px-6 lg:px-10">
    <div class="flex items-center gap-2">
      <span class="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-50 text-cyan-600">
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" class="h-4 w-4">
          <path d="M10 5.5V10l3 2" />
          <circle cx="10" cy="10" r="7.5" />
        </svg>
      </span>
      <h2 ref="headingEl" class="font-display text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Recently updated</h2>
    </div>

    <div ref="listEl" class="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <router-link
        v-for="post in posts"
        :key="post.id"
        :to="`${basePath}/${post.slug}`"
        data-cursor-hover
        class="group flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-soft transition-shadow duration-300 hover:shadow-card"
        @mouseenter="prefetchRoute(basePath === '/blog' ? 'blog-details' : 'article-details')"
      >
        <div class="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-100">
          <img
            v-if="post.coverImage"
            :src="optimizedUrl(post.coverImage, { width: 128 })"
            :alt="post.title"
            loading="lazy"
            class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
        <div class="min-w-0 flex-1">
          <p class="truncate text-sm font-semibold leading-snug text-gray-900 transition-colors group-hover:text-blue-600">
            {{ post.title }}
          </p>
          <div class="mt-1.5 flex items-center gap-1.5 text-xs text-cyan-700">
            <span class="h-1.5 w-1.5 rounded-full bg-cyan-500" />
            Updated {{ timeAgo(post.updatedAt || post.createdAt) }}
          </div>
        </div>
        <Badge v-if="post.category" color="slate" variant="soft" class="hidden shrink-0 sm:inline-flex">{{ post.category }}</Badge>
      </router-link>
    </div>
  </section>
</template>
