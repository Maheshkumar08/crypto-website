<script setup>
defineProps({
  label: { type: String, required: true },
  value: { type: [String, Number], required: true },
  icon: { type: String, default: 'grid' },
})
</script>

<template>
  <div class="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-soft">
    <div class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" class="h-5 w-5">
        <path v-if="icon === 'book'" d="M4 5.5C4 4.67 4.67 4 5.5 4H12v16H5.5A1.5 1.5 0 0 1 4 18.5v-13Z" />
        <path v-if="icon === 'book'" d="M20 5.5C20 4.67 19.33 4 18.5 4H12v16h6.5a1.5 1.5 0 0 0 1.5-1.5v-13Z" />
        <path v-if="icon === 'file'" d="M6 3.5h8l4 4v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-16a1 1 0 0 1 1-1Z" />
        <path v-if="icon === 'file'" d="M8 12h8M8 16h8M8 8h4" />
        <path v-if="icon === 'eye'" d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
        <circle v-if="icon === 'eye'" cx="12" cy="12" r="2.6" />
        <path v-if="icon === 'draft'" d="M4 19.5 15 8.5l3 3-11 11H4v-3Z" />
        <path v-if="icon === 'draft'" d="M13 10.5l3-3 3 3-3 3" />
      </svg>
    </div>
    <p class="mt-4 text-2xl font-bold text-gray-900">{{ value }}</p>
    <p class="mt-1 text-sm text-gray-500">{{ label }}</p>
  </div>
</template>
