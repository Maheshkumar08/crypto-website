<script setup>
import { onMounted, ref } from 'vue'
import { revealUp } from '../../../composables/useReveal'
import { closingQuote } from '../../../data/content'

const quoteEl = ref(null)

onMounted(() => {
  revealUp(quoteEl.value, { trigger: quoteEl.value, start: 'top 85%', y: 20 })
})
</script>

<template>
  <section class="border-y border-slate-200 bg-blue-50/50 px-6 py-20 lg:px-10">
    <p ref="quoteEl" class="mx-auto max-w-3xl text-center text-lg italic leading-8 text-gray-700">
      {{ closingQuote.text }}
    </p>
  </section>
</template>
