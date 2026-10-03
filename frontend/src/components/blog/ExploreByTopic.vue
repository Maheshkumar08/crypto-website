<script setup>
import { computed, onMounted, ref } from 'vue'
import { optimizedUrl } from '../../services/cloudinary'
import { prefetchRoute } from '../../composables/usePrefetch'
import { revealHeading, revealUp } from '../../composables/useReveal'
import { slugify } from '../../composables/text'
import Badge from '../ui/Badge.vue'

const props = defineProps({
  posts: { type: Array, required: true },
  basePath: { type: String, required: true },
})

const emit = defineEmits(['select-category'])

// Groups by whatever categories actually exist in the content, rather than
// a fixed hardcoded taxonomy — stays correct as an admin adds new topics.
const topics = computed(() => {
  const map = new Map()
  for (const post of props.posts) {
    if (!post.category) continue
    if (!map.has(post.category)) map.set(post.category, [])
    map.get(post.category).push(post)
  }
  return [...map.entries()]
    .map(([category, items]) => ({ category, slug: slugify(category), items: items.slice(0, 5) }))
    .filter((t) => t.items.length >= 2)
    .slice(0, 5)
})

const sectionEl = ref(null)
const headingEl = ref(null)
const blockRefs = ref([])

function scrollToTopic(slug) {
  document.getElementById(`topic-${slug}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

onMounted(() => {
  revealHeading(headingEl.value, { type: 'words', trigger: sectionEl.value, stagger: 0.03 })
  blockRefs.value.forEach((block) => {
    if (block) revealUp(block, { trigger: block, start: 'top 85%', y: 36 })
  })
})
</script>

<template>
  <section v-if="topics.length" ref="sectionEl" class="mx-auto max-w-7xl space-y-16 px-6 lg:px-10">
    <div>
      <h2 ref="headingEl" class="font-display text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Explore by topic</h2>
      <div class="mt-5 flex flex-wrap gap-2.5">
        <button
          v-for="topic in topics"
          :key="topic.slug"
          type="button"
          data-cursor-hover
          class="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:text-blue-700 hover:shadow-soft"
          @click="scrollToTopic(topic.slug)"
        >
          {{ topic.category }}
        </button>
      </div>
    </div>

    <div
      v-for="(topic, ti) in topics"
      :id="`topic-${topic.slug}`"
      :key="topic.category"
      :ref="(el) => (blockRefs.value[ti] = el?.$el ?? el)"
      class="scroll-mt-28"
    >
      <div class="flex items-center justify-between">
        <h3 class="font-display text-xl font-bold tracking-tight text-gray-900">{{ topic.category }}</h3>
        <button
          type="button"
          class="text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
          @click="emit('select-category', topic.category)"
        >
          View all →
        </button>
      </div>

      <div class="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <router-link
          v-if="topic.items[0]"
          :to="`${basePath}/${topic.items[0].slug}`"
          data-cursor-hover
          class="group relative row-span-2 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-soft transition-shadow duration-300 hover:shadow-lift lg:col-span-2"
          @mouseenter="prefetchRoute(basePath === '/blog' ? 'blog-details' : 'article-details')"
        >
          <div class="aspect-[16/9] overflow-hidden bg-slate-100">
            <img
              v-if="topic.items[0].coverImage"
              :src="optimizedUrl(topic.items[0].coverImage, { width: 800 })"
              :alt="topic.items[0].title"
              loading="lazy"
              class="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </div>
          <div class="p-6">
            <Badge color="blue" variant="soft">{{ topic.category }}</Badge>
            <h4 class="mt-3 text-xl font-semibold leading-snug text-gray-900 transition-colors group-hover:text-blue-600">
              {{ topic.items[0].title }}
            </h4>
            <p class="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-500">{{ topic.items[0].description }}</p>
          </div>
        </router-link>

        <router-link
          v-for="post in topic.items.slice(1, 5)"
          :key="post.id"
          :to="`${basePath}/${post.slug}`"
          data-cursor-hover
          class="group flex items-center gap-4 overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-3 shadow-soft transition-shadow duration-300 hover:shadow-card"
          @mouseenter="prefetchRoute(basePath === '/blog' ? 'blog-details' : 'article-details')"
        >
          <div class="aspect-square h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-100">
            <img
              v-if="post.coverImage"
              :src="optimizedUrl(post.coverImage, { width: 128 })"
              :alt="post.title"
              loading="lazy"
              class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
          <div class="min-w-0">
            <p class="truncate text-sm font-semibold leading-snug text-gray-900 transition-colors group-hover:text-blue-600">
              {{ post.title }}
            </p>
            <p class="mt-1 text-xs text-gray-400">{{ post.readingTime }} min read</p>
          </div>
        </router-link>
      </div>
    </div>
  </section>
</template>
