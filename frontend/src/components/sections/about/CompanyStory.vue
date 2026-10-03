<script setup>
import { onMounted, ref } from "vue";
import { revealHeading, revealUp } from "../../../composables/useReveal";
import { aboutStory } from "../../../data/content";

const sectionEl = ref(null);
const headingEl = ref(null);
const paraEl = ref(null);
const visualEl = ref(null);

onMounted(() => {
  revealHeading(headingEl.value, {
    type: "words",
    trigger: sectionEl.value,
    stagger: 0.02,
  });
  revealUp(paraEl.value.children, {
    trigger: paraEl.value,
    start: "top 85%",
    y: 24,
    stagger: 0.1,
  });
  revealUp(visualEl.value, {
    trigger: sectionEl.value,
    start: "top 80%",
    y: 30,
  });
});
</script>

<template>
  <section ref="sectionEl" class="relative overflow-hidden py-18">
    <!-- Background Glow -->
    <div class="absolute inset-0 -z-10">
      <div
        class="absolute left-1/3 top-20 h-72 w-72 rounded-full bg-cyan-500/10 blur-[120px]"
      />
      <div
        class="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-blue-600/10 blur-[160px]"
      />
    </div>

    <div
      class="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2 lg:px-10"
    >
      <!-- LEFT -->
      <div>
        <p
          class="mb-5 text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400"
        >
          {{ aboutStory.eyebrow }}
        </p>

        <h2
          ref="headingEl"
          class="max-w-xl font-display text-5xl font-bold leading-tight text-black"
        >
          {{ aboutStory.heading }}
        </h2>

        <div ref="paraEl" class="mt-10 space-y-6">
          <p
            v-for="(p, i) in aboutStory.paragraphs"
            :key="i"
            class="max-w-xl text-lg leading-8 text-black"
          >
            {{ p }}
          </p>
        </div>
      </div>

      <!-- RIGHT -->
      <div ref="visualEl" class="relative">
        <!-- Main Card -->
        <div
          class="rounded-3xl border border-white/10 bg-slate-900/70 p-8 backdrop-blur-xl shadow-2xl"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-slate-400">Trusted Learning Platform</p>

              <h3 class="mt-2 text-3xl font-bold text-white">CryptoLearner</h3>
            </div>

            <div
              class="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/15"
            >
              📘
            </div>
          </div>

          <div class="mt-10 space-y-6">
            <div class="rounded-2xl bg-slate-800/60 p-5">
              <div class="flex justify-between">
                <span class="text-slate-400"> Beginner Guide </span>

                <span class="text-cyan-400"> 100% </span>
              </div>

              <div class="mt-3 h-2 overflow-hidden rounded-full bg-slate-700">
                <div class="h-full w-full rounded-full bg-cyan-400"></div>
              </div>
            </div>

            <div class="rounded-2xl bg-slate-800/60 p-5">
              <div class="flex justify-between">
                <span class="text-slate-400"> Wallet Security </span>

                <span class="text-cyan-400"> 84% </span>
              </div>

              <div class="mt-3 h-2 overflow-hidden rounded-full bg-slate-700">
                <div class="h-full w-4/5 rounded-full bg-cyan-400"></div>
              </div>
            </div>

            <div class="rounded-2xl bg-slate-800/60 p-5">
              <div class="flex justify-between">
                <span class="text-slate-400"> DeFi & NFTs </span>

                <span class="text-cyan-400"> 56% </span>
              </div>

              <div class="mt-3 h-2 overflow-hidden rounded-full bg-slate-700">
                <div class="h-full w-2/4 rounded-full bg-cyan-400"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Floating Card -->
        <div
          class="absolute -left-10 -bottom-10 rounded-2xl border border-white/10 bg-slate-900/90 p-5 backdrop-blur-xl shadow-xl"
        >
          <p class="text-4xl font-bold text-cyan-400">50+</p>

          <p class="mt-2 text-sm text-slate-400">Beginner Friendly Lessons</p>
        </div>

        <!-- Floating Badge -->
        <div
          class="absolute -right-8 top-8 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-5 py-2 text-sm font-medium text-cyan-300 backdrop-blur-xl"
        >
          Learn • Practice • Stay Safe
        </div>
      </div>
    </div>
  </section>
</template>
