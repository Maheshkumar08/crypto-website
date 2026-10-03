<script setup>
import { ref } from 'vue'
import { subscribeNewsletter } from '../../services/newsletter'
import MagneticButton from '../ui/MagneticButton.vue'

const props = defineProps({
  source: { type: String, default: 'blog' },
  compact: { type: Boolean, default: false },
})

const email = ref('')
const status = ref('idle') // idle | submitting | success | error

async function onSubmit() {
  if (!email.value.trim()) return
  status.value = 'submitting'
  try {
    await subscribeNewsletter(email.value.trim(), { source: props.source })
    status.value = 'success'
    email.value = ''
  } catch (err) {
    status.value = 'error'
  }
}
</script>

<template>
  <div
    class="relative overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-gray-900 p-8 shadow-lift"
    :class="compact ? 'sm:p-6' : 'sm:p-10'"
  >
    <div class="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-blue-500/25 blur-[90px]" />
    <div class="pointer-events-none absolute -bottom-16 -left-10 h-48 w-48 rounded-full bg-cyan-400/20 blur-[80px]" />
    <div class="relative">
      <span class="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-cyan-300">
        Newsletter
      </span>
      <h3 class="mt-4 font-display text-xl font-bold tracking-tight text-white" :class="compact && 'text-lg'">
        Get new lessons in your inbox
      </h3>
      <p class="mt-2 text-sm text-white/60">One short, plain-language email whenever we publish something new. No spam.</p>

      <form v-if="status !== 'success'" class="mt-5 flex flex-col gap-3 sm:flex-row" @submit.prevent="onSubmit">
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
      <p v-else class="mt-5 text-sm font-medium text-cyan-300">You're in. Look out for the next issue.</p>
      <p v-if="status === 'error'" class="mt-2 text-xs text-red-400">Something went wrong — please try again.</p>
    </div>
  </div>
</template>
