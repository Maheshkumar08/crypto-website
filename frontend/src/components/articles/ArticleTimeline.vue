<script setup>
import { computed, onMounted, ref } from 'vue'
import { optimizedUrl } from '../../services/cloudinary'
import { prefetchRoute } from '../../composables/usePrefetch'
import { revealHeading, revealUp } from '../../composables/useReveal'

const props = defineProps({
  posts: { type: Array, required: true },
})

const groups = computed(() => {
  const map = new Map()
  for (const post of props.posts) {
    if (!post.createdAt) continue
    const key = post.createdAt.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
    if (!map.has(key)) map.set(key, [])
    map.get(key).push(post)
  }
  return [...map.entries()]
})

const sectionEl = ref(null)
const headingEl = ref(null)
const groupRefs = ref([])

onMounted(() => {
  revealHeading(headingEl.value, { type: 'words', trigger: sectionEl.value, stagger: 0.03 })
  groupRefs.value.forEach((g) => {
    if (g) revealUp(g, { trigger: g, start: 'top 88%', y: 24 })
  })
})
</script>

<template>
  <section v-if="groups.length" ref="sectionEl" class="mx-auto max-w-4xl px-6 lg:px-10">
    <p class="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-700">Archive</p>
    <h2 ref="headingEl" class="mt-2 font-display text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Publication timeline</h2>

    <div class="relative mt-12">
      <div class="absolute left-[7px] top-2 h-full w-px bg-gradient-to-b from-slate-300 via-slate-200 to-transparent" />

      <div class="space-y-14">
        <div v-for="([month, items], gi) in groups" :key="month" :ref="(el) => (groupRefs.value[gi] = el)" class="relative pl-9">
          <span class="absolute left-0 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-white ring-4 ring-blue-100">
            <span class="h-2 w-2 rounded-full bg-blue-600" />
          </span>
          <p class="font-display text-sm font-semibold uppercase tracking-[0.15em] text-gray-400">{{ month }}</p>

          <div class="mt-4 space-y-1">
            <router-link
              v-for="post in items"
              :key="post.id"
              :to="`/articles/${post.slug}`"
              data-cursor-hover
              class="group flex items-center gap-4 rounded-xl px-3 py-3 transition-colors -mx-3 hover:bg-slate-50"
              @mouseenter="prefetchRoute('article-details')"
            >
              <div class="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                <img
                  v-if="post.coverImage"
                  :src="optimizedUrl(post.coverImage, { width: 96 })"
                  :alt="post.title"
                  loading="lazy"
                  class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div class="min-w-0 flex-1">
                <p class="truncate font-display text-lg font-semibold text-gray-900 transition-colors group-hover:text-blue-600">
                  {{ post.title }}
                </p>
                <p class="mt-0.5 text-xs text-gray-400">{{ post.category }}</p>
              </div>
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" class="h-4 w-4 shrink-0 text-gray-300 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:text-blue-600 group-hover:opacity-100">
                <path d="M4 10h12M11 5l5 5-5 5" />
              </svg>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
