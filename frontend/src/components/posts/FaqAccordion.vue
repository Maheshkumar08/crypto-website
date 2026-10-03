<script setup>
import { ref } from 'vue'
import { gsap } from '../../composables/gsapSetup'

const props = defineProps({
  faqs: { type: Array, default: () => [] },
})

const openIndex = ref(null)
const panelRefs = ref([])

function toggle(i) {
  const panel = panelRefs.value[i]
  const isOpen = openIndex.value === i

  if (openIndex.value !== null && openIndex.value !== i) {
    gsap.to(panelRefs.value[openIndex.value], { height: 0, opacity: 0, duration: 0.35, ease: 'power2.inOut' })
  }

  if (isOpen) {
    gsap.to(panel, { height: 0, opacity: 0, duration: 0.35, ease: 'power2.inOut' })
    openIndex.value = null
  } else {
    gsap.set(panel, { height: 'auto' })
    gsap.from(panel, { height: 0, opacity: 0, duration: 0.4, ease: 'power2.inOut' })
    gsap.to(panel, { opacity: 1, duration: 0.3 })
    openIndex.value = i
  }
}
</script>

<template>
  <section v-if="faqs.length" class="mx-auto max-w-3xl">
    <p class="text-xs font-semibold uppercase tracking-[0.25em] text-blue-600">Good to know</p>
    <h2 class="mt-2 font-display text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Frequently asked</h2>
    <div class="mt-8 space-y-3">
      <div
        v-for="(faq, i) in faqs"
        :key="faq.question"
        class="overflow-hidden rounded-2xl border bg-white transition-all duration-300"
        :class="openIndex === i ? 'border-blue-200 shadow-card' : 'border-slate-200/80 shadow-soft'"
      >
        <button class="flex w-full items-center justify-between px-6 py-5 text-left" @click="toggle(i)">
          <span class="pr-6 text-sm font-semibold text-gray-900">{{ faq.question }}</span>
          <span
            class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-gray-500 transition-all duration-300"
            :class="openIndex === i ? 'rotate-45 border-blue-200 bg-blue-50 text-blue-600' : 'border-slate-200'"
          >
            +
          </span>
        </button>
        <div :ref="(el) => (panelRefs[i] = el)" class="overflow-hidden px-6" :style="{ height: 0, opacity: 0 }">
          <p class="pb-5 text-sm leading-relaxed text-gray-500">{{ faq.answer }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
