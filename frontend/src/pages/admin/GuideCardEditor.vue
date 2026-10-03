<script setup>
import { reactive, ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { slugify } from '../../composables/text'
import { GUIDE_CATEGORIES } from '../../composables/guideCategories'
import { getGuideCardById, createGuideCard, updateGuideCard, cardIdExists, listGuideCards } from '../../services/guideCards'

const props = defineProps({
  id: { type: String, default: null },
})

const route = useRoute()
const router = useRouter()

const loading = ref(!!props.id)
const saving = ref(false)
const errorMsg = ref('')
const cardIdTouched = ref(false)

const form = reactive({
  title: '',
  cardId: '',
  category: typeof route.query.category === 'string' ? route.query.category : '',
  description: '',
  enabled: true,
})

watch(
  () => form.title,
  (title) => {
    if (!cardIdTouched.value) form.cardId = slugify(title)
  }
)

function onCardIdInput() {
  cardIdTouched.value = true
  form.cardId = slugify(form.cardId)
}

async function loadExisting() {
  const card = await getGuideCardById(props.id)
  if (!card) {
    errorMsg.value = 'Guide card not found.'
    loading.value = false
    return
  }
  Object.assign(form, {
    title: card.title || '',
    cardId: card.cardId || '',
    category: card.category || '',
    description: card.description || '',
    enabled: card.enabled !== false,
  })
  cardIdTouched.value = true
  loading.value = false
}

async function onSave() {
  if (!form.title.trim()) {
    errorMsg.value = 'Give the card a title before saving.'
    return
  }
  if (!form.category) {
    errorMsg.value = 'Choose a category before saving.'
    return
  }
  errorMsg.value = ''
  saving.value = true
  try {
    const exists = await cardIdExists(form.cardId, props.id)
    if (exists) {
      errorMsg.value = `A guide card with the id "${form.cardId}" already exists — adjust the card id.`
      saving.value = false
      return
    }

    const payload = {
      title: form.title.trim(),
      cardId: form.cardId.trim(),
      category: form.category,
      description: form.description.trim(),
      enabled: form.enabled,
    }

    if (props.id) {
      await updateGuideCard(props.id, payload)
    } else {
      // New cards go to the end of their category's order.
      const siblings = await listGuideCards({ category: form.category })
      const maxOrder = siblings.reduce((max, c) => Math.max(max, c.order), -1)
      await createGuideCard({ ...payload, order: maxOrder + 1 })
    }
    router.push({ name: 'admin-guides' })
  } catch (err) {
    console.error('[guide-card-editor] save failed:', err.code, err.message, err)
    errorMsg.value = import.meta.env.DEV
      ? `${err.code || 'unknown-error'} — ${err.message || 'Save failed.'}`
      : 'Could not save — check the server connection.'
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  if (props.id) loadExisting()
})
</script>

<template>
  <div class="mx-auto max-w-2xl">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <router-link :to="{ name: 'admin-guides' }" class="text-sm font-medium text-gray-400 hover:text-gray-600">
          ← Back to guide cards
        </router-link>
        <h1 class="mt-2 font-display text-2xl font-bold tracking-tight text-gray-900">
          {{ id ? 'Edit' : 'New' }} guide card
        </h1>
      </div>
      <button
        type="button"
        class="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        :disabled="saving"
        @click="onSave"
      >
        {{ saving ? 'Saving…' : 'Save card' }}
      </button>
    </div>

    <p v-if="errorMsg" class="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{{ errorMsg }}</p>

    <div v-if="loading" class="mt-10 text-center text-sm text-gray-400">Loading…</div>

    <div v-else class="mt-8 space-y-6 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-soft">
      <div>
        <label class="text-xs font-medium text-gray-500">Title</label>
        <input
          v-model="form.title"
          type="text"
          placeholder="What Is Bitcoin, Really?"
          class="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
        />
      </div>

      <div>
        <label class="text-xs font-medium text-gray-500">Card id</label>
        <input
          v-model="form.cardId"
          type="text"
          class="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-gray-600 outline-none focus:border-blue-400"
          @input="onCardIdInput"
        />
        <p class="mt-1 text-xs text-gray-400">Must be unique across every category — this is what an article's Guide Card field matches against.</p>
      </div>

      <div>
        <label class="text-xs font-medium text-gray-500">Category</label>
        <select
          v-model="form.category"
          class="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-400"
        >
          <option value="" disabled>Choose a category</option>
          <option v-for="c in GUIDE_CATEGORIES" :key="c.value" :value="c.value">{{ c.label }}</option>
        </select>
      </div>

      <div>
        <label class="text-xs font-medium text-gray-500">Description</label>
        <textarea
          v-model="form.description"
          rows="3"
          placeholder="Shown on the card beneath the title."
          class="mt-1.5 w-full resize-none rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
        />
      </div>

      <label class="flex items-center justify-between text-sm text-gray-700">
        Enabled
        <input v-model="form.enabled" type="checkbox" class="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-400" />
      </label>
    </div>
  </div>
</template>
