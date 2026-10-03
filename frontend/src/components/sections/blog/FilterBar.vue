<script setup>
defineProps({
  difficulties: { type: Array, default: () => [] }, // dynamic, includes 'all'; empty/['all'] hides the control
  difficulty: { type: String, default: 'all' },
  readingTimeBucket: { type: String, default: 'all' },
  sortBy: { type: String, default: 'newest' },
})

defineEmits(['update:difficulty', 'update:readingTimeBucket', 'update:sortBy'])

const READING_TIME_OPTIONS = [
  { value: 'all', label: 'Any length' },
  { value: 'under5', label: 'Under 5 min' },
  { value: '5to10', label: '5–10 min' },
  { value: 'over10', label: '10+ min' },
]

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'popular', label: 'Popular' },
  { value: 'trending', label: 'Trending' },
]

const selectClass =
  'h-11 cursor-pointer appearance-none rounded-2xl border border-[#E8EEF5] bg-white pl-4 pr-9 text-sm font-medium text-gray-700 outline-none transition-colors duration-300 hover:border-slate-300 focus:border-blue-400 focus:ring-4 focus:ring-blue-100'
</script>

<template>
  <div class="flex flex-wrap items-center gap-3">
    <div v-if="difficulties.length > 1" class="relative">
      <select
        :value="difficulty"
        aria-label="Filter by difficulty"
        :class="selectClass"
        @change="$emit('update:difficulty', $event.target.value)"
      >
        <option v-for="d in difficulties" :key="d" :value="d">{{ d === 'all' ? 'Any difficulty' : d }}</option>
      </select>
      <span class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">⌄</span>
    </div>

    <div class="relative">
      <select
        :value="readingTimeBucket"
        aria-label="Filter by reading time"
        :class="selectClass"
        @change="$emit('update:readingTimeBucket', $event.target.value)"
      >
        <option v-for="opt in READING_TIME_OPTIONS" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
      </select>
      <span class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">⌄</span>
    </div>

    <div class="relative">
      <select
        :value="sortBy"
        aria-label="Sort articles"
        :class="selectClass"
        @change="$emit('update:sortBy', $event.target.value)"
      >
        <option v-for="opt in SORT_OPTIONS" :key="opt.value" :value="opt.value">Sort: {{ opt.label }}</option>
      </select>
      <span class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">⌄</span>
    </div>
  </div>
</template>
