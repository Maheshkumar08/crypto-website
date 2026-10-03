<script setup>
import { onMounted, ref } from 'vue'
import { revealHeading, revealUp } from '../../../composables/useReveal'
import { aboutAuthors } from '../../../data/content'
import GlowCard from '../../ui/GlowCard.vue'
import Badge from '../../ui/Badge.vue'

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
      <p class="mb-4 text-sm font-semibold text-blue-600">{{ aboutAuthors.eyebrow }}</p>
      <h2 ref="headingEl" class="font-display text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl">
        {{ aboutAuthors.heading }}
      </h2>
    </div>

    <div ref="gridEl" class="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2">
      <GlowCard v-for="person in aboutAuthors.people" :key="person.name" class="p-8" data-cursor-hover>
        <div class="flex gap-5">
          <div class="h-14 w-14 shrink-0 rounded-full border border-blue-200 bg-blue-50" />
          <div>
            <h3 class="text-lg font-semibold text-gray-900">{{ person.name }}</h3>
            <Badge color="blue" class="mt-1.5">{{ person.credential }}</Badge>
            <p class="mt-3 text-sm leading-relaxed text-gray-500">{{ person.bio }}</p>
          </div>
        </div>
      </GlowCard>
    </div>

    <p class="mx-auto mt-8 max-w-4xl text-center text-xs text-gray-400">
      {{ aboutAuthors.note }}
    </p>
  </section>
</template>
