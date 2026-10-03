<script setup>
import { computed, onMounted, ref } from 'vue'
import { getPages, deletePage, updatePage } from '../../services/pages'
import { formatDate } from '../../composables/text'
import ConfirmModal from '../../components/admin/ConfirmModal.vue'

const pages = ref([])
const loading = ref(true)
const error = ref('')
const search = ref('')
const statusFilter = ref('all') // 'all' | 'published' | 'draft'
const pendingDelete = ref(null)
const togglingId = ref(null)

async function load() {
  loading.value = true
  error.value = ''
  try {
    pages.value = await getPages({ publishedOnly: false })
  } catch (err) {
    console.error('[PageList] failed to load pages:', err)
    error.value = 'Could not load pages. Check the server connection.'
  } finally {
    loading.value = false
  }
}

const filteredPages = computed(() => {
  const q = search.value.trim().toLowerCase()
  return pages.value.filter((p) => {
    if (q) {
      const matchTitle = p.title?.toLowerCase().includes(q)
      const matchSlug = p.slug?.toLowerCase().includes(q)
      const matchDesc = p.shortDescription?.toLowerCase().includes(q)
      if (!matchTitle && !matchSlug && !matchDesc) return false
    }
    if (statusFilter.value === 'published' && !p.published) return false
    if (statusFilter.value === 'draft' && p.published) return false
    return true
  })
})

function confirmDelete(page) {
  pendingDelete.value = page
}

async function onConfirmDelete() {
  if (!pendingDelete.value) return
  const id = pendingDelete.value.id
  try {
    await deletePage(id)
    pages.value = pages.value.filter((p) => p.id !== id)
  } catch (err) {
    console.error('[PageList] failed to delete page:', err)
    error.value = 'Could not delete page. Try again.'
  } finally {
    pendingDelete.value = null
  }
}

async function togglePublish(page) {
  togglingId.value = page.id
  const newStatus = !page.published
  try {
    await updatePage(page.id, { published: newStatus })
    page.published = newStatus
  } catch (err) {
    console.error('[PageList] failed to toggle publish:', err)
  } finally {
    togglingId.value = null
  }
}

onMounted(load)
</script>

<template>
  <div>
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="font-display text-2xl font-bold tracking-tight text-gray-900">Pages</h1>
        <p class="mt-1 text-sm text-gray-500">Standalone landing pages (e.g. /money, /bitcoin, /ethereum, /blockchain, /web3).</p>
      </div>
      <router-link
        :to="{ name: 'admin-page-new' }"
        class="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 shadow-sm"
      >
        + New page
      </router-link>
    </div>

    <p v-if="error" class="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
      {{ error }}
    </p>

    <!-- Filters & Search -->
    <div class="mt-8 flex flex-wrap items-center gap-3">
      <div class="relative w-full max-w-xs">
        <input
          v-model="search"
          type="search"
          placeholder="Search by title, /slug or description…"
          class="w-full rounded-xl border border-slate-200 px-4 py-2.5 pl-9 text-sm text-gray-900 outline-none transition-colors focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        />
        <svg
          class="pointer-events-none absolute left-3 top-3 h-4 w-4 text-gray-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
      </div>

      <select
        v-model="statusFilter"
        class="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-blue-400"
      >
        <option value="all">All statuses</option>
        <option value="published">Published</option>
        <option value="draft">Draft</option>
      </select>
    </div>

    <!-- Table -->
    <div class="mt-6 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-soft">
      <div v-if="loading" class="px-6 py-12 text-center text-sm text-gray-400">
        Loading pages…
      </div>
      <div v-else-if="!filteredPages.length" class="px-6 py-12 text-center text-sm text-gray-400">
        {{ pages.length ? 'No pages match those filters.' : 'No pages created yet. Click "+ New page" to create one.' }}
      </div>

      <table v-else class="w-full text-left text-sm">
        <thead class="border-b border-slate-100 text-xs uppercase tracking-wide text-gray-400">
          <tr>
            <th class="px-6 py-3 font-medium">Page Title & Slug</th>
            <th class="px-6 py-3 font-medium">Description</th>
            <th class="px-6 py-3 font-medium">Sort Order</th>
            <th class="px-6 py-3 font-medium">Status</th>
            <th class="px-6 py-3 font-medium">Updated</th>
            <th class="px-6 py-3 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-for="page in filteredPages" :key="page.id" class="hover:bg-slate-50/60 transition-colors">
            <td class="px-6 py-4">
              <router-link
                :to="{ name: 'admin-page-edit', params: { id: page.id } }"
                class="font-medium text-gray-900 hover:text-blue-600 transition-colors"
              >
                {{ page.title || '(Untitled page)' }}
              </router-link>
              <div class="mt-0.5 flex items-center gap-1.5 text-xs text-gray-400">
                <span class="font-mono text-gray-500">/{{ page.slug }}</span>
                <a
                  :href="'/' + page.slug"
                  target="_blank"
                  title="View live page"
                  class="text-blue-500 hover:text-blue-700"
                >
                  ↗
                </a>
              </div>
            </td>

            <td class="px-6 py-4 max-w-xs truncate text-xs text-gray-500">
              {{ page.shortDescription || '—' }}
            </td>

            <td class="px-6 py-4 text-sm text-gray-600 font-mono">
              {{ page.sortOrder ?? 0 }}
            </td>

            <td class="px-6 py-4">
              <button
                type="button"
                :disabled="togglingId === page.id"
                class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer"
                :class="
                  page.published
                    ? 'bg-cyan-50 text-cyan-700 hover:bg-cyan-100'
                    : 'bg-slate-100 text-gray-500 hover:bg-slate-200'
                "
                title="Click to toggle publish status"
                @click="togglePublish(page)"
              >
                <span
                  class="h-1.5 w-1.5 rounded-full"
                  :class="page.published ? 'bg-cyan-500' : 'bg-gray-400'"
                />
                {{ page.published ? 'Published' : 'Draft' }}
              </button>
            </td>

            <td class="px-6 py-4 text-xs text-gray-500">
              {{ formatDate(page.updatedAt || page.createdAt) }}
            </td>

            <td class="px-6 py-4 text-right">
              <div class="flex justify-end items-center gap-3">
                <router-link
                  :to="{ name: 'admin-page-edit', params: { id: page.id } }"
                  class="font-medium text-blue-600 hover:text-blue-700 text-sm"
                >
                  Edit
                </router-link>
                <button
                  type="button"
                  class="font-medium text-red-500 hover:text-red-600 text-sm"
                  @click="confirmDelete(page)"
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Confirm Delete Modal -->
    <ConfirmModal
      :open="!!pendingDelete"
      title="Delete this page?"
      :message="pendingDelete ? `“${pendingDelete.title}” (/${pendingDelete.slug}) will be permanently removed.` : ''"
      @confirm="onConfirmDelete"
      @cancel="pendingDelete = null"
    />
  </div>
</template>
