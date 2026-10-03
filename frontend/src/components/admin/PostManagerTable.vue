<script setup>
import { computed, ref } from 'vue'
import { formatDate } from '../../composables/text'
import ConfirmModal from './ConfirmModal.vue'

const props = defineProps({
  posts: { type: Array, required: true },
  loading: { type: Boolean, default: false },
  editRouteName: { type: String, required: true },
})

const emit = defineEmits(['delete'])

const search = ref('')
const category = ref('all')
const status = ref('all')
const pendingDelete = ref(null)

const categories = computed(() => {
  const set = new Set(props.posts.map((p) => p.category).filter(Boolean))
  return ['all', ...set]
})

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  return props.posts.filter((p) => {
    if (q && !p.title?.toLowerCase().includes(q)) return false
    if (category.value !== 'all' && p.category !== category.value) return false
    if (status.value === 'published' && !p.published) return false
    if (status.value === 'draft' && p.published) return false
    return true
  })
})

function confirmDelete(post) {
  pendingDelete.value = post
}

function onConfirmDelete() {
  emit('delete', pendingDelete.value.id)
  pendingDelete.value = null
}
</script>

<template>
  <div>
    <div class="flex flex-wrap items-center gap-3">
      <input
        v-model="search"
        type="search"
        placeholder="Search by title…"
        class="w-full max-w-xs rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
      />
      <select
        v-model="category"
        class="rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-blue-400"
      >
        <option v-for="c in categories" :key="c" :value="c">{{ c === 'all' ? 'All categories' : c }}</option>
      </select>
      <select
        v-model="status"
        class="rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-blue-400"
      >
        <option value="all">All statuses</option>
        <option value="published">Published</option>
        <option value="draft">Draft</option>
      </select>
    </div>

    <div class="mt-6 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-soft">
      <div v-if="loading" class="px-6 py-10 text-center text-sm text-gray-400">Loading…</div>
      <div v-else-if="!filtered.length" class="px-6 py-10 text-center text-sm text-gray-400">No posts match those filters.</div>

      <table v-else class="w-full text-left text-sm">
        <thead class="border-b border-slate-100 text-xs uppercase tracking-wide text-gray-400">
          <tr>
            <th class="px-6 py-3 font-medium">Title</th>
            <th class="px-6 py-3 font-medium">Category</th>
            <th class="px-6 py-3 font-medium">Status</th>
            <th class="px-6 py-3 font-medium">Updated</th>
            <th class="px-6 py-3"></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-for="post in filtered" :key="post.id">
            <td class="max-w-xs truncate px-6 py-4 font-medium text-gray-900">{{ post.title }}</td>
            <td class="px-6 py-4 text-gray-500">{{ post.category || '—' }}</td>
            <td class="px-6 py-4">
              <span
                class="rounded-full px-2.5 py-1 text-xs font-medium"
                :class="post.published ? 'bg-cyan-50 text-cyan-700' : 'bg-slate-100 text-gray-500'"
              >
                {{ post.published ? 'Published' : 'Draft' }}
              </span>
            </td>
            <td class="px-6 py-4 text-gray-500">{{ formatDate(post.updatedAt || post.createdAt) }}</td>
            <td class="px-6 py-4 text-right">
              <div class="flex justify-end gap-4">
                <router-link :to="{ name: editRouteName, params: { id: post.id } }" class="font-medium text-blue-600 hover:text-blue-700">
                  Edit
                </router-link>
                <button class="font-medium text-red-500 hover:text-red-600" @click="confirmDelete(post)">Delete</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <ConfirmModal
      :open="!!pendingDelete"
      title="Delete this post?"
      :message="pendingDelete ? `“${pendingDelete.title}” will be permanently removed.` : ''"
      @confirm="onConfirmDelete"
      @cancel="pendingDelete = null"
    />
  </div>
</template>
