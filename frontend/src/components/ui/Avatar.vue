<script setup>
import { computed } from 'vue'

const props = defineProps({
  name: { type: String, required: true },
  size: { type: String, default: 'md' }, // 'sm' | 'md' | 'lg'
})

const sizes = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-12 w-12 text-sm',
  lg: 'h-16 w-16 text-lg',
}

const initials = computed(() =>
  props.name
    .split(' ')
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
)

// Deterministic gradient angle/hue offset from the name, so the same author
// always gets the same avatar color without needing a stored value.
const hue = computed(() => {
  let h = 0
  for (let i = 0; i < props.name.length; i++) h = (h * 31 + props.name.charCodeAt(i)) % 360
  return h
})
</script>

<template>
  <span
    class="flex shrink-0 items-center justify-center rounded-full font-mono font-semibold text-white shadow-soft"
    :class="sizes[size]"
    :style="{ background: `linear-gradient(135deg, hsl(${hue}, 72%, 52%), hsl(${(hue + 45) % 360}, 72%, 46%))` }"
  >
    {{ initials }}
  </span>
</template>
