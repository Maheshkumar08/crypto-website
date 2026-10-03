<script setup>
defineProps({
  modelValue: { type: String, default: "newest" },
});

defineEmits(["update:modelValue"]);

const OPTIONS = [
  { value: "trending", label: "Trending" },
  { value: "newest", label: "Latest" },
  { value: "popular", label: "Popular" },
];
</script>

<template>
  <div class="flex items-center gap-2">
    <button
      v-for="opt in OPTIONS"
      :key="opt.value"
      type="button"
      data-cursor-hover
      class="rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300"
      :class="
        modelValue === opt.value
          ? 'bg-gray-900 text-white shadow-soft'
          : 'border border-[#E8EEF5] bg-white text-gray-600 hover:border-slate-300 hover:text-gray-900'
      "
      @click="$emit('update:modelValue', opt.value)"
    >
      {{ opt.label }}
    </button>
  </div>
</template>
