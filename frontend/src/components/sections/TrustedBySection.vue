<script setup>
import { onMounted, ref } from 'vue'
import { revealUp } from '../../composables/useReveal'
import { trustedBy } from '../../data/content'

const sectionEl = ref(null)
const logosEl = ref(null)

onMounted(() => {
  revealUp(logosEl.value.children, { trigger: sectionEl.value, y: 16, stagger: 0.06 })
})
</script>

<template>
  <section ref="sectionEl" class="relative mx-auto max-w-6xl px-6 py-16 lg:px-10">
    <p class="text-center text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">{{ trustedBy.label }}</p>
    <div ref="logosEl" class="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
      <span
        v-for="logo in trustedBy.logos"
        :key="logo"
        class="font-display text-lg font-semibold tracking-tight text-gray-300 transition-colors duration-300 hover:text-gray-500"
      >
        {{ logo }}
      </span>
    </div>
  </section>
</template>
