<script setup>
import { onMounted, ref } from 'vue'
import { revealHeading, revealUp } from '../../../composables/useReveal'
import { aboutContact } from '../../../data/content'
import GlowCard from '../../ui/GlowCard.vue'
import FeatureIcon from '../../ui/FeatureIcon.vue'

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
      <p class="mb-4 text-sm font-semibold text-blue-600">{{ aboutContact.eyebrow }}</p>
      <h2 ref="headingEl" class="font-display text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl">
        {{ aboutContact.heading }}
      </h2>
      <p class="mt-4 text-lg text-gray-500">{{ aboutContact.subtitle }}</p>
    </div>

    <div ref="gridEl" class="mx-auto mt-14 grid max-w-5xl grid-cols-1 gap-5 sm:grid-cols-3">
      <GlowCard v-for="opt in aboutContact.options" :key="opt.label" class="p-8" data-cursor-hover>
        <div class="flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 text-blue-600">
          <FeatureIcon :name="opt.icon" />
        </div>
        <h3 class="mt-6 text-sm font-medium text-gray-500">{{ opt.label }}</h3>
        <p class="mt-1 text-lg font-semibold text-gray-900">{{ opt.title }}</p>
        <p class="mt-3 text-sm leading-relaxed text-gray-500">{{ opt.detail }}</p>
      </GlowCard>
    </div>

    <p class="mx-auto mt-8 max-w-2xl text-center text-xs font-medium text-amber-700">
      {{ aboutContact.safetyNote }}
    </p>
  </section>
</template>
