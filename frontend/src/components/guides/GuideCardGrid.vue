<script setup>
import { useGuideCards } from '../../composables/useGuideCards'
import GuideCard from './GuideCard.vue'
import GuideCardSkeleton from './GuideCardSkeleton.vue'

const props = defineProps({
  category: { type: String, required: true }, // one of GUIDE_CATEGORIES' values
  categoryLabel: { type: String, required: true },
})

const { cards, loading, error } = useGuideCards(props.category)
</script>

<template>
  <div>
    <div v-if="loading" class="space-y-4">
      <GuideCardSkeleton v-for="i in 4" :key="i" />
    </div>

    <p v-else-if="error" class="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
      {{ error }}
    </p>

    <p v-else-if="!cards.length" class="rounded-2xl border border-sky-100 bg-white px-6 py-10 text-center text-sm text-slate-500">
      Guides for this section are on the way.
    </p>

    <div v-else class="space-y-4">
      <GuideCard v-for="(card, i) in cards" :key="card.id" :card="card" :index="i" :category-label="categoryLabel" />
    </div>
  </div>
</template>
