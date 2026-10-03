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
  <div v-if="totalPages > 1" class="flex items-center justify-center gap-2">
    <button
      class="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-gray-500 transition-colors hover:border-slate-300 disabled:opacity-40"
      :disabled="modelValue === 1"
      @click="go(modelValue - 1)"
    >
      ‹
    </button>

    <button
      v-for="page in totalPages"
      :key="page"
      class="flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium transition-colors"
      :class="page === modelValue ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-slate-100'"
      @click="go(page)"
    >
      {{ page }}
    </button>

    <button
      class="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-gray-500 transition-colors hover:border-slate-300 disabled:opacity-40"
      :disabled="modelValue === totalPages"
      @click="go(modelValue + 1)"
    >
      ›
    </button>
  </div>
</template>
