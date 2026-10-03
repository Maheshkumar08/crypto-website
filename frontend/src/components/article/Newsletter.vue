<script setup>
import { onMounted, ref } from 'vue'
import { subscribeNewsletter } from '../../services/newsletter'
import { revealUp } from '../../composables/useReveal'
import MagneticButton from '../ui/MagneticButton.vue'

const props = defineProps({
  source: { type: String, default: 'blog' },
})

const email = ref('')
const status = ref('idle') // idle | submitting | success | error
const cardEl = ref(null)

onMounted(() => {
  if (cardEl.value) revealUp(cardEl.value, { trigger: cardEl.value, y: 36 })
})

async function onSubmit() {
  if (!email.value.trim()) return
  status.value = 'submitting'
  try {
    await subscribeNewsletter(email.value.trim(), { source: props.source })
    status.value = 'success'
    email.value = ''
  } catch {
    status.value = 'error'
  }
}
</script>

<template>
  <section class="px-6 py-20 lg:px-10">
    <div ref="cardEl" class="relative mx-auto max-w-3xl overflow-hidden rounded-[2rem] bg-gray-900 p-10 sm:p-14">
      <div class="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-blue-600/25 blur-[90px]" />
      <div class="pointer-events-none absolute -bottom-16 -left-10 h-48 w-48 rounded-full bg-cyan-500/15 blur-[80px]" />

      <div class="relative text-center">
        <span class="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-cyan-300">
          Newsletter
        </span>
        <h3 class="mx-auto mt-4 max-w-md font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Get new lessons in your inbox
        </h3>
        <p class="mx-auto mt-2 max-w-sm text-sm text-white/60">
          One short, plain-language email whenever we publish something new. No spam.
        </p>

        <form v-if="status !== 'success'" class="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row" @submit.prevent="onSubmit">
          <input
            v-model="email"
            type="email"
            required
            placeholder="you@email.com"
            class="w-full flex-1 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none transition-colors focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
          />
          <MagneticButton as="button" type="submit" class="shrink-0 whitespace-nowrap !px-6 !py-3 text-sm">
            {{ status === 'submitting' ? 'Subscribing…' : 'Subscribe' }}
          </MagneticButton>
        </form>
        <p v-else class="mt-6 text-sm font-medium text-cyan-300">You're in. Look out for the next issue.</p>
        <p v-if="status === 'error'" class="mt-2 text-xs text-red-400">Something went wrong — please try again.</p>
      </div>
    </div>
  </section>
</template>
