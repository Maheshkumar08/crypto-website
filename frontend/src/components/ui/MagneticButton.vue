<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { attachMagnetic } from '../../composables/useMagnetic'

const props = defineProps({
  as: { type: String, default: 'button' },
  variant: { type: String, default: 'solid' }, // 'solid' | 'ghost'
})

const rootEl = ref(null)
let cleanup = () => {}

onMounted(() => {
  // `as` may be a component (e.g. router-link) rather than a plain tag, in
  // which case the template ref resolves to the component instance — its
  // rendered DOM node lives at `.$el`.
  const el = rootEl.value?.$el ?? rootEl.value
  cleanup = attachMagnetic(el, { strength: 0.35, innerStrength: 0.55 })
})

onBeforeUnmount(() => cleanup())
</script>

<template>
  <component
    :is="as"
    ref="rootEl"
    class="magnetic-btn group relative inline-flex items-center justify-center overflow-hidden rounded-full px-8 py-4 text-sm font-medium tracking-wide transition-all duration-300"
    :class="
      variant === 'solid'
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/25'
        : 'border border-gray-200 text-gray-900 hover:border-gray-300 hover:bg-gray-50'
    "
  >
    <span data-magnetic-inner class="relative z-10 flex items-center gap-2">
      <slot />
    </span>
  </component>
</template>
