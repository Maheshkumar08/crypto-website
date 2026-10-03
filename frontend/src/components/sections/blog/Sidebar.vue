<script setup>
import { computed, onMounted, ref } from 'vue'
import { gsap } from '../../../composables/gsapSetup'
import CategoryIcon from './CategoryIcon.vue'

const props = defineProps({
  categories: { type: Array, default: () => [] }, // distinct category names, dynamic — no 'all'
  posts: { type: Array, default: () => [] },
  modelValue: { type: String, default: 'all' }, // 'all' | 'featured' | <category name>
})

const emit = defineEmits(['update:modelValue'])

const listEl = ref(null)

const featuredCount = computed(() => props.posts.filter((p) => p.featured).length)

const categoryCounts = computed(() => {
  const counts = new Map()
  for (const p of props.posts) {
    if (!p.category) continue
    counts.set(p.category, (counts.get(p.category) || 0) + 1)
  }
  return counts
})

// "All" and "Featured" are structural entries; everything after them is
// whatever categories actually exist in the fetched posts right now.
const items = computed(() => [
  { key: 'all', label: 'All articles', icon: 'all', count: props.posts.length },
  { key: 'featured', label: 'Featured', icon: 'Featured', count: featuredCount.value },
  ...props.categories.map((name) => ({
    key: name,
    label: name,
    icon: name,
    count: categoryCounts.value.get(name) || 0,
  })),
])

function select(key) {
  emit('update:modelValue', key)
}

onMounted(() => {
  gsap.set(listEl.value?.children, { opacity: 0, x: -14 })
  gsap.to(listEl.value?.children, {
    opacity: 1,
    x: 0,
    duration: 0.6,
    ease: 'power3.out',
    stagger: 0.05,
    delay: 0.15,
  })
})
</script>

<template>
  <nav
    aria-label="Blog categories"
    class="rounded-[28px] border border-[#E8EEF5] bg-white/70 p-3 shadow-[0_1px_2px_rgba(15,23,42,0.04)] backdrop-blur-xl lg:sticky lg:top-24"
  >
    <ul ref="listEl" class="flex gap-1.5 overflow-x-auto [scrollbar-width:none] lg:block lg:space-y-1 lg:overflow-visible">
      <li v-for="item in items" :key="item.key" class="shrink-0 lg:shrink">
        <button
          type="button"
          class="group relative flex w-full items-center gap-3 whitespace-nowrap rounded-2xl px-3.5 py-2.5 text-left text-sm transition-colors duration-300"
          :class="modelValue === item.key ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-slate-50 hover:text-gray-900'"
          :aria-current="modelValue === item.key ? 'true' : undefined"
          @click="select(item.key)"
        >
          <span
            class="absolute left-0 top-1/2 hidden h-5 w-[3px] -translate-y-1/2 rounded-full bg-blue-600 transition-transform duration-300 lg:block"
            :class="modelValue === item.key ? 'scale-y-100' : 'scale-y-0'"
          />
          <span
            class="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-colors duration-300"
            :class="modelValue === item.key ? 'bg-white text-blue-600 shadow-sm' : 'bg-slate-50 text-gray-400 group-hover:text-gray-600'"
          >
            <CategoryIcon :name="item.icon" />
          </span>
          <span class="min-w-0 flex-1 truncate font-medium">{{ item.label }}</span>
          <span
            class="shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold tabular-nums transition-colors duration-300"
            :class="modelValue === item.key ? 'bg-blue-100 text-blue-700' : 'bg-slate-50 text-gray-400'"
          >
            {{ item.count }}
          </span>
        </button>
      </li>
    </ul>
  </nav>
</template>
