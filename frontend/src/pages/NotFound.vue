<script setup>
import { useSeoMeta } from '../composables/useSeoMeta'
import MagneticButton from '../components/ui/MagneticButton.vue'

useSeoMeta({ title: 'Page not found', description: 'This page does not exist.', path: '/404' })
</script>

<template>
  <section class="flex min-h-[70vh] flex-col items-center justify-center px-6 pt-16 text-center">
    <p class="font-display text-6xl font-bold text-blue-600">404</p>
    <h1 class="mt-4 font-display text-2xl font-bold tracking-tight text-gray-900">This page wandered off.</h1>
    <p class="mt-3 max-w-sm text-gray-500">The page you're looking for doesn't exist, or has moved somewhere else.</p>
    <MagneticButton as="router-link" :to="{ name: 'home' }" class="mt-8">Back to home</MagneticButton>
  </section>
</template>
