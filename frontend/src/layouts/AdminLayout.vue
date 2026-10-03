<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import AdminSidebar from '../components/admin/AdminSidebar.vue'

const auth = useAuthStore()
onMounted(() => auth.init())
</script>

<template>
  <div class="flex min-h-screen bg-slate-50">
    <AdminSidebar />
    <main class="min-w-0 flex-1 px-8 py-8 lg:px-12 lg:py-10">
      <slot />
    </main>
  </div>
</template>
