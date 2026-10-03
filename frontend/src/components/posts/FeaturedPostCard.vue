<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { formatDate } from '../../composables/text'
import { optimizedUrl } from '../../services/cloudinary'
import { attachTilt } from '../../composables/useTilt'
import { attachMagnetic } from '../../composables/useMagnetic'
import { prefetchRoute } from '../../composables/usePrefetch'

const props = defineProps({
  post: { type: Object, required: true },
  basePath: { type: String, required: true },
})

const rootEl = ref(null)
const ctaEl = ref(null)
let cleanupTilt = () => {}
let cleanupMagnetic = () => {}

onMounted(() => {
  // router-link is a component, so the template ref resolves to its
  // instance — the actual <a> element lives at `.$el`.
  cleanupTilt = attachTilt(rootEl.value?.$el ?? rootEl.value, { max: 3 })
  cleanupMagnetic = attachMagnetic(ctaEl.value, { strength: 0.4, innerStrength: 0.6 })
})
onBeforeUnmount(() => {
  cleanupTilt()
  cleanupMagnetic()
})
</script>

<template>
  <router-link
    ref="rootEl"
    :to="`${basePath}/${post.slug}`"
    data-cursor-hover
    class="hover-glow group grid grid-cols-1 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-lift lg:grid-cols-2"
    @mouseenter="prefetchRoute(basePath === '/blog' ? 'blog-details' : 'article-details')"
  >
    <div class="relative aspect-[16/10] overflow-hidden bg-slate-100 lg:aspect-auto">
      <img
        v-if="post.coverImage"
        :src="optimizedUrl(post.coverImage, { width: 900 })"
        :alt="post.title"
        fetchpriority="high"
        class="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />
      <div v-else class="flex h-full w-full items-center justify-center text-sm text-gray-300">No cover image</div>
      <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent lg:bg-gradient-to-r" />
    </div>

    <div class="relative flex flex-col justify-center p-8 lg:p-12">
      <span class="inline-flex w-fit items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
        Featured
      </span>
      <span v-if="post.category" class="mt-4 text-xs font-semibold uppercase tracking-wide text-blue-600">{{ post.category }}</span>
      <h2 class="mt-2 font-display text-2xl font-bold leading-tight tracking-tight text-gray-900 transition-colors group-hover:text-blue-600 sm:text-3xl">
        {{ post.title }}
      </h2>
      <p class="mt-3 line-clamp-3 text-base leading-relaxed text-gray-500">{{ post.description }}</p>

      <div class="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-400">
        <span>{{ post.author }}</span>
        <span>·</span>
        <span>{{ formatDate(post.createdAt) }}</span>
        <span>·</span>
        <span>{{ post.readingTime }} min read</span>
        <template v-if="post.views">
          <span>·</span>
          <span>{{ post.views.toLocaleString() }} views</span>
        </template>
      </div>

      <span ref="ctaEl" class="relative mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-blue-600/20 transition-colors group-hover:bg-blue-700">
        <span data-magnetic-inner class="flex items-center gap-2">
          Read the full story
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" class="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1">
            <path d="M4 10h12M11 5l5 5-5 5" />
          </svg>
        </span>
      </span>
    </div>
  </router-link>
</template>
