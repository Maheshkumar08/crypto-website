<script setup>
import { onMounted, ref } from 'vue'
import { revealHeading, revealUp } from '../../../composables/useReveal'
import { contactWriters } from '../../../data/content'
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
  <section ref="sectionEl" class="relative mx-auto max-w-4xl px-6 py-16 lg:px-10">
    <h2 ref="headingEl" class="font-display text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl">
      {{ contactWriters.heading }}
    </h2>

    <div ref="gridEl" class="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
      <GlowCard v-for="person in contactWriters.people" :key="person.name" class="p-8" data-cursor-hover>
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

    <p class="mt-6 max-w-2xl text-xs italic text-gray-400">
      {{ contactWriters.note }}
    </p>
  </section>
</template>
