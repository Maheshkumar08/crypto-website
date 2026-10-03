<script setup>
import { onMounted, reactive, ref } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import { GUIDE_CATEGORIES } from '../../composables/guideCategories'
import { listGuideCards, updateGuideCard, deleteGuideCard, reorderGuideCards } from '../../services/guideCards'
import ConfirmModal from '../../components/admin/ConfirmModal.vue'

const loading = ref(true)
const error = ref('')
const pendingDelete = ref(null)

// One reactive array per category, so `<VueDraggable>` can bind (and reorder)
// each group independently without touching the others.
const groups = reactive(Object.fromEntries(GUIDE_CATEGORIES.map((c) => [c.value, []])))

async function load() {
  loading.value = true
  error.value = ''
  try {
    const all = await listGuideCards()
    GUIDE_CATEGORIES.forEach((c) => {
      groups[c.value] = all.filter((card) => card.category === c.value)
    })
  } catch (err) {
    console.error('[guide-cards] load failed:', err.code, err.message, err)
    error.value = 'Could not load guide cards. Check the server connection.'
  } finally {
    loading.value = false
  }
}

async function onReorder(category) {
  try {
    await reorderGuideCards(groups[category])
  } catch (err) {
    console.error('[guide-cards] reorder failed:', err.code, err.message, err)
  }
}

async function toggleEnabled(card) {
  card.enabled = !card.enabled
  try {
    await updateGuideCard(card.id, { enabled: card.enabled })
  } catch (err) {
    card.enabled = !card.enabled // revert on failure
    console.error('[guide-cards] toggle failed:', err.code, err.message, err)
  }
}

function confirmDelete(card) {
  pendingDelete.value = card
}

async function onConfirmDelete() {
  const card = pendingDelete.value
  pendingDelete.value = null
  if (!card) return
  await deleteGuideCard(card.id)
  groups[card.category] = groups[card.category].filter((c) => c.id !== card.id)
}

onMounted(load)
</script>

<template>
  <div>
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="font-display text-2xl font-bold tracking-tight text-gray-900">Guide cards</h1>
        <p class="mt-1 text-sm text-gray-500">
          The cards shown on each learning page. Drag to reorder, publish an article with a matching Guide Card to wire it up automatically.
        </p>
      </div>
      <router-link
        :to="{ name: 'admin-guide-new' }"
        class="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
      >
        New guide card
      </router-link>
    </div>

    <p v-if="error" class="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">{{ error }}</p>

    <div v-if="loading" class="mt-10 text-center text-sm text-gray-400">Loading…</div>

    <div v-else class="mt-8 space-y-8">
      <div v-for="cat in GUIDE_CATEGORIES" :key="cat.value" class="rounded-2xl border border-slate-200/80 bg-white shadow-soft">
        <div class="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div class="flex items-center gap-2">
            <h2 class="text-sm font-semibold text-gray-900">{{ cat.label }}</h2>
            <span class="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-gray-500">
              {{ groups[cat.value].length }}
            </span>
          </div>
          <router-link
            :to="{ name: 'admin-guide-new', query: { category: cat.value } }"
            class="text-xs font-medium text-blue-600 hover:text-blue-700"
          >
            + Add card
          </router-link>
        </div>

        <p v-if="!groups[cat.value].length" class="px-5 py-6 text-sm text-gray-400">No cards in this category yet.</p>

        <VueDraggable
          v-else
          v-model="groups[cat.value]"
          handle=".drag-handle"
          class="divide-y divide-slate-100"
          @end="onReorder(cat.value)"
        >
          <div v-for="card in groups[cat.value]" :key="card.id" class="flex items-center gap-3 px-5 py-3">
            <button type="button" class="drag-handle cursor-grab text-gray-300 hover:text-gray-400" aria-label="Drag to reorder">
              <svg viewBox="0 0 20 20" fill="currentColor" class="h-4 w-4">
                <circle cx="7" cy="5" r="1.3" /><circle cx="13" cy="5" r="1.3" />
                <circle cx="7" cy="10" r="1.3" /><circle cx="13" cy="10" r="1.3" />
                <circle cx="7" cy="15" r="1.3" /><circle cx="13" cy="15" r="1.3" />
              </svg>
            </button>

            <div class="min-w-0 flex-1">
              <p class="truncate text-sm font-medium text-gray-900">{{ card.title }}</p>
              <p class="truncate font-mono text-xs text-gray-400">{{ card.cardId }}</p>
            </div>

            <button
              type="button"
              class="shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold transition-colors"
              :class="card.enabled ? 'bg-cyan-50 text-cyan-700 hover:bg-cyan-100' : 'bg-slate-100 text-gray-400 hover:bg-slate-200'"
              @click="toggleEnabled(card)"
            >
              {{ card.enabled ? 'Enabled' : 'Disabled' }}
            </button>

            <router-link
              :to="{ name: 'admin-guide-edit', params: { id: card.id } }"
              class="shrink-0 text-xs font-medium text-gray-500 hover:text-gray-900"
            >
              Edit
            </router-link>
            <button
              type="button"
              class="shrink-0 text-xs font-medium text-red-500 hover:text-red-600"
              @click="confirmDelete(card)"
            >
              Delete
            </button>
          </div>
        </VueDraggable>
      </div>
    </div>

    <ConfirmModal
      :open="!!pendingDelete"
      title="Delete this guide card?"
      :message="`“${pendingDelete?.title}” will be permanently removed. Any article linked to it will no longer be reachable from its Read Guide button.`"
      @confirm="onConfirmDelete"
      @cancel="pendingDelete = null"
    />
  </div>
</template>
