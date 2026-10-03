<script setup>
import { useRouter } from "vue-router";
import { useGuideCards } from "../../composables/useGuideCards";

const props = defineProps({
  category: { type: String, required: true },
});

const router = useRouter();
const { cards, loading, error } = useGuideCards(props.category);

function open(card) {
  if (!card.article) return;

  window.open(`/${props.category}/${card.article.slug}`, "_blank", "noopener,noreferrer");
}
</script>

<template>
  <div>
    <div v-if="loading" class="grid md:grid-cols-2 gap-4">
      <div
        v-for="i in 6"
        :key="i"
        class="rounded-2xl border border-sky-100 bg-white p-6 shadow-sm"
        role="presentation"
        aria-hidden="true"
      >
        <div class="skeleton-shimmer h-5 w-1/2 rounded-full" />
        <div class="skeleton-shimmer mt-3 h-3.5 w-full rounded-full" />
        <div class="skeleton-shimmer mt-2 h-3.5 w-3/4 rounded-full" />
      </div>
    </div>

    <p
      v-else-if="error"
      class="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
    >
      {{ error }}
    </p>

    <p
      v-else-if="!cards.length"
      class="rounded-2xl border border-sky-100 bg-white px-6 py-10 text-center text-sm text-slate-500"
    >
      New terms are added regularly.
    </p>

    <div v-else class="grid md:grid-cols-2 gap-4">
      <article
        v-for="card in cards"
        :key="card.id"
        class="group bg-white border border-sky-100 rounded-2xl p-6 shadow-sm transition-all duration-200"
        :class="
          card.article
            ? 'cursor-pointer hover:shadow-md hover:border-sky-300 hover:-translate-y-0.5'
            : ''
        "
        @click="open(card)"
      >
        <h3
          class="text-xl font-semibold text-slate-900 font-['Space_Grotesk'] mb-2 transition-colors"
          :class="card.article && 'group-hover:text-sky-700'"
        >
          {{ card.title }}
        </h3>
        <p class="text-slate-600 leading-7">{{ card.description }}</p>
        <div
          v-if="card.article"
          class="mt-3 inline-flex items-center gap-1 text-sm font-medium text-sky-600 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          Read more
          <span aria-hidden="true">→</span>
        </div>
      </article>
    </div>
  </div>
</template>
