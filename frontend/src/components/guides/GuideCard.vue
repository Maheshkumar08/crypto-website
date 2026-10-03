<script setup>
import { useRouter } from "vue-router";

const props = defineProps({
  card: { type: Object, required: true }, // { title, description, article: Object|null, ... }
  index: { type: Number, required: true },
  categoryLabel: { type: String, required: true },
});

const router = useRouter();

function open() {
  if (!props.card.article) return;

  const url = `/${props.card.category}/${props.card.article.slug}`;

  window.open(url, "_blank", "noopener,noreferrer");
}
</script>

<template>
  <article
    class="group grid md:grid-cols-[180px_1fr] gap-6 bg-white border border-sky-100 rounded-2xl p-6 shadow-sm transition-all duration-200"
    :class="
      card.article
        ? 'cursor-pointer hover:shadow-md hover:border-sky-300 hover:-translate-y-0.5'
        : ''
    "
    @click="open"
  >
    <div class="flex md:flex-col gap-3 md:gap-2">
      <span
        class="text-xs uppercase tracking-widest text-sky-700 font-semibold"
      >
        {{ categoryLabel }}
      </span>
      <span class="text-xs text-slate-400 font-mono md:mt-1">
        #{{ String(index + 1).padStart(2, "0") }}
      </span>
    </div>

    <div>
      <h3
        class="text-xl font-semibold text-slate-900 font-['Space_Grotesk'] mb-2 transition-colors"
        :class="card.article && 'group-hover:text-sky-700'"
      >
        {{ card.title }}
      </h3>

      <p class="text-slate-600 leading-7">
        {{ card.description }}
      </p>

      <div
        v-if="card.article"
        class="mt-4 inline-flex items-center gap-1 text-sm font-medium text-sky-600 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        Read guide
        <span aria-hidden="true">→</span>
      </div>
      <span
        v-else
        class="mt-4 inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-400"
      >
        Coming soon
      </span>
    </div>
  </article>
</template>
