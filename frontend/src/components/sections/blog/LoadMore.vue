<script setup>
defineProps({
  loading: { type: Boolean, default: false },
})

defineEmits(['click'])
</script>

<template>
  <button
    type="button"
    class="group inline-flex items-center gap-2 rounded-full border border-[#E8EEF5] bg-white px-7 py-3.5 text-sm font-semibold text-gray-900 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-[0_12px_28px_-12px_rgba(37,99,235,0.25)] disabled:pointer-events-none disabled:opacity-50"
    :disabled="loading"
    @click="$emit('click')"
  >
    <svg v-if="loading" viewBox="0 0 20 20" fill="none" class="h-4 w-4 animate-spin text-blue-600">
      <circle cx="10" cy="10" r="7.5" stroke="currentColor" stroke-width="2" stroke-opacity="0.2" />
      <path d="M17.5 10a7.5 7.5 0 0 0-7.5-7.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
    </svg>
    <span>{{ loading ? 'Loading…' : 'Load more articles' }}</span>
    <svg
      v-if="!loading"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      stroke-width="1.8"
      class="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-y-0.5"
    >
      <path d="M5 8l5 5 5-5" />
    </svg>
  </button>
</template>
