<script setup>
defineProps({
  summary: { type: String, required: true },
})
</script>

<template>
  <div class="gradient-border relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-6 shadow-soft sm:p-7">
    <div class="flex items-start gap-3">
      <span class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white shadow-md shadow-blue-600/30">
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" class="h-3.5 w-3.5">
          <path d="M10 6v5l3 2" />
          <circle cx="10" cy="10" r="7.5" />
        </svg>
      </span>
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">TL;DR</p>
        <p class="mt-1.5 text-base leading-relaxed text-gray-700">{{ summary }}</p>
      </div>
    </div>
  </div>
</template>
