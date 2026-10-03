<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { gsap, SplitText } from '../../composables/gsapSetup'

defineProps({
  eyebrow: { type: String, default: '' },
  heading: { type: String, required: true },
  subtitle: { type: String, default: '' },
  count: { type: Number, default: 0 },
})

const eyebrowEl = ref(null)
const headingEl = ref(null)
const subtitleEl = ref(null)
const ruleEl = ref(null)
const metaEl = ref(null)

let headingSplit

onMounted(async () => {
  gsap.set(eyebrowEl.value, { opacity: 0 })
  gsap.set(subtitleEl.value, { opacity: 0, y: 12 })
  gsap.set(metaEl.value, { opacity: 0 })
  gsap.set(ruleEl.value, { scaleX: 0 })

  if (document.fonts?.ready) {
    await document.fonts.ready
  }

  headingSplit = new SplitText(headingEl.value, { type: 'lines', linesClass: 'split-line overflow-hidden' })
  gsap.set(headingSplit.lines, { yPercent: 110, opacity: 0 })

  const tl = gsap.timeline({ delay: 0.1 })
  tl.to(eyebrowEl.value, { opacity: 1, duration: 0.6 })
    .to(ruleEl.value, { scaleX: 1, duration: 0.8, ease: 'power3.inOut' }, '-=0.3')
    .to(headingSplit.lines, { yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.1, ease: 'power4.out' }, '-=0.5')
    .to(subtitleEl.value, { opacity: 1, y: 0, duration: 0.7 }, '-=0.4')
    .to(metaEl.value, { opacity: 1, duration: 0.6 }, '-=0.3')
})

onBeforeUnmount(() => headingSplit?.revert())
</script>

<template>
  <section class="relative overflow-hidden border-b border-slate-200 bg-slate-50 px-6 pb-16 pt-40 lg:px-10 lg:pb-20 lg:pt-48">
    <div
      class="pointer-events-none absolute inset-0 opacity-[0.4] [background-image:linear-gradient(90deg,rgba(15,23,42,0.04)_1px,transparent_1px)] [background-size:64px_100%]"
    />

    <div class="relative mx-auto max-w-5xl">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <p v-if="eyebrow" ref="eyebrowEl" class="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-700">
          {{ eyebrow }}
        </p>
        <p ref="metaEl" class="font-mono text-xs text-gray-400">
          Vol. {{ new Date().getFullYear() }} · {{ count ? `${count} in-depth reports` : 'Reference reading' }}
        </p>
      </div>
      <div ref="ruleEl" class="mt-5 h-px w-full origin-left bg-slate-300" />

      <h1
        ref="headingEl"
        class="mt-8 max-w-3xl font-display text-5xl font-bold leading-[1.05] tracking-tight text-gray-900 sm:text-6xl lg:text-7xl"
      >
        {{ heading }}
      </h1>

      <p v-if="subtitle" ref="subtitleEl" class="mt-6 max-w-xl text-lg leading-relaxed text-gray-500">
        {{ subtitle }}
      </p>
    </div>
  </section>
</template>
