<script setup>
import { onMounted, ref } from 'vue'
import { revealUp } from '../../../composables/useReveal'
import { missionVision } from '../../../data/content'
import GlowCard from '../../ui/GlowCard.vue'
import FeatureIcon from '../../ui/FeatureIcon.vue'

const gridEl = ref(null)

onMounted(() => {
  revealUp(gridEl.value.children, { trigger: gridEl.value, start: 'top 85%', y: 40, stagger: 0.12 })
})
</script>

<template>
  <section class="relative mx-auto max-w-7xl px-6 pb-16 lg:px-10">
    <div ref="gridEl" class="grid grid-cols-1 gap-6 md:grid-cols-2">
      <GlowCard v-for="item in missionVision" :key="item.title" class="p-10">
        <div class="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
          <FeatureIcon :name="item.icon" />
        </div>
        <h3 class="mt-6 text-xl font-semibold text-gray-900">{{ item.title }}</h3>
        <p class="mt-3 text-base leading-relaxed text-gray-500">{{ item.description }}</p>
      </GlowCard>
    </div>
  </section>
</template>
