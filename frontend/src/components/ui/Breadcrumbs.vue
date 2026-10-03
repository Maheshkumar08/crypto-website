<script setup>
import { onBeforeUnmount, watchEffect } from 'vue'
import { SITE_URL } from '../../composables/useSeoMeta'

const props = defineProps({
  items: { type: Array, required: true }, // [{ label, to }] — last item has no `to`
})

watchEffect(() => {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [{ label: 'Home', to: '/' }, ...props.items].map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      item: item.to ? `${SITE_URL}${item.to}` : undefined,
    })),
  }

  let el = document.head.querySelector('script#breadcrumb-jsonld')
  if (!el) {
    el = document.createElement('script')
    el.id = 'breadcrumb-jsonld'
    el.type = 'application/ld+json'
    document.head.appendChild(el)
  }
  el.textContent = JSON.stringify(jsonLd)
})

onBeforeUnmount(() => {
  document.head.querySelector('script#breadcrumb-jsonld')?.remove()
})
</script>

<template>
  <nav aria-label="Breadcrumb" class="flex flex-wrap items-center gap-2 text-sm text-gray-400">
    <router-link :to="{ name: 'home' }" class="hover:text-gray-600">Home</router-link>
    <template v-for="(item, i) in items" :key="i">
      <span>/</span>
      <router-link v-if="item.to" :to="item.to" class="hover:text-gray-600">{{ item.label }}</router-link>
      <span v-else class="text-gray-600">{{ item.label }}</span>
    </template>
  </nav>
</template>
