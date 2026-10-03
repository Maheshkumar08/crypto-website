<script setup>
import { onMounted, ref } from 'vue'
import { revealHeading, revealUp } from '../../../composables/useReveal'
import { correctionsPolicy } from '../../../data/content'

const sectionEl = ref(null)
const headingEl = ref(null)
const boxEl = ref(null)

onMounted(() => {
  revealHeading(headingEl.value, { type: 'words', trigger: sectionEl.value, stagger: 0.03 })
  revealUp(boxEl.value, { trigger: boxEl.value, start: 'top 88%', y: 20 })
})
</script>

<template>
  <section ref="sectionEl" class="relative mx-auto max-w-4xl px-6 py-16 lg:px-10">
    <div class="mx-auto max-w-2xl text-center">
      <p class="mb-4 text-sm font-semibold text-cyan-600">{{ correctionsPolicy.eyebrow }}</p>
      <h2 ref="headingEl" class="font-display text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl">
        {{ correctionsPolicy.heading }}
      </h2>
    </div>

    <div ref="boxEl" class="mx-auto mt-12 max-w-2xl rounded-2xl border-l-4 border-blue-500 bg-blue-50 p-8">
      <p class="text-[15px] leading-7 text-gray-700">
        {{ correctionsPolicy.intro }}
        <a
          :href="correctionsPolicy.linkHref"
          class="font-semibold text-blue-700 underline underline-offset-2 hover:text-blue-800"
          >{{ correctionsPolicy.linkLabel }}</a
        >.
      </p>
      <p class="mt-4 text-[15px] leading-7 text-gray-700">{{ correctionsPolicy.closing }}</p>
    </div>
  </section>
</template>
