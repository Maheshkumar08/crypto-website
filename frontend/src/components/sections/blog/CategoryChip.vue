<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: { type: String, required: true },
  size: { type: String, default: 'md' }, // 'sm' | 'md'
})

// Flat, deterministic per-category color (no gradients) — the same category
// name always lands on the same swatch, so the sidebar/chips/badges agree
// with each other without a maintained color map.
const PALETTE = [
  { bg: '#EAF2FF', fg: '#1D4ED8' },
  { bg: '#EAFBF3', fg: '#047857' },
  { bg: '#FFF3E0', fg: '#B45309' },
  { bg: '#F4EEFF', fg: '#6D28D9' },
  { bg: '#FDEAEF', fg: '#BE185D' },
  { bg: '#E8FBFC', fg: '#0E7490' },
]

const swatch = computed(() => {
  let hash = 0
  for (let i = 0; i < props.label.length; i++) hash = (hash * 31 + props.label.charCodeAt(i)) % PALETTE.length
  return PALETTE[Math.abs(hash)]
})
</script>

<template>
  <span
    class="inline-flex w-fit items-center rounded-full font-semibold"
    :class="size === 'sm' ? 'px-2.5 py-1 text-[11px]' : 'px-3 py-1.5 text-xs'"
    :style="{ backgroundColor: swatch.bg, color: swatch.fg }"
  >
    {{ label }}
  </span>
</template>
