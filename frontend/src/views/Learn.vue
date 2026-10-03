<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import GuideCardGrid from "../components/guides/GuideCardGrid.vue";
import { useSeoMeta } from "../composables/useSeoMeta";
useSeoMeta({
  title: "Getting Started with Crypto | Cryptolearner",
  description:
    "Start learning crypto with Cryptolearner’s beginner guide covering Bitcoin, blockchain, Ethereum, Web3, wallets, NFTs, DeFi, and more.",
  path: "/getting-started",
});

const contactOpen = ref(false);
const fabRef = ref(null);
const panelRef = ref(null);

const openPanel = () => {
  contactOpen.value = true;
};

const togglePanel = () => {
  contactOpen.value = !contactOpen.value;
};

const handleOutsideClick = (e) => {
  if (!contactOpen.value) return;
  const inPanel = panelRef.value && panelRef.value.contains(e.target);
  const inFab = fabRef.value && fabRef.value.contains(e.target);
  if (!inPanel && !inFab) contactOpen.value = false;
};

onMounted(() => document.addEventListener("click", handleOutsideClick));
onUnmounted(() => document.removeEventListener("click", handleOutsideClick));
</script>

<template>
  <main
    class="min-h-screen bg-gradient-to-b from-sky-50 via-blue-50 to-white text-slate-800"
  >
    <!-- Hero -->
    <section class="relative overflow-hidden px-6 pt-20 pb-16">
      <!-- soft blue glow -->
      <div
        class="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-sky-200/50 blur-3xl"
      ></div>
      <div
        class="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-blue-200/40 blur-3xl"
      ></div>

      <div class="relative max-w-5xl mx-auto">
        <span
          class="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-sky-700 bg-sky-100 border border-sky-200 px-3 py-1 rounded-full"
        >
          Getting Started
        </span>

        <h1
          class="mt-6 text-4xl md:text-5xl font-bold text-slate-900 leading-tight font-['Space_Grotesk']"
        >
          New to crypto?
          <br />
          <span class="text-sky-600">Start here.</span>
        </h1>

        <p class="mt-6 text-lg text-slate-600 leading-8 max-w-3xl">
          If you've heard people talk about Bitcoin, wallets, or “the
          blockchain” and felt a little lost — you're in the right place. This
          section covers the absolute basics: what crypto actually is, how it
          works, and how people typically take their first steps, without
          skipping past anything or assuming you already know the jargon.
        </p>

        <div
          class="mt-8 inline-flex items-start gap-3 bg-white/70 backdrop-blur border border-sky-200 rounded-xl px-5 py-4 shadow-sm"
        >
          <span
            class="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-600 text-white text-xs font-bold"
          >
            i
          </span>
          <p class="text-sm text-slate-600 leading-6">
            <strong class="text-slate-800">Who this is for:</strong>
            anyone who has never bought crypto before and wants to understand it
            before they do anything else.
          </p>
        </div>
      </div>
    </section>

    <!-- Guides -->
    <section class="px-6 py-16 border-t border-sky-100">
      <div class="max-w-5xl mx-auto">
        <div class="flex items-end justify-between mb-10">
          <h2 class="text-3xl font-bold text-slate-900 font-['Space_Grotesk']">
            Guides in this section
          </h2>
        </div>

        <GuideCardGrid category="getting-started" category-label="Getting Started" />

        <!-- Disclaimer -->
        <div
          class="mt-10 bg-sky-50 border-l-4 border-sky-500 rounded-r-xl p-6 text-sky-900 leading-7"
        >
          <strong class="text-sky-800">Note:</strong>
          Everything in this section is educational. Nothing here is a
          recommendation to buy any specific cryptocurrency.
        </div>
      </div>
    </section>
  </main>
</template>
