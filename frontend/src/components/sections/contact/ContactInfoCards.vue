<script setup>
import { onMounted, ref } from 'vue'
import { revealUp } from '../../../composables/useReveal'
import { contactInfo } from '../../../data/content'
import GlowCard from '../../ui/GlowCard.vue'
import FeatureIcon from '../../ui/FeatureIcon.vue'

const gridEl = ref(null)

onMounted(() => {
  revealUp(gridEl.value.children, { trigger: gridEl.value, start: 'top 85%', y: 40, stagger: 0.12 })
})
</script>

<template>
  <section class="relative mx-auto max-w-7xl px-6 pb-16 lg:px-10">
    <div ref="gridEl" class="grid grid-cols-1 gap-5 sm:grid-cols-3">
      <GlowCard v-for="item in contactInfo" :key="item.title" class="p-8" data-cursor-hover>
        <div class="flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 text-blue-600">
          <FeatureIcon :name="item.icon" />
        </div>
        <h3 class="mt-6 text-sm font-medium text-gray-500">{{ item.title }}</h3>
        <p class="mt-1 text-lg font-semibold text-gray-900">{{ item.detail }}</p>
        <p class="mt-3 text-sm leading-relaxed text-gray-500">{{ item.description }}</p>
      </GlowCard>
    </div>
  </section>
</template>
