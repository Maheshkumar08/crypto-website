<script setup>
import { onMounted, ref } from 'vue'
import { revealHeading, revealUp } from '../../../composables/useReveal'
import { contactStory } from '../../../data/content'

const sectionEl = ref(null)
const headingEl = ref(null)
const paraEl = ref(null)

onMounted(() => {
  revealHeading(headingEl.value, { type: 'words', trigger: sectionEl.value, stagger: 0.03 })
  revealUp(paraEl.value.children, { trigger: paraEl.value, start: 'top 85%', y: 24, stagger: 0.1 })
})
</script>

<template>
  <section ref="sectionEl" class="relative mx-auto max-w-4xl px-6 py-16 lg:px-10">
    <h2 ref="headingEl" class="font-display text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl">
      {{ contactStory.heading }}
    </h2>

    <div ref="paraEl" class="mt-8 space-y-5">
      <p v-for="(p, i) in contactStory.paragraphs" :key="i" class="max-w-2xl text-lg leading-8 text-black">
        {{ p }}
      </p>
    </div>
  </section>
</template>
