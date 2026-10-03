<script setup>
defineProps({
  tags: { type: Array, required: true },
  modelValue: { type: String, required: true },
})
defineEmits(['update:modelValue'])
</script>

<template>
  <div v-if="tags.length" class="flex flex-wrap items-center gap-2">
    <span class="text-xs font-medium uppercase tracking-wide text-gray-400">Tags</span>
    <button
      type="button"
      data-cursor-hover
      class="rounded-full px-3 py-1.5 text-xs font-medium transition-colors"
      :class="modelValue === 'all' ? 'bg-cyan-500 text-white' : 'bg-slate-100 text-gray-500 hover:bg-slate-200'"
      @click="$emit('update:modelValue', 'all')"
    >
      All
    </button>
    <button
      v-for="t in tags"
      :key="t"
      type="button"
      data-cursor-hover
      class="rounded-full px-3 py-1.5 text-xs font-medium transition-colors"
      :class="modelValue === t ? 'bg-cyan-500 text-white' : 'bg-slate-100 text-gray-500 hover:bg-slate-200'"
      @click="$emit('update:modelValue', t)"
    >
      #{{ t }}
    </button>
  </div>
</template>
