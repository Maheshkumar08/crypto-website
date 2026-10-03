<script setup>
import { onMounted, ref } from 'vue'
import { prefetchRoute } from '../../composables/usePrefetch'
import { revealHeading, revealUp } from '../../composables/useReveal'

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
</script>

<template>
  <section v-if="posts.length" ref="sectionEl" class="mx-auto max-w-4xl px-6 lg:px-10">
    <div class="rounded-[2rem] border border-slate-200/80 bg-gray-900 px-8 py-10 shadow-lift sm:px-12 sm:py-12">
      <div class="flex items-center justify-between">
        <h2 ref="headingEl" class="font-display text-xl font-bold tracking-tight text-white sm:text-2xl">Most popular</h2>
        <span class="text-xs font-medium uppercase tracking-[0.2em] text-white/40">This month</span>
      </div>

      <ol ref="listEl" class="mt-8 divide-y divide-white/10">
        <li v-for="(post, i) in posts" :key="post.id">
          <router-link
            :to="`${basePath}/${post.slug}`"
            data-cursor-hover
            class="group flex items-center justify-between gap-6 py-5 first:pt-0 last:pb-0"
            @mouseenter="prefetchRoute(basePath === '/blog' ? 'blog-details' : 'article-details')"
          >
            <div class="flex min-w-0 items-baseline gap-4">
              <span class="font-mono text-sm text-white/30">{{ String(i + 1).padStart(2, '0') }}</span>
              <p
                class="truncate font-display text-base font-semibold text-white/90 transition-transform duration-300 group-hover:translate-x-1.5 group-hover:text-white sm:text-lg"
              >
                {{ post.title }}
              </p>
            </div>
            <span class="shrink-0 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-cyan-300">
              {{ (post.views || 0).toLocaleString() }} views
            </span>
          </router-link>
        </li>
      </ol>
    </div>
  </section>
</template>
