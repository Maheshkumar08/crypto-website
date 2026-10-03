<script setup>
const props = defineProps({
  as: { type: String, default: 'span' },
  color: { type: String, default: 'blue' }, // 'blue' | 'cyan' | 'slate' | 'white'
  variant: { type: String, default: 'soft' }, // 'soft' | 'solid' | 'outline'
})

const palettes = {
  blue: {
    soft: 'bg-blue-50 text-blue-700',
    solid: 'bg-blue-600 text-white',
    outline: 'border border-blue-200 text-blue-700',
  },
  cyan: {
    soft: 'bg-cyan-50 text-cyan-700',
    solid: 'bg-cyan-500 text-white',
    outline: 'border border-cyan-200 text-cyan-700',
  },
  slate: {
    soft: 'bg-slate-100 text-gray-600',
    solid: 'bg-gray-900 text-white',
    outline: 'border border-slate-200 text-gray-600',
  },
  white: {
    soft: 'bg-white/95 text-blue-700 shadow-soft backdrop-blur',
    solid: 'bg-white text-gray-900 shadow-soft',
    outline: 'border border-white/60 text-white backdrop-blur',
  },
}
</script>

<template>
  <component
    :is="as"
    class="inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold tracking-wide"
    :class="palettes[color][variant]"
  >
    <slot />
  </component>
</template>
