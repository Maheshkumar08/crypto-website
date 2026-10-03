<script setup>
import { ref, watch } from 'vue'
import { gsap } from '../../composables/gsapSetup'
import { useReadingProgress } from '../../composables/useReadingProgress'

const props = defineProps({
  target: { type: Object, default: null }, // the article element (or null before it mounts)
})

const barEl = ref(null)
const progress = useReadingProgress(() => props.target)

// A quickTo tween (rather than a CSS transition) keeps the bar smooth even
// when `progress` fires on every scroll frame.
let setScale = null

watch(
  barEl,
  (el) => {
    if (el) setScale = gsap.quickTo(el, 'scaleX', { duration: 0.25, ease: 'power2.out' })
  },
  { immediate: true }
)

watch(progress, (value) => {
  if (setScale) setScale(value)
  else if (barEl.value) gsap.set(barEl.value, { scaleX: value })
})
</script>

<template>
  <div class="fixed inset-x-0 top-0 z-[60] h-1 bg-slate-100/70">
    <div
      ref="barEl"
      class="h-full w-full origin-left bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.4)]"
      style="transform: scaleX(0)"
    />
  </div>
</template>
