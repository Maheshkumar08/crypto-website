<script setup>
import { onMounted, ref } from 'vue'
import { revealHeading, revealUp } from '../../composables/useReveal'
import { pricing } from '../../data/content'
import Badge from '../ui/Badge.vue'
import MagneticButton from '../ui/MagneticButton.vue'

const sectionEl = ref(null)
const headingEl = ref(null)
const gridEl = ref(null)

onMounted(() => {
  revealHeading(headingEl.value, { type: 'words', trigger: sectionEl.value, stagger: 0.03 })
  revealUp(gridEl.value.children, { trigger: gridEl.value, start: 'top 85%', y: 50, stagger: 0.1 })
})
</script>

<template>
  <section id="pricing" ref="sectionEl" class="relative mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-20">
    <div class="mx-auto max-w-2xl text-center">
      <p class="mb-4 text-sm font-semibold text-cyan-600">Simple pricing</p>
      <h2 ref="headingEl" class="font-display text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl">
        Start free. Upgrade when it's worth it.
      </h2>
    </div>

    <div ref="gridEl" class="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-6 lg:grid-cols-3">
      <div
        v-for="plan in pricing"
        :key="plan.name"
        class="relative flex flex-col rounded-[1.75rem] border p-8"
        :class="
          plan.featured
            ? 'border-blue-600 bg-gray-900 text-white shadow-glow lg:-translate-y-3'
            : 'border-slate-200/80 bg-white shadow-soft'
        "
      >
        <Badge v-if="plan.featured" color="blue" class="absolute -top-3 left-8">Most popular</Badge>

        <h3 class="font-display text-lg font-semibold" :class="plan.featured ? 'text-white' : 'text-gray-900'">
          {{ plan.name }}
        </h3>
        <p class="mt-2 text-sm leading-relaxed" :class="plan.featured ? 'text-gray-400' : 'text-gray-500'">
          {{ plan.description }}
        </p>

        <div class="mt-6 flex items-baseline gap-1">
          <span class="font-display text-4xl font-bold" :class="plan.featured ? 'text-white' : 'text-gray-900'">
            ${{ plan.price }}
          </span>
          <span class="text-sm" :class="plan.featured ? 'text-gray-400' : 'text-gray-500'">/ {{ plan.period }}</span>
        </div>

        <ul class="mt-8 space-y-3">
          <li
            v-for="feat in plan.features"
            :key="feat"
            class="flex items-start gap-2.5 text-sm"
            :class="plan.featured ? 'text-gray-300' : 'text-gray-600'"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="mt-0.5 h-4 w-4 shrink-0" :class="plan.featured ? 'text-cyan-400' : 'text-blue-600'">
              <path d="M20 6 9 17l-5-5" />
            </svg>
            {{ feat }}
          </li>
        </ul>

        <div class="mt-10">
          <MagneticButton
            :variant="plan.featured ? 'solid' : 'ghost'"
            data-cursor-hover
            class="w-full"
            :class="!plan.featured && 'text-gray-900'"
          >
            {{ plan.cta }}
          </MagneticButton>
        </div>
      </div>
    </div>
  </section>
</template>
