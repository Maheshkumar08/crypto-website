<script setup>
import { slugify } from '../../composables/text'

defineProps({
  tags: { type: Array, default: () => [] },
})
</script>

<template>
  <div v-if="tags.length" class="flex flex-wrap justify-center gap-2">
    <router-link
      v-for="t in tags"
      :key="t"
      :to="`/tag/${slugify(String(t))}`"
      class="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-gray-500 transition-colors hover:bg-slate-200 hover:text-gray-700"
    >
      #{{ t }}
    </router-link>
  </div>
</template>
