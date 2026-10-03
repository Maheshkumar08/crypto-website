<script setup>
import { onMounted, ref } from 'vue'
import { revealUp } from '../../../composables/useReveal'
import { trustStrip } from '../../../data/content'

const sectionEl = ref(null)
const promisesEl = ref(null)
const noteEl = ref(null)

onMounted(() => {
  revealUp(promisesEl.value.children, { trigger: promisesEl.value, start: 'top 85%', y: 20, stagger: 0.08 })
  revealUp(noteEl.value, { trigger: noteEl.value, start: 'top 90%', y: 20 })
})
</script>

<template>
  <section ref="sectionEl" class="relative px-6 py-16 lg:px-10">
    <div class="mx-auto max-w-6xl">
      <p class="text-center text-sm font-semibold text-blue-700">{{ trustStrip.label }}</p>

      <div ref="promisesEl" class="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div v-for="p in trustStrip.promises" :key="p" class="flex items-start gap-2.5 text-sm text-gray-700">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="mt-0.5 h-4 w-4 shrink-0 text-blue-600">
            <path d="M20 6 9 17l-5-5" />
          </svg>
          {{ p }}
        </div>
      </div>

      <div ref="noteEl" class="mx-auto mt-10 max-w-3xl rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center">
        <p class="text-xs font-semibold uppercase tracking-[0.1em] text-amber-800">Educational content — not financial advice</p>
        <p class="mt-2 text-sm leading-relaxed text-amber-900/80">{{ trustStrip.disclaimer }}</p>
      </div>
    </div>
  </section>
</template>
