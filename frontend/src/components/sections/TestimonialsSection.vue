<script setup>
import { onMounted, ref } from 'vue'
import { revealHeading, revealUp } from '../../composables/useReveal'
import { testimonials } from '../../data/content'
import Avatar from '../ui/Avatar.vue'

const sectionEl = ref(null)
const headingEl = ref(null)
const gridEl = ref(null)

onMounted(() => {
  revealHeading(headingEl.value, { type: 'words', trigger: sectionEl.value, stagger: 0.03 })
  revealUp(gridEl.value.children, { trigger: gridEl.value, start: 'top 85%', y: 40, stagger: 0.1 })
})
</script>

<template>
  <section ref="sectionEl" class="relative bg-slate-50 px-6 py-16 lg:px-10 lg:py-20">
    <div class="mx-auto max-w-2xl text-center">
      <p class="mb-4 text-sm font-semibold text-blue-600">From actual learners</p>
      <h2 ref="headingEl" class="font-display text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl">
        Said better by the people who took it.
      </h2>
    </div>

    <div ref="gridEl" class="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-5 sm:grid-cols-2">
      <div
        v-for="t in testimonials"
        :key="t.name"
        class="rounded-2xl border border-slate-200/80 bg-white p-8 shadow-soft"
      >
        <p class="text-base leading-relaxed text-gray-700">&ldquo;{{ t.quote }}&rdquo;</p>
        <div class="mt-6 flex items-center gap-3">
          <Avatar :name="t.name" size="md" />
          <div>
            <p class="text-sm font-semibold text-gray-900">{{ t.name }}</p>
            <p class="text-xs text-gray-400">{{ t.role }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
