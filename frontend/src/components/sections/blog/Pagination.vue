<script setup>
const props = defineProps({
  modelValue: { type: Number, required: true },
  totalPages: { type: Number, required: true },
})

const emit = defineEmits(['update:modelValue'])

function go(page) {
  if (page < 1 || page > props.totalPages || page === props.modelValue) return
  emit('update:modelValue', page)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <nav v-if="totalPages > 1" aria-label="Pagination" class="flex items-center justify-center gap-2">
    <button
      type="button"
      aria-label="Previous page"
      class="flex h-11 w-11 items-center justify-center rounded-full border border-[#E8EEF5] bg-white text-gray-500 transition-colors duration-300 hover:border-slate-300 hover:text-gray-900 disabled:pointer-events-none disabled:opacity-40"
      :disabled="modelValue === 1"
      @click="go(modelValue - 1)"
    >
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" class="h-4 w-4"><path d="m12 5-5 5 5 5" /></svg>
    </button>

    <button
      v-for="page in totalPages"
      :key="page"
      type="button"
      :aria-current="page === modelValue ? 'page' : undefined"
      class="flex h-11 w-11 items-center justify-center rounded-full text-sm font-semibold transition-colors duration-300"
      :class="page === modelValue ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-slate-50'"
      @click="go(page)"
    >
      {{ page }}
    </button>

    <button
      type="button"
      aria-label="Next page"
      class="flex h-11 w-11 items-center justify-center rounded-full border border-[#E8EEF5] bg-white text-gray-500 transition-colors duration-300 hover:border-slate-300 hover:text-gray-900 disabled:pointer-events-none disabled:opacity-40"
      :disabled="modelValue === totalPages"
      @click="go(modelValue + 1)"
    >
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" class="h-4 w-4"><path d="m8 5 5 5-5 5" /></svg>
    </button>
  </nav>
</template>
