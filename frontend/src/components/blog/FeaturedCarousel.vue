<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { formatDate } from '../../composables/text'
import { optimizedUrl } from '../../services/cloudinary'
import { prefetchRoute } from '../../composables/usePrefetch'
import { attachMagnetic } from '../../composables/useMagnetic'
import { revealHeading, revealUp } from '../../composables/useReveal'

const props = defineProps({
  posts: { type: Array, required: true },
  basePath: { type: String, required: true },
})

const sectionEl = ref(null)
const headingEl = ref(null)
const railEl = ref(null)
const cardRefs = ref([])
const cleanups = []

onMounted(() => {
  revealHeading(headingEl.value, { type: 'words', trigger: sectionEl.value, stagger: 0.03 })
  if (railEl.value) revealUp(railEl.value, { trigger: railEl.value, y: 30, stagger: 0 })

  cardRefs.value.forEach((el) => {
    if (!el) return
    cleanups.push(attachMagnetic(el, { strength: 0.12, innerStrength: 0.18 }))
  })
})

onBeforeUnmount(() => cleanups.forEach((fn) => fn()))
</script>

<template>
  <section v-if="posts.length" ref="sectionEl" class="mx-auto max-w-7xl px-6 lg:px-10">
    <div class="flex items-end justify-between gap-4">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.25em] text-blue-600">Curated by the team</p>
        <h2 ref="headingEl" class="mt-2 font-display text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Editor's selection
        </h2>
      </div>
      <p class="hidden text-sm text-gray-400 sm:block">Scroll to explore →</p>
    </div>

    <div ref="railEl" class="rail-fade mt-8 -mx-6 px-6 lg:-mx-10 lg:px-10">
      <div class="snap-rail pb-4">
        <router-link
          v-for="(post, i) in posts"
          :key="post.id"
          :ref="(el) => (cardRefs.value[i] = el?.$el ?? el)"
          :to="`${basePath}/${post.slug}`"
          data-cursor-hover
          class="group relative flex w-[19rem] shrink-0 flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-soft transition-shadow duration-300 hover:shadow-lift sm:w-[24rem]"
          @mouseenter="prefetchRoute(basePath === '/blog' ? 'blog-details' : 'article-details')"
        >
          <div class="relative aspect-[4/3] overflow-hidden bg-slate-100">
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
          <div class="flex flex-1 flex-col p-6">
            <h3
              class="text-lg font-semibold leading-snug text-gray-900 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:text-blue-600"
            >
              {{ post.title }}
            </h3>
            <p class="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-gray-500">{{ post.description }}</p>
            <div class="mt-5 flex items-center gap-2 border-t border-slate-100 pt-4 text-xs text-gray-400">
              <span>{{ formatDate(post.createdAt) }}</span>
              <span>·</span>
              <span>{{ post.readingTime }} min read</span>
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </section>
</template>
