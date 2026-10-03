<script setup>
import { onMounted, ref } from 'vue'
import { gsap } from '../../../composables/gsapSetup'
import { revealHeading, revealUp } from '../../../composables/useReveal'
import { aboutTimeline } from '../../../data/content'

const sectionEl = ref(null)
const headingEl = ref(null)
const listEl = ref(null)
const lineEl = ref(null)

onMounted(() => {
  revealHeading(headingEl.value, { type: 'words', trigger: sectionEl.value, stagger: 0.03 })
  revealUp(listEl.value.children, { trigger: listEl.value, start: 'top 80%', y: 40, stagger: 0.15 })

  gsap.fromTo(
    lineEl.value,
    { scaleY: 0 },
    {
      scaleY: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: listEl.value,
        start: 'top 60%',
        end: 'bottom 60%',
        scrub: 0.5,
      },
    }
  )
})
</script>

<template>
  <section ref="sectionEl" class="relative bg-slate-50 px-6 py-16 lg:px-10 lg:py-20">
    <div class="mx-auto max-w-2xl text-center">
      <p class="mb-4 text-sm font-semibold text-cyan-600">How we got here</p>
      <h2 ref="headingEl" class="font-display text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl">
        A short history, mostly true.
      </h2>
    </div>

    <div class="relative mx-auto mt-16 max-w-3xl">
      <div class="absolute left-6 top-0 h-full w-px bg-slate-200 sm:left-8">
        <div ref="lineEl" class="h-full w-full origin-top scale-y-0 bg-gradient-to-b from-blue-600 to-cyan-500" />
      </div>

      <div ref="listEl" class="space-y-14">
        <div v-for="item in aboutTimeline" :key="item.year" class="relative flex gap-8 pl-16 sm:pl-20">
          <span
            class="absolute left-0 flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white font-mono text-xs text-blue-600 shadow-soft sm:h-16 sm:w-16"
          >
            {{ item.year }}
          </span>
          <div class="pt-1">
            <h3 class="font-display text-xl font-semibold text-gray-900">{{ item.title }}</h3>
            <p class="mt-3 max-w-lg text-sm leading-relaxed text-gray-500">{{ item.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
