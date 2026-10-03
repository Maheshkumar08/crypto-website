<script setup>
import { onMounted, ref } from 'vue'
import { revealUp } from '../../../composables/useReveal'
import { officeHours } from '../../../data/content'

const panelEl = ref(null)

onMounted(() => {
  revealUp(panelEl.value, { trigger: panelEl.value, start: 'top 85%', y: 30 })
})
</script>

<template>
  <div ref="panelEl" class="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-soft">
    <div class="relative h-48 overflow-hidden bg-slate-50">
      <svg class="absolute inset-0 h-full w-full text-slate-200" viewBox="0 0 400 200" fill="none">
        <path d="M0 40h400M0 90h400M0 140h400" stroke="currentColor" stroke-width="1" />
        <path d="M60 0v200M160 0v200M260 0v200M340 0v200" stroke="currentColor" stroke-width="1" />
      </svg>
      <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
      <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <span class="absolute inset-0 -m-4 animate-ping rounded-full bg-blue-500/20" />
        <span class="relative flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white shadow-lift">
          <svg viewBox="0 0 20 20" fill="currentColor" class="h-4 w-4">
            <path
              fill-rule="evenodd"
              d="M10 2a6 6 0 0 0-6 6c0 4.5 6 10 6 10s6-5.5 6-10a6 6 0 0 0-6-6Zm0 8.25a2.25 2.25 0 1 1 0-4.5 2.25 2.25 0 0 1 0 4.5Z"
              clip-rule="evenodd"
            />
          </svg>
        </span>
      </div>
    </div>

    <div class="flex flex-1 flex-col p-8">
      <h3 class="text-lg font-semibold text-gray-900">Visit our studio</h3>
      <p class="mt-1 text-sm text-gray-500">148 Lafayette St, New York, NY — by appointment only.</p>

      <div class="mt-6 space-y-3 border-t border-slate-100 pt-6">
        <div v-for="row in officeHours" :key="row.day" class="flex items-center justify-between text-sm">
          <span class="text-gray-500">{{ row.day }}</span>
          <span class="font-medium text-gray-900">{{ row.hours }}</span>
        </div>
      </div>

      <div class="mt-6 flex gap-4 border-t border-slate-100 pt-6 text-sm text-gray-500">
        <a href="#" data-cursor-hover class="transition-colors hover:text-blue-600">Twitter</a>
        <a href="#" data-cursor-hover class="transition-colors hover:text-blue-600">LinkedIn</a>
        <a href="#" data-cursor-hover class="transition-colors hover:text-blue-600">Discord</a>
      </div>
    </div>
  </div>
</template>
