<script setup>
import Avatar from "../ui/Avatar.vue";

defineProps({
  author: { type: String, required: true },
});
</script>

<template>
  <div
    class="hover-glow relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-soft"
  >
    <p class="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
      Written by
    </p>
    <div class="mt-4 flex items-center gap-4">
      <Avatar :name="author" size="lg" />
      <div>
        <p class="text-base font-semibold text-gray-900">{{ author }}</p>
        <p class="mt-0.5 text-xs text-gray-400">
          cryptolearner.us editorial team
        </p>
      </div>
    </div>
    <p class="mt-4 text-sm leading-relaxed text-gray-500">
      Plain-language writing on blockchain, wallets, and digital assets —
      reviewed for accuracy before publishing.
    </p>
  </div>
</template>
