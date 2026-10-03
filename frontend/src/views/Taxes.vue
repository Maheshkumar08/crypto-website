<script setup>
import { ref } from "vue";
import GuideCardGrid from "../components/guides/GuideCardGrid.vue";
import { useSeoMeta } from "../composables/useSeoMeta";
useSeoMeta({
  title: "Crypto Taxes Guide | Learn About Crypto Tax",
  description:
    "Learn about crypto taxes with Cryptolearner. Understand crypto tax basics, taxable transactions, reporting, gains, losses, and record keeping.",
  path: "/taxes",
});
const panelOpen = ref(false);
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
          US Taxes
        </span>

        <h1
          class="mt-6 text-4xl md:text-5xl font-bold text-slate-900 leading-tight font-['Space_Grotesk']"
        >
          Yes, the IRS cares about
          <span class="text-sky-600">your crypto.</span>
        </h1>

        <p class="mt-6 text-lg text-slate-600 leading-8 max-w-3xl">
          Many first-time crypto users are surprised to learn that buying,
          selling, or even trading one crypto for another can be a taxable event
          in the US. This section explains the rules in plain English, sourced
          directly from IRS guidance.
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
            any US-based crypto holder who wants to understand their tax
            obligations before filing season creates a surprise.
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

        <GuideCardGrid category="taxes" category-label="US Taxes" />

        <!-- Disclaimer -->
        <div
          class="mt-10 bg-sky-50 border-l-4 border-sky-500 rounded-r-xl p-6 text-sky-900 leading-7"
        >
          <strong class="text-sky-800">Disclaimer:</strong>
          This section is general educational information, not personalized tax
          advice. Tax situations vary — consult a licensed tax professional or
          CPA for your specific circumstances. Content is reviewed against
          current IRS guidance, but tax rules can change.
        </div>
      </div>
    </section>
  </main>
</template>
