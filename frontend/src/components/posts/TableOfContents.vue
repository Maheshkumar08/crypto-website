<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps({
  headings: { type: Array, required: true },
})

const activeId = ref('')
let observer

onMounted(() => {
  if (!props.headings.length) return

  observer = new IntersectionObserver(
    (entries) => {
      const visible = entries.filter((e) => e.isIntersecting)
      if (visible.length) activeId.value = visible[0].target.id
    },
    { rootMargin: '-100px 0px -70% 0px' }
  )

  props.headings.forEach((h) => {
    const el = document.getElementById(h.id)
    if (el) observer.observe(el)
  })
})

onBeforeUnmount(() => observer?.disconnect())

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' })
}
</script>

<template>
  <nav v-if="headings.length" class="relative border-l border-slate-200 pl-4 text-sm">
    <p class="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">On this page</p>
    <div class="space-y-0.5">
      <button
        v-for="h in headings"
        :key="h.id"
        type="button"
        class="relative block w-full truncate py-1.5 text-left transition-all duration-300"
        :class="[
          h.level === 3 ? 'pl-4 text-[13px]' : '',
          activeId === h.id ? 'font-semibold text-blue-600' : 'text-gray-500 hover:text-gray-800',
        ]"
        @click="scrollTo(h.id)"
      >
        <span
          v-if="activeId === h.id"
          class="absolute -left-[1.1rem] top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-blue-600"
        />
        {{ h.text }}
      </button>
    </div>
  </nav>
</template>
