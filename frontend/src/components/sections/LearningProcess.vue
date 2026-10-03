<script setup>
import { onMounted, ref } from 'vue'
import { revealHeading, revealUp } from '../../composables/useReveal'
import { process } from '../../data/content'

const sectionEl = ref(null)
const headingEl = ref(null)
const gridEl = ref(null)

onMounted(() => {
  revealHeading(headingEl.value, { type: 'words', trigger: sectionEl.value, stagger: 0.03 })
  revealUp(gridEl.value.children, { trigger: gridEl.value, start: 'top 85%', y: 40, stagger: 0.12 })
})
</script>

<template>
  <section ref="sectionEl" class="relative mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-20">
    <div class="mx-auto max-w-2xl text-center">
      <p class="mb-4 text-sm font-semibold text-cyan-600">How it works</p>
      <h2 ref="headingEl" class="font-display text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl">
        Four steps, no guesswork.
      </h2>
    </div>

    <div ref="gridEl" class="relative mt-16 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
      <div v-for="item in process" :key="item.step" class="relative">
        <span class="rank-numeral text-6xl">{{ item.step }}</span>
        <h3 class="mt-2 text-base font-semibold text-gray-900">{{ item.title }}</h3>
        <p class="mt-3 text-sm leading-relaxed text-gray-500">{{ item.description }}</p>
      </div>
    </div>
  </section>
</template>
