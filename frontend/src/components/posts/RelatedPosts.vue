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
const railEl = ref(null)

onMounted(() => {
  revealHeading(headingEl.value, { type: 'words', trigger: sectionEl.value, stagger: 0.03 })
  if (railEl.value) revealUp(railEl.value, { trigger: railEl.value, y: 30, stagger: 0 })
})
</script>

<template>
  <section v-if="posts.length" ref="sectionEl" class="border-t border-slate-100 px-6 py-16 lg:px-10">
    <div class="mx-auto max-w-6xl">
      <p class="text-xs font-semibold uppercase tracking-[0.25em] text-blue-600">Keep reading</p>
      <h2 ref="headingEl" class="mt-2 font-display text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Related reading</h2>

      <div ref="railEl" class="rail-fade mt-8 -mx-6 px-6 lg:-mx-10 lg:px-10">
        <div class="snap-rail pb-2">
          <router-link
            v-for="post in posts"
            :key="post.id"
            :to="`${basePath}/${post.slug}`"
            data-cursor-hover
            class="group w-[19rem] shrink-0 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-soft transition-shadow duration-300 hover:shadow-lift sm:w-[22rem]"
            @mouseenter="prefetchRoute(basePath === '/blog' ? 'blog-details' : 'article-details')"
          >
            <div class="aspect-[16/10] overflow-hidden bg-slate-100">
              <img
                v-if="post.coverImage"
                :src="optimizedUrl(post.coverImage, { width: 560 })"
                :alt="post.title"
                loading="lazy"
                class="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <div v-else class="flex h-full w-full items-center justify-center text-sm text-gray-300">No cover image</div>
            </div>
            <div class="p-5">
              <Badge v-if="post.category" color="blue" variant="soft">{{ post.category }}</Badge>
              <h3 class="mt-3 line-clamp-2 text-base font-semibold leading-snug text-gray-900 transition-colors group-hover:text-blue-600">
                {{ post.title }}
              </h3>
              <p class="mt-2 text-xs text-gray-400">{{ formatDate(post.createdAt) }} · {{ post.readingTime }} min read</p>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </section>
</template>
