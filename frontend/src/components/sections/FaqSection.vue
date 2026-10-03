<script setup>
import { ref } from "vue";
import { faqs as defaultFaqs } from "../../data/content";

const props = defineProps({
  faqs: {
    type: Array,
    default: () => defaultFaqs,
  },
  eyebrow: {
    type: String,
    default: "Before you start",
  },
  heading: {
    type: String,
    default: "Questions we get asked the most.",
  },
  sectionId: {
    type: String,
    default: "faq",
  },
});

const openIndex = ref(null);

function toggle(index) {
  openIndex.value = openIndex.value === index ? null : index;
}
</script>

<template>
  <section
    :id="sectionId"
    class="relative mx-auto max-w-4xl px-6 py-18 lg:px-10"
  >
    <div class="mx-auto max-w-xl text-center">
      <p class="mb-4 text-sm font-semibold text-cyan-600">
        {{ eyebrow }}
      </p>

      <h2
        class="font-display text-4xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl"
      >
        {{ heading }}
      </h2>
    </div>

    <div class="mt-14 space-y-3">
      <div
        v-for="(faq, index) in props.faqs"
        :key="faq.question"
        class="rounded-2xl border border-slate-200/80 bg-white shadow-soft"
      >
        <button
          class="flex w-full items-center justify-between px-7 py-6 text-left"
          data-cursor-hover
          @click="toggle(index)"
        >
          <span class="pr-6 text-base font-medium text-gray-900">
            {{ faq.question }}
          </span>

          <span
            class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-black"
            :class="{ 'rotate-45': openIndex === index }"
          >
            +
          </span>
        </button>

        <div v-if="openIndex === index" class="px-7 pb-6">
          <p class="text-sm leading-relaxed text-black">
            {{ faq.answer }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
