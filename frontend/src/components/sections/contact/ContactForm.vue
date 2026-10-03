<script setup>
import { onMounted, reactive, ref } from 'vue'
import { gsap } from '../../../composables/gsapSetup'
import { revealUp } from '../../../composables/useReveal'
import { submitContactMessage } from '../../../services/contact'
import MagneticButton from '../../ui/MagneticButton.vue'

const formEl = ref(null)
const cardEl = ref(null)
const successEl = ref(null)
const submitError = ref('')

const fields = reactive({ name: '', email: '', subject: '', message: '' })
const errors = reactive({ name: '', email: '', subject: '', message: '' })
const status = ref('idle') // idle | submitting | success

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate() {
  errors.name = fields.name.trim() ? '' : 'Tell us your name.'
  errors.email = emailPattern.test(fields.email) ? '' : 'Enter a valid email.'
  errors.subject = fields.subject.trim() ? '' : 'Add a short subject.'
  errors.message = fields.message.trim().length >= 10 ? '' : 'Message needs at least 10 characters.'
  return !errors.name && !errors.email && !errors.subject && !errors.message
}

function shakeInvalidFields() {
  const invalidEls = formEl.value.querySelectorAll('[data-invalid="true"]')
  gsap.fromTo(invalidEls, { x: -6 }, { x: 0, duration: 0.45, ease: 'elastic.out(1, 0.35)' })
}

async function onSubmit() {
  if (status.value === 'submitting') return

  if (!validate()) {
    await Promise.resolve()
    shakeInvalidFields()
    return
  }

  status.value = 'submitting'
  submitError.value = ''

  try {
    await submitContactMessage(fields)
    status.value = 'success'
    gsap.fromTo(successEl.value, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' })
  } catch (err) {
    status.value = 'idle'
    submitError.value = 'Something went wrong sending that — please try again.'
  }
}

function resetForm() {
  fields.name = ''
  fields.email = ''
  fields.subject = ''
  fields.message = ''
  status.value = 'idle'
}

onMounted(() => {
  revealUp(cardEl.value, { trigger: cardEl.value, start: 'top 85%', y: 30 })
})
</script>

<template>
  <div ref="cardEl" class="rounded-2xl border border-slate-200/80 bg-white p-8 shadow-soft sm:p-10">
    <template v-if="status !== 'success'">
      <h3 class="text-xl font-semibold text-gray-900">Send us a message</h3>
      <p class="mt-2 text-sm text-gray-500">We read every one of these ourselves.</p>

      <form ref="formEl" class="mt-8 space-y-5" novalidate @submit.prevent="onSubmit">
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label class="text-sm font-medium text-gray-700" for="contact-name">Name</label>
            <input
              id="contact-name"
              v-model="fields.name"
              type="text"
              :data-invalid="!!errors.name"
              class="mt-2 w-full rounded-xl border px-4 py-3 text-sm text-gray-900 outline-none transition-colors focus:ring-2"
              :class="errors.name ? 'border-red-300 focus:ring-red-100' : 'border-slate-200 focus:border-blue-400 focus:ring-blue-100'"
              placeholder="Jane Cooper"
            />
            <p v-if="errors.name" class="mt-1.5 text-xs text-red-500">{{ errors.name }}</p>
          </div>

          <div>
            <label class="text-sm font-medium text-gray-700" for="contact-email">Email</label>
            <input
              id="contact-email"
              v-model="fields.email"
              type="email"
              :data-invalid="!!errors.email"
              class="mt-2 w-full rounded-xl border px-4 py-3 text-sm text-gray-900 outline-none transition-colors focus:ring-2"
              :class="errors.email ? 'border-red-300 focus:ring-red-100' : 'border-slate-200 focus:border-blue-400 focus:ring-blue-100'"
              placeholder="jane@email.com"
            />
            <p v-if="errors.email" class="mt-1.5 text-xs text-red-500">{{ errors.email }}</p>
          </div>
        </div>

        <div>
          <label class="text-sm font-medium text-gray-700" for="contact-subject">Subject</label>
          <input
            id="contact-subject"
            v-model="fields.subject"
            type="text"
            :data-invalid="!!errors.subject"
            class="mt-2 w-full rounded-xl border px-4 py-3 text-sm text-gray-900 outline-none transition-colors focus:ring-2"
            :class="errors.subject ? 'border-red-300 focus:ring-red-100' : 'border-slate-200 focus:border-blue-400 focus:ring-blue-100'"
            placeholder="Question about the Guided plan"
          />
          <p v-if="errors.subject" class="mt-1.5 text-xs text-red-500">{{ errors.subject }}</p>
        </div>

        <div>
          <label class="text-sm font-medium text-gray-700" for="contact-message">Message</label>
          <textarea
            id="contact-message"
            v-model="fields.message"
            rows="5"
            :data-invalid="!!errors.message"
            class="mt-2 w-full resize-none rounded-xl border px-4 py-3 text-sm text-gray-900 outline-none transition-colors focus:ring-2"
            :class="errors.message ? 'border-red-300 focus:ring-red-100' : 'border-slate-200 focus:border-blue-400 focus:ring-blue-100'"
            placeholder="What's on your mind?"
          />
          <p v-if="errors.message" class="mt-1.5 text-xs text-red-500">{{ errors.message }}</p>
        </div>

        <p v-if="submitError" class="text-sm text-red-500">{{ submitError }}</p>

        <MagneticButton as="button" type="submit" class="w-full" data-cursor-hover>
          {{ status === 'submitting' ? 'Sending…' : 'Send message' }}
        </MagneticButton>
      </form>
    </template>

    <div v-else ref="successEl" class="flex flex-col items-center py-10 text-center">
      <div class="flex h-14 w-14 items-center justify-center rounded-full bg-cyan-50 text-cyan-600">
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" class="h-6 w-6">
          <path d="M4 10.5 8 14l8-8" />
        </svg>
      </div>
      <h3 class="mt-5 text-xl font-semibold text-gray-900">Message sent.</h3>
      <p class="mt-2 max-w-xs text-sm text-gray-500">Thanks for reaching out — we usually reply within one business day.</p>
      <button class="mt-6 text-sm font-medium text-blue-600 hover:text-blue-700" @click="resetForm">
        Send another message
      </button>
    </div>
  </div>
</template>
