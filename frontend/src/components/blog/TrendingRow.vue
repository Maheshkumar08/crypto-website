<script setup>
import { onMounted, ref } from 'vue'
import { formatDate } from '../../composables/text'
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
  if (listEl.value) revealUp(listEl.value.children, { trigger: listEl.value, y: 36, stagger: 0.1 })
})

function onMove(e) {
  const rect = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty('--glow-x', `${((e.clientX - rect.left) / rect.width) * 100}%`)
  e.currentTarget.style.setProperty('--glow-y', `${((e.clientY - rect.top) / rect.height) * 100}%`)
}
</script>

<template>
  <section v-if="posts.length" ref="sectionEl" class="mx-auto max-w-6xl px-6 lg:px-10">
    <div class="flex items-center gap-3">
      <span class="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600">
        <svg viewBox="0 0 20 20" fill="currentColor" class="h-4 w-4">
          <path d="M10 2s3 3.5 3 6.5a3 3 0 1 1-6 0C7 5.5 10 2 10 2Z" opacity=".5" />
          <path d="M10 18c-3 0-5.5-2.2-5.5-5.2 0-2 1.2-3.6 2.2-4.6-.2 1.4.4 2.6 1.3 3.2.1-1 .7-2.2 1.5-2.9.4 1.6 1.6 2.5 2.6 3.4 1 .9 1.9 1.9 1.9 3.4 0 1.5-1.5 2.7-4 2.7Z" />
        </svg>
      </span>
      <h2 ref="headingEl" class="font-display text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Trending posts</h2>
    </div>

    <div ref="listEl" class="mt-8 divide-y divide-slate-200">
      <router-link
        v-for="(post, i) in posts"
        :key="post.id"
        :to="`${basePath}/${post.slug}`"
        data-cursor-hover
        class="hover-glow group grid grid-cols-[auto,1fr] items-center gap-5 py-6 first:pt-0 last:pb-0 sm:grid-cols-[4.5rem,7rem,1fr,auto] sm:gap-8"
        @mouseenter="prefetchRoute(basePath === '/blog' ? 'blog-details' : 'article-details')"
        @mousemove="onMove"
      >
        <span class="rank-numeral hidden text-5xl sm:block">0{{ i + 1 }}</span>

        <div class="col-span-2 row-start-1 aspect-[16/11] w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:col-span-1 sm:row-start-auto sm:w-28">
          <img
            v-if="post.coverImage"
            :src="optimizedUrl(post.coverImage, { width: 260 })"
            :alt="post.title"
            loading="lazy"
            class="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
        </div>

        <div class="col-span-2 min-w-0 sm:col-span-1">
          <Badge v-if="post.category" color="blue" variant="soft" class="mb-2">{{ post.category }}</Badge>
          <p class="truncate text-lg font-semibold text-gray-900 transition-colors group-hover:text-blue-600 sm:text-xl">
            {{ post.title }}
          </p>
          <p class="mt-1 text-xs text-gray-400">{{ formatDate(post.createdAt) }} · {{ post.readingTime }} min read</p>
        </div>

        <div class="col-span-2 flex items-center gap-2 text-right text-sm font-medium text-gray-500 sm:col-span-1 sm:justify-end">
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" class="h-4 w-4 text-gray-300">
            <path d="M2 10s2.8-5.5 8-5.5S18 10 18 10s-2.8 5.5-8 5.5S2 10 2 10Z" />
            <circle cx="10" cy="10" r="2.2" />
          </svg>
          {{ (post.views || 0).toLocaleString() }}
        </div>
      </router-link>
    </div>
  </section>
</template>
