<script setup>
import { ref } from 'vue'

defineProps({
  modelValue: { type: String, required: true },
  placeholder: { type: String, default: 'Search…' },
})
defineEmits(['update:modelValue'])

const focused = ref(false)
</script>

<template>
  <div class="group relative">
    <div
      class="pointer-events-none absolute -inset-0.5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 opacity-0 blur transition-opacity duration-500"
      :class="focused && 'opacity-30'"
    />
    <div class="relative">
      <svg
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        stroke-width="1.6"
        class="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors duration-300"
        :class="focused ? 'text-blue-600' : 'text-gray-400'"
      >
        <circle cx="9" cy="9" r="6" />
        <path d="m17 17-4-4" />
      </svg>
      <input
        :value="modelValue"
        type="search"
        :placeholder="placeholder"
        class="w-full rounded-full border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition-all duration-300 focus:border-blue-400"
        @focus="focused = true"
        @blur="focused = false"
        @input="$emit('update:modelValue', $event.target.value)"
      />
    </div>
  </div>
</template>
