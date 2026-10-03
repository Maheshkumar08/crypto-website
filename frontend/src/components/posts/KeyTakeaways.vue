<script setup>
defineProps({
  items: { type: Array, default: () => [] },
})
</script>

<template>
  <div v-if="items.length" class="gradient-border relative overflow-hidden rounded-2xl border border-cyan-100 bg-gradient-to-br from-cyan-50 to-white p-6 shadow-soft sm:p-7">
    <p class="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">Key takeaways</p>
    <ul class="mt-3 space-y-2.5">
      <li v-for="(item, i) in items" :key="i" class="flex items-start gap-2.5 text-sm leading-relaxed text-gray-700">
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" class="mt-0.5 h-4 w-4 shrink-0 text-cyan-600">
          <path d="M4 10.5 8 14l8-8" />
        </svg>
        {{ item }}
      </li>
    </ul>
  </div>
</template>
