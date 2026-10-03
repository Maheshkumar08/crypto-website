<script setup>
import { onMounted, ref } from 'vue'
import { revealHeading, revealUp } from '../../composables/useReveal'
import BlogCard from '../sections/blog/BlogCard.vue'

defineProps({
  posts: { type: Array, default: () => [] },
  basePath: { type: String, default: '/blog' },
})

const sectionEl = ref(null)
const headingEl = ref(null)
const gridEl = ref(null)

onMounted(() => {
  revealHeading(headingEl.value, { type: 'words', trigger: sectionEl.value, stagger: 0.03 })
  if (gridEl.value) revealUp(gridEl.value.children, { trigger: gridEl.value, y: 32, stagger: 0.12 })
})
</script>

<template>
  <section v-if="posts.length" ref="sectionEl" class="border-t border-slate-100 bg-[#FBFCFE] px-6 py-16 lg:px-10">
    <div class="mx-auto max-w-6xl">
      <p class="text-xs font-semibold uppercase tracking-[0.25em] text-blue-600">Keep reading</p>
      <h2 ref="headingEl" class="mt-2 font-display text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
        Related articles
      </h2>

      <div ref="gridEl" class="mt-10 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
        <BlogCard v-for="post in posts" :key="post.id" :post="post" :base-path="basePath" />
      </div>
    </div>
  </section>
</template>
