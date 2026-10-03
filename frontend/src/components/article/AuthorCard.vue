<script setup>
import AuthorAvatar from "../sections/blog/AuthorAvatar.vue";

defineProps({
  author: { type: String, required: true },
});
</script>

<template>
  <div class="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-soft">
    <p
      class="text-[11px] font-semibold uppercase tracking-[0.22em] text-gray-400"
    >
      Written by
    </p>
    <div class="mt-4 flex items-center gap-4">
      <AuthorAvatar :name="author || 'cryptolearner.us Team'" size="lg" />
      <div class="min-w-0">
        <p class="truncate text-base font-semibold text-gray-900">
          {{ author || "cryptolearner.us Team" }}
        </p>
        <p class="mt-0.5 text-xs text-gray-400">Editorial team</p>
      </div>
    </div>
    <p class="mt-4 text-sm leading-relaxed text-gray-500">
      Plain-language writing on blockchain, wallets, and digital assets —
      reviewed for accuracy before publishing.
    </p>
  </div>
</template>
