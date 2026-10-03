<script setup>
import { onMounted, ref } from 'vue'
import { revealHeading, revealUp } from '../../../composables/useReveal'
import { neverDo } from '../../../data/content'

const sectionEl = ref(null)
const headingEl = ref(null)
const listEl = ref(null)

onMounted(() => {
  revealHeading(headingEl.value, { type: 'words', trigger: sectionEl.value, stagger: 0.03 })
  revealUp(listEl.value.children, { trigger: listEl.value, start: 'top 85%', y: 20, stagger: 0.08 })
})
</script>

<template>
  <section ref="sectionEl" class="relative mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-20">
    <div class="mx-auto max-w-2xl text-center">
      <p class="mb-4 text-sm font-semibold text-blue-600">{{ neverDo.eyebrow }}</p>
      <h2 ref="headingEl" class="font-display text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl">
        {{ neverDo.heading }}
      </h2>
    </div>

    <div ref="listEl" class="mx-auto mt-14 max-w-2xl space-y-4">
      <div
        v-for="item in neverDo.items"
        :key="item"
        class="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-4 shadow-soft"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="mt-0.5 h-5 w-5 shrink-0 text-blue-600">
          <path d="M20 6 9 17l-5-5" />
        </svg>
        <p class="text-[15px] leading-relaxed text-gray-700">{{ item }}</p>
      </div>
    </div>
  </section>
</template>
