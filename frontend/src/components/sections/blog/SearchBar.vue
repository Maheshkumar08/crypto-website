<script setup>
import { ref } from 'vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: 'Search articles…' },
})

const emit = defineEmits(['update:modelValue'])

const focused = ref(false)
const inputEl = ref(null)

function clear() {
  emit('update:modelValue', '')
  inputEl.value?.focus()
}
</script>

<template>
  <div
    class="flex h-12 items-center gap-2.5 rounded-2xl border bg-white px-4 transition-all duration-300"
    :class="focused ? 'border-blue-400 shadow-[0_0_0_4px_rgba(37,99,235,0.08)]' : 'border-[#E8EEF5]'"
  >
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" class="h-4 w-4 shrink-0 text-gray-400">
      <circle cx="9" cy="9" r="6.5" />
      <path d="m18 18-4.3-4.3" />
    </svg>

    <input
      ref="inputEl"
      :value="modelValue"
      type="search"
      role="searchbox"
      aria-label="Search articles"
      :placeholder="placeholder"
      class="w-full min-w-0 border-none bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
      @input="emit('update:modelValue', $event.target.value)"
      @focus="focused = true"
      @blur="focused = false"
    />

    <button
      v-if="modelValue"
      type="button"
      aria-label="Clear search"
      class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-slate-100 hover:text-gray-600"
      @click="clear"
    >
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" class="h-3 w-3">
        <path d="m5 5 10 10M15 5 5 15" />
      </svg>
    </button>
  </div>
</template>
