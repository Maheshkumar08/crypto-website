<script setup>
import { onMounted, ref } from 'vue'
import { revealHeading, revealUp } from '../../composables/useReveal'
import { ctaBanner as defaultCtaBanner } from '../../data/content'
import MagneticButton from '../ui/MagneticButton.vue'

const props = defineProps({ data: { type: Object, default: () => defaultCtaBanner } })

const sectionEl = ref(null)
const headingEl = ref(null)
const subEl = ref(null)
const ctaEl = ref(null)

onMounted(() => {
  revealHeading(headingEl.value, { type: 'words', trigger: sectionEl.value, stagger: 0.025 })
  revealUp(subEl.value, { trigger: sectionEl.value, y: 20 })
  revealUp(ctaEl.value, { trigger: sectionEl.value, y: 20, delay: 0.1 })
})
</script>

<template>
  <section ref="sectionEl" class="relative mx-auto max-w-6xl px-6 py-16 lg:px-10">
    <div class="relative overflow-hidden rounded-[2.5rem] border border-slate-200/80 bg-white px-8 py-20 text-center shadow-lift sm:px-16">
      <div class="pointer-events-none absolute inset-0 animated-gradient opacity-70" />

      <div class="relative z-10 mx-auto max-w-2xl">
        <h2 ref="headingEl" class="font-display text-4xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl">
          {{ data.heading }}
        </h2>
        <p ref="subEl" class="mx-auto mt-6 max-w-md text-base text-gray-500">{{ data.subtitle }}</p>
        <div ref="ctaEl" class="mt-10 flex justify-center">
          <MagneticButton data-cursor-hover>{{ data.cta }}</MagneticButton>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.animated-gradient {
  background: radial-gradient(60% 80% at 20% 20%, rgba(37, 99, 235, 0.08), transparent 60%),
    radial-gradient(50% 70% at 85% 80%, rgba(6, 182, 212, 0.08), transparent 60%);
  animation: drift 12s ease-in-out infinite alternate;
}

@keyframes drift {
  from {
    transform: translate(-4%, -2%) scale(1);
  }
  to {
    transform: translate(4%, 3%) scale(1.08);
  }
}
</style>
