<script setup>
import { onMounted, ref } from 'vue'
import { deleteBlog, getBlogs } from '../../services/blogs'
import PostManagerTable from '../../components/admin/PostManagerTable.vue'

const posts = ref([])
const loading = ref(true)
const error = ref('')

async function load() {
  loading.value = true
  error.value = ''
  try {
    posts.value = await getBlogs({ publishedOnly: false })
  } catch (err) {
    error.value = 'Could not load blogs. Check the server connection.'
  } finally {
    loading.value = false
  }
}

async function onDelete(id) {
  await deleteBlog(id)
  posts.value = posts.value.filter((p) => p.id !== id)
}

onMounted(load)
</script>

<template>
  <div>
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="font-display text-2xl font-bold tracking-tight text-gray-900">Blogs</h1>
        <p class="mt-1 text-sm text-gray-500">Everything published to the public Blog section.</p>
      </div>
      <router-link
        :to="{ name: 'admin-blog-new' }"
        class="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
      >
        New blog post
      </router-link>
    </div>

    <p v-if="error" class="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">{{ error }}</p>

    <div class="mt-8">
      <PostManagerTable :posts="posts" :loading="loading" edit-route-name="admin-blog-edit" @delete="onDelete" />
    </div>
  </div>
</template>
