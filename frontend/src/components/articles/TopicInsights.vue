<script setup>
import { computed, onMounted, ref } from 'vue'
import { optimizedUrl } from '../../services/cloudinary'
import { prefetchRoute } from '../../composables/usePrefetch'
import { revealHeading, revealUp } from '../../composables/useReveal'
import { formatDate } from '../../composables/text'

const props = defineProps({
  posts: { type: Array, required: true },
})

// Surfaces the two categories with the deepest coverage as horizontal
// "insight" rails — reads as Market Insights / Technical Analysis / whatever
// taxonomy the admin actually uses, without hardcoding names.
const topics = computed(() => {
  const map = new Map()
  for (const post of props.posts) {
    if (!post.category) continue
    if (!map.has(post.category)) map.set(post.category, [])
    map.get(post.category).push(post)
  }
  return [...map.entries()]
    .map(([category, items]) => ({ category, items: items.slice(0, 6) }))
    .filter((t) => t.items.length >= 3)
    .sort((a, b) => b.items.length - a.items.length)
    .slice(0, 2)
})

const sectionEl = ref(null)
const headingEl = ref(null)
const railRefs = ref([])

onMounted(() => {
  revealHeading(headingEl.value, { type: 'words', trigger: sectionEl.value, stagger: 0.03 })
  railRefs.value.forEach((rail) => {
    if (rail) revealUp(rail, { trigger: rail, y: 30, stagger: 0 })
  })
})
</script>

<template>
  <section v-if="topics.length" ref="sectionEl" class="mx-auto max-w-7xl space-y-14 px-6 lg:px-10">
    <h2 ref="headingEl" class="font-display text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Topic insights</h2>

    <div v-for="(topic, ti) in topics" :key="topic.category">
      <div class="flex items-center justify-between border-b border-slate-200 pb-4">
        <h3 class="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-700">{{ topic.category }}</h3>
        <span class="text-xs text-gray-400">{{ topic.items.length }} reports</span>
      </div>

      <div :ref="(el) => (railRefs.value[ti] = el)" class="rail-fade mt-6 -mx-6 px-6 lg:-mx-10 lg:px-10">
        <div class="snap-rail pb-2">
          <router-link
            v-for="post in topic.items"
            :key="post.id"
            :to="`/articles/${post.slug}`"
            data-cursor-hover
            class="group w-[17rem] shrink-0 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-soft transition-shadow duration-300 hover:shadow-lift"
            @mouseenter="prefetchRoute('article-details')"
          >
            <div class="aspect-[16/10] overflow-hidden bg-slate-100">
              <img
                v-if="post.coverImage"
                :src="optimizedUrl(post.coverImage, { width: 480 })"
                :alt="post.title"
                loading="lazy"
                class="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <div v-else class="flex h-full w-full items-center justify-center text-sm text-gray-300">No cover image</div>
            </div>
            <div class="p-5">
              <h4 class="line-clamp-2 text-sm font-semibold leading-snug text-gray-900 transition-colors group-hover:text-blue-600">
                {{ post.title }}
              </h4>
              <p class="mt-2 text-xs text-gray-400">{{ formatDate(post.createdAt) }}</p>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </section>
</template>
