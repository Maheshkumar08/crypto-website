<script setup>
import { onMounted, ref } from "vue";
import { revealHeading, revealUp } from "../../composables/useReveal";
import { features } from "../../data/content";
import GlowCard from "../ui/GlowCard.vue";
import FeatureIcon from "../ui/FeatureIcon.vue";

const sectionEl = ref(null);
const headingEl = ref(null);
const gridEl = ref(null);

onMounted(() => {
  revealHeading(headingEl.value, {
    type: "words",
    trigger: sectionEl.value,
    stagger: 0.03,
  });

  revealUp(gridEl.value.children, {
    trigger: gridEl.value,
    start: "top 85%",
    y: 40,
    stagger: 0.08,
  });
});
</script>

<template>
  <section id="features" ref="sectionEl" class="relative overflow-hidden py-18">
    <!-- Background -->
    <div
      class="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-100/40 blur-3xl"
    />

    <div class="relative mx-auto max-w-7xl px-6 lg:px-10">
      <div class="mx-auto max-w-3xl text-center">
        <span
          class="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-4 py-1 text-sm font-semibold uppercase tracking-[0.25em] text-blue-700"
        >
          Benefits of Cryptocurrency
        </span>

        <h2
          ref="headingEl"
          class="mt-6 font-display text-4xl font-bold leading-tight text-slate-900 md:text-5xl"
        >
          The Good Side:
          <span class="text-blue-600">Potential Benefits of Crypto</span>
        </h2>

        <p class="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
          We're not here to talk you out of cryptocurrency—we're here to help
          you understand it clearly. While crypto comes with risks, it also
          offers genuine advantages that have attracted millions of users,
          investors, and businesses worldwide. Here are some of the key benefits
          people commonly point to.
        </p>
      </div>
      <!-- Heading -->
      <!-- Grid -->
      <div ref="gridEl" class="mt-20 grid gap-7 md:grid-cols-2 xl:grid-cols-3">
        <GlowCard
          v-for="(feature, index) in features"
          :key="feature.title"
          data-cursor-hover
          class="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 transition-all duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-2xl"
        >
          <!-- Number -->
          <div
            class="absolute right-6 top-6 text-5xl font-black text-slate-100 transition group-hover:text-blue-50"
          >
            {{ String(index + 1).padStart(2, "0") }}
          </div>

          <!-- Icon -->
          <div
            class="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white"
          >
            <FeatureIcon :name="feature.icon" />
          </div>

          <!-- Title -->
          <h3 class="mt-8 text-xl font-semibold text-slate-900">
            {{ feature.title }}
          </h3>

          <!-- Description -->
          <p class="mt-4 text-[15px] leading-7 text-slate-600">
            {{ feature.description }}
          </p>
        </GlowCard>
      </div>
      <!-- Important Note -->
    </div>
  </section>
</template>
