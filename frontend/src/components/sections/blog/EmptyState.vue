<script setup>
defineProps({
  title: { type: String, default: 'No articles found' },
  message: { type: String, default: 'Try a different search term or clear your filters.' },
})

defineEmits(['clear'])
</script>

<template>
  <div class="mx-auto flex max-w-md flex-col items-center rounded-[28px] border border-[#E8EEF5] bg-white py-20 text-center">
    <svg viewBox="0 0 120 120" class="h-28 w-28" aria-hidden="true">
      <circle cx="60" cy="60" r="46" fill="#F7F9FC" />
      <rect x="34" y="40" width="52" height="38" rx="8" fill="#fff" stroke="#E8EEF5" stroke-width="2" />
      <path d="M34 54h52" stroke="#E8EEF5" stroke-width="2" />
      <circle cx="44" cy="47" r="2" fill="#CBD5E1" />
      <circle cx="52" cy="47" r="2" fill="#CBD5E1" />
      <rect x="42" y="62" width="24" height="4" rx="2" fill="#E8EEF5" />
      <rect x="42" y="70" width="16" height="4" rx="2" fill="#E8EEF5" />
      <circle cx="80" cy="76" r="15" fill="#fff" stroke="#BFDBFE" stroke-width="2.5" />
      <path d="m90 86 7 7" stroke="#BFDBFE" stroke-width="2.5" stroke-linecap="round" />
      <path d="m75 76 4 4 6-7" stroke="#93C5FD" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none" />
    </svg>

    <p class="mt-6 text-base font-semibold text-gray-900">{{ title }}</p>
    <p v-if="message" class="mt-2 max-w-xs text-sm text-gray-500">{{ message }}</p>

    <button
      v-if="$slots.action"
      class="group mt-7 inline-flex items-center gap-1.5 rounded-full border border-[#E8EEF5] px-5 py-2.5 text-sm font-semibold text-gray-700 transition-all duration-300 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
      @click="$emit('clear')"
    >
      <slot name="action" />
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" class="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1">
        <path d="M4 10h12M11 5l5 5-5 5" />
      </svg>
    </button>
  </div>
</template>
