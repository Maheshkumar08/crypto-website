<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { gsap } from '../../composables/gsapSetup'

const props = defineProps({
  headings: { type: Array, default: () => [] },
})

const activeId = ref('')
const rootEl = ref(null)
let observer

function observe() {
  observer?.disconnect()
  if (!props.headings.length) return

  observer = new IntersectionObserver(
    (entries) => {
      const visible = entries.filter((e) => e.isIntersecting)
      if (visible.length) activeId.value = visible[0].target.id
    },
    { rootMargin: '-110px 0px -70% 0px' }
  )

  props.headings.forEach((h) => {
    const el = document.getElementById(h.id)
    if (el) observer.observe(el)
  })
}

onMounted(async () => {
  await nextTick()
  observe()
  if (rootEl.value) {
    gsap.fromTo(
      rootEl.value,
      { opacity: 0, x: -18 },
      { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out', delay: 0.2 }
    )
  }
})

watch(
  () => props.headings,
  async () => {
    await nextTick()
    observe()
  }
)

onBeforeUnmount(() => observer?.disconnect())

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' })
}
</script>

<template>
  <nav v-if="headings.length" ref="rootEl" class="rounded-2xl border border-slate-200/70 bg-white/70 p-5 backdrop-blur-xl">
    <p class="text-[11px] font-semibold uppercase tracking-[0.22em] text-gray-400">On this page</p>
    <div class="relative mt-4 space-y-0.5 border-l border-slate-200 pl-4">
      <button
        v-for="h in headings"
        :key="h.id"
        type="button"
        class="relative block w-full truncate py-1.5 text-left text-sm transition-colors duration-300"
        :class="[
          h.level === 3 ? 'pl-4 text-[13px]' : '',
          activeId === h.id ? 'font-semibold text-blue-600' : 'text-gray-500 hover:text-gray-900',
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
