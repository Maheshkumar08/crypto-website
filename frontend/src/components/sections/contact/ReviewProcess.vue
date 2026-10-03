<script setup>
import { onMounted, ref } from 'vue'
import { revealHeading, revealUp } from '../../../composables/useReveal'
import { contactReviewProcess } from '../../../data/content'

const sectionEl = ref(null)
const headingEl = ref(null)
const listEl = ref(null)

onMounted(() => {
  revealHeading(headingEl.value, { type: 'words', trigger: sectionEl.value, stagger: 0.03 })
  revealUp(listEl.value.children, { trigger: listEl.value, start: 'top 85%', y: 30, stagger: 0.08 })
})
</script>

<template>
  <section ref="sectionEl" class="relative mx-auto max-w-4xl px-6 py-16 lg:px-10">
    <h2 ref="headingEl" class="font-display text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl">
      {{ contactReviewProcess.heading }}
    </h2>

    <p class="mt-4 max-w-2xl text-lg text-gray-500">{{ contactReviewProcess.intro }}</p>

    <div ref="listEl" class="mt-12 divide-y divide-slate-200 border-t border-slate-200">
      <div
        v-for="(step, i) in contactReviewProcess.steps"
        :key="step.title"
        class="grid grid-cols-[56px_1fr] gap-6 py-8"
      >
        <div class="font-display text-3xl font-bold leading-none text-blue-600">
          {{ String(i + 1).padStart(2, '0') }}
        </div>

        <div>
          <h3 class="text-lg font-semibold text-gray-900">{{ step.title }}</h3>
          <p class="mt-2 leading-relaxed text-gray-500">{{ step.description }}</p>
        </div>
      </div>
    </div>

    <p class="mt-10 max-w-2xl text-sm leading-relaxed text-gray-500">
      {{ contactReviewProcess.note }}
    </p>
  </section>
</template>
