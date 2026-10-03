<script setup>
import { onMounted, ref } from 'vue'
import { revealHeading, revealUp } from '../../../composables/useReveal'
import { values } from '../../../data/content'
import GlowCard from '../../ui/GlowCard.vue'
import FeatureIcon from '../../ui/FeatureIcon.vue'

const sectionEl = ref(null)
const headingEl = ref(null)
const gridEl = ref(null)

onMounted(() => {
  revealHeading(headingEl.value, { type: 'words', trigger: sectionEl.value, stagger: 0.03 })
  revealUp(gridEl.value.children, { trigger: gridEl.value, start: 'top 85%', y: 50, stagger: 0.1 })
})
</script>

<template>
  <section ref="sectionEl" class="relative mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-20">
    <div class="mx-auto max-w-2xl text-center">
      <p class="mb-4 text-sm font-semibold text-blue-600">What we hold onto</p>
      <h2 ref="headingEl" class="font-display text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl">
        Values that shape every lesson we ship.
      </h2>
    </div>

    <div ref="gridEl" class="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <GlowCard v-for="value in values" :key="value.title" class="p-7" data-cursor-hover>
        <div class="flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 text-blue-600">
          <FeatureIcon :name="value.icon" />
        </div>
        <h3 class="mt-6 text-base font-semibold text-gray-900">{{ value.title }}</h3>
        <p class="mt-3 text-sm leading-relaxed text-gray-500">{{ value.description }}</p>
      </GlowCard>
    </div>
  </section>
</template>
