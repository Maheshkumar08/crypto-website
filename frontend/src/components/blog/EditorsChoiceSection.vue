<script setup>
import { onMounted, ref } from 'vue'
import { formatDate } from '../../composables/text'
import { optimizedUrl } from '../../services/cloudinary'
import { prefetchRoute } from '../../composables/usePrefetch'
import { revealHeading, revealMask, revealUp } from '../../composables/useReveal'
import Badge from '../ui/Badge.vue'

defineProps({
  posts: { type: Array, required: true },
  basePath: { type: String, required: true },
})

const sectionEl = ref(null)
const headingEl = ref(null)
const rowRefs = ref([])
const imgRefs = ref([])

onMounted(() => {
  revealHeading(headingEl.value, { type: 'words', trigger: sectionEl.value, stagger: 0.03 })
  rowRefs.value.forEach((row) => {
    if (row) revealUp(row, { trigger: row, start: 'top 85%', y: 40 })
  })
  imgRefs.value.forEach((img) => {
    if (img) revealMask(img, { trigger: img, start: 'top 85%' })
  })
})
</script>

<template>
  <section v-if="posts.length" ref="sectionEl" class="mx-auto max-w-6xl px-6 lg:px-10">
    <div class="flex items-center gap-2">
      <span class="flex h-9 w-9 items-center justify-center rounded-full bg-amber-50 text-amber-600">
        <svg viewBox="0 0 20 20" fill="currentColor" class="h-4 w-4">
          <path d="M10 1.5 12.4 7l6 .6-4.5 4 1.3 5.9L10 14.6l-5.2 2.9L6.1 11.6l-4.5-4 6-.6L10 1.5Z" />
        </svg>
      </span>
      <h2 ref="headingEl" class="font-display text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Editor's choice</h2>
    </div>

    <div class="mt-12 space-y-16 sm:space-y-24">
      <router-link
        v-for="(post, i) in posts"
        :key="post.id"
        :ref="(el) => (rowRefs.value[i] = el?.$el ?? el)"
        :to="`${basePath}/${post.slug}`"
        data-cursor-hover
        class="group grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-10"
        @mouseenter="prefetchRoute(basePath === '/blog' ? 'blog-details' : 'article-details')"
      >
        <div
          class="aspect-[4/3] overflow-hidden rounded-3xl bg-slate-100 shadow-lift"
          :class="i % 2 === 1 ? 'lg:order-2' : ''"
        >
          <img
            v-if="post.coverImage"
            :ref="(el) => (imgRefs.value[i] = el)"
            :src="optimizedUrl(post.coverImage, { width: 800 })"
            :alt="post.title"
            loading="lazy"
            class="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div v-else class="flex h-full w-full items-center justify-center text-sm text-gray-300">No cover image</div>
        </div>

        <div :class="i % 2 === 1 ? 'lg:order-1' : ''">
          <span class="font-display text-6xl font-extrabold text-slate-100 sm:text-7xl">0{{ i + 1 }}</span>
          <Badge v-if="post.category" color="blue" variant="soft" class="-mt-2 block">{{ post.category }}</Badge>
          <h3 class="mt-4 font-display text-2xl font-bold leading-tight tracking-tight text-gray-900 transition-colors group-hover:text-blue-600 sm:text-3xl">
            {{ post.title }}
          </h3>
          <p class="mt-4 max-w-md text-base leading-relaxed text-gray-500">{{ post.description }}</p>
          <div class="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-400">
            <span class="font-medium text-gray-700">{{ post.author }}</span>
            <span>·</span>
            <span>{{ formatDate(post.createdAt) }}</span>
            <span>·</span>
            <span>{{ post.readingTime }} min read</span>
          </div>
          <span class="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-600">
            Read the story
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" class="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1">
              <path d="M4 10h12M11 5l5 5-5 5" />
            </svg>
          </span>
        </div>
      </router-link>
    </div>
  </section>
</template>
