<script setup>
import { computed } from 'vue'

const props = defineProps({
  name: { type: String, required: true },
  size: { type: String, default: 'md' }, // 'sm' | 'md' | 'lg'
})

const SIZES = {
  sm: 'h-7 w-7 text-[10px]',
  md: 'h-9 w-9 text-xs',
  lg: 'h-14 w-14 text-base',
}

// Flat solid color (no gradient, per this page's design system), still
// deterministic per name so the same author always renders the same swatch.
const FLAT_COLORS = ['#2563EB', '#0E7490', '#B45309', '#6D28D9', '#BE185D', '#047857']

const initials = computed(() =>
  props.name
    .split(' ')
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
)

const color = computed(() => {
  let hash = 0
  for (let i = 0; i < props.name.length; i++) hash = (hash * 31 + props.name.charCodeAt(i)) % FLAT_COLORS.length
  return FLAT_COLORS[Math.abs(hash)]
})
</script>

<template>
  <span
    class="flex shrink-0 items-center justify-center rounded-full font-semibold text-white"
    :class="SIZES[size]"
    :style="{ backgroundColor: color }"
  >
    {{ initials }}
  </span>
</template>
