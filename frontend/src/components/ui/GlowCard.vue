<script setup>
import { ref } from 'vue'

const props = defineProps({
  as: { type: String, default: 'div' },
})

const cardEl = ref(null)
const glowX = ref('50%')
const glowY = ref('50%')

function onMove(e) {
  const rect = cardEl.value.getBoundingClientRect()
  glowX.value = `${((e.clientX - rect.left) / rect.width) * 100}%`
  glowY.value = `${((e.clientY - rect.top) / rect.height) * 100}%`
}
</script>

<template>
  <component
    :is="as"
    ref="cardEl"
    class="glow-card relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-soft transition-shadow duration-300 hover:shadow-card"
    @pointermove="onMove"
    :style="{ '--glow-x': glowX, '--glow-y': glowY }"
  >
    <div class="glow-card__sheen pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500" />
    <div class="relative z-10 h-full">
      <slot />
    </div>
  </component>
</template>

<style scoped>
.glow-card__sheen {
  background: radial-gradient(320px circle at var(--glow-x) var(--glow-y), rgba(37, 99, 235, 0.06), transparent 65%);
}
.glow-card:hover .glow-card__sheen {
  opacity: 1;
}
</style>
