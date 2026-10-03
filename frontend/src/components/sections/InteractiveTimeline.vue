<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { gsap, ScrollTrigger } from '../../composables/gsapSetup'
import { revealHeading } from '../../composables/useReveal'
import { timeline } from '../../data/content'

const sectionEl = ref(null)
const headingEl = ref(null)
const trackEl = ref(null)
const activeIndex = ref(0)

let mm

onMounted(() => {
  revealHeading(headingEl.value, { type: 'words', trigger: sectionEl.value, stagger: 0.03 })

  // Pinned horizontal scroll only makes sense once there's room to pin —
  // on narrow screens the timeline falls back to a native snap-scroll rail.
  mm = ScrollTrigger.matchMedia({
    '(min-width: 1024px)': () => {
      const maxScroll = () => trackEl.value.scrollWidth - trackEl.value.parentElement.clientWidth

      const st = ScrollTrigger.create({
        trigger: sectionEl.value,
        start: 'top top',
        end: () => `+=${maxScroll()}`,
        pin: true,
        scrub: 0.6,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          gsap.set(trackEl.value, { x: -self.progress * maxScroll() })
          activeIndex.value = Math.round(self.progress * (timeline.length - 1))
        },
      })

      return () => st.kill()
    },
  })
})

onBeforeUnmount(() => mm?.kill())
</script>

<template>
  <section ref="sectionEl" class="relative bg-slate-50 py-16 lg:py-0">
    <div class="mx-auto max-w-2xl px-6 text-center lg:pt-32">
      <p class="mb-4 text-sm font-semibold text-cyan-600">Five weeks, start to finish</p>
      <h2 ref="headingEl" class="font-display text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl">
        A curriculum you can actually see.
      </h2>
    </div>

    <div class="mt-6 flex justify-center gap-2 lg:mt-10">
      <span
        v-for="(item, i) in timeline"
        :key="item.year"
        class="h-1.5 rounded-full transition-all duration-300"
        :class="i === activeIndex ? 'w-8 bg-blue-600' : 'w-1.5 bg-slate-300'"
      />
    </div>

    <div class="mt-10 overflow-hidden px-6 lg:mt-14 lg:px-10">
      <div
        ref="trackEl"
        class="snap-rail flex gap-6 pb-6 lg:pb-0 lg:will-change-transform"
      >
        <div
          v-for="item in timeline"
          :key="item.year"
          class="w-[80vw] shrink-0 rounded-2xl border border-slate-200/80 bg-white p-8 shadow-soft sm:w-[380px]"
        >
          <span class="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 font-mono text-xs text-blue-600">
            {{ item.year }}
          </span>
          <h3 class="mt-6 font-display text-xl font-semibold text-gray-900">{{ item.title }}</h3>
          <p class="mt-3 text-sm leading-relaxed text-gray-500">{{ item.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
