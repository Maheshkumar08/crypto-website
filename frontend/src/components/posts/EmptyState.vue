<script setup>
defineProps({
  title: { type: String, default: 'Nothing here yet.' },
  message: { type: String, default: '' },
})

defineEmits(['clear'])
</script>

<template>
  <div class="mx-auto flex max-w-md flex-col items-center rounded-2xl border border-dashed border-slate-200 py-20 text-center">
    <div class="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" class="h-6 w-6">
        <circle cx="10" cy="10" r="6.5" />
        <path d="m19 19-4.3-4.3" />
      </svg>
    </div>
    <p class="mt-5 text-base font-semibold text-gray-900">{{ title }}</p>
    <p v-if="message" class="mt-2 text-sm text-gray-500">{{ message }}</p>
    <button
      v-if="$slots.action"
      class="mt-6 text-sm font-medium text-blue-600 hover:text-blue-700"
      @click="$emit('clear')"
    >
      <slot name="action" />
    </button>
  </div>
</template>
