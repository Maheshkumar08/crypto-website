<script setup>
defineProps({
  categories: { type: Array, required: true },
  modelValue: { type: String, required: true },
})
defineEmits(['update:modelValue'])
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <button
      v-for="c in categories"
      :key="c"
      type="button"
      data-cursor-hover
      class="rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300"
      :class="
        modelValue === c
          ? 'border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-600/20'
          : 'border-slate-200 bg-white text-gray-600 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-soft'
      "
      @click="$emit('update:modelValue', c)"
    >
      {{ c === 'all' ? 'All' : c }}
    </button>
  </div>
</template>
