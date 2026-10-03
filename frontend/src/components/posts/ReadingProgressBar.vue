<script setup>
import { useReadingProgress } from '../../composables/useReadingProgress'

const props = defineProps({
  target: { type: Object, default: null }, // the article element (or null before it mounts)
})

// A getter, not `props.target` directly — the prop is already an unwrapped
// value by the time it reaches here, so passing it straight through would
// freeze on whatever it was (often null) at setup time instead of tracking
// the parent's ref as it updates.
const progress = useReadingProgress(() => props.target)
</script>

<template>
  <div class="fixed inset-x-0 top-20 z-40 h-[3px] bg-slate-100/60">
    <div
      class="h-full origin-left bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 shadow-[0_0_12px_rgba(37,99,235,0.5)] transition-transform duration-100"
      :style="{ transform: `scaleX(${progress})` }"
    />
  </div>
</template>
