<script setup>
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { gsap } from '../../composables/gsapSetup'

const props = defineProps({
  items: { type: Array, default: () => [] }, // [{ id, slug, label, meta }]
})

const trackEl = ref(null)
let tween = null

function play() {
  tween?.kill()
  if (!trackEl.value) return
  const width = trackEl.value.scrollWidth / 2
  if (!width) return
  tween = gsap.to(trackEl.value, {
    x: -width,
    duration: Math.max(18, width / 40),
    ease: 'none',
    repeat: -1,
  })
}

watch(
  () => props.items,
  async () => {
    await nextTick()
    play()
  },
  { immediate: true }
)

onBeforeUnmount(() => tween?.kill())
</script>

<template>
  <div v-if="items.length" class="overflow-hidden rounded-2xl border border-[#E8EEF5] bg-white py-3">
    <div
      ref="trackEl"
      class="flex w-max items-center gap-10 whitespace-nowrap px-6"
      @mouseenter="tween?.pause()"
      @mouseleave="tween?.play()"
    >
      <template v-for="n in 2" :key="n">
        <router-link
          v-for="item in items"
          :key="`${n}-${item.id}`"
          :to="`/articles/${item.slug}`"
          data-cursor-hover
          class="flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-blue-600"
        >
          <span class="text-blue-600">↑</span>
          {{ item.label }}
          <span class="text-gray-400">· {{ item.meta }}</span>
        </router-link>
      </template>
    </div>
  </div>
</template>
