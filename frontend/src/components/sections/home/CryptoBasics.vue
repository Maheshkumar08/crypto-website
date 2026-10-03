<script setup>
import { onMounted, ref } from "vue";
import { revealHeading, revealUp } from "../../../composables/useReveal";
import { cryptoBasics } from "../../../data/content";
import { useSiteNav } from "../../../composables/useSiteNav";

const { goTo } = useSiteNav();

const sectionEl = ref(null);
const headingEl = ref(null);
const compareEl = ref(null);
const stepsEl = ref(null);
const duoEl = ref(null);

onMounted(() => {
  revealHeading(headingEl.value, {
    type: "words",
    trigger: sectionEl.value,
    stagger: 0.025,
  });
  revealUp(compareEl.value.children, {
    trigger: compareEl.value,
    start: "top 85%",
    y: 40,
    stagger: 0.12,
  });
  revealUp(stepsEl.value.children, {
    trigger: stepsEl.value,
    start: "top 85%",
    y: 30,
    stagger: 0.06,
  });
  revealUp(duoEl.value.children, {
    trigger: duoEl.value,
    start: "top 85%",
    y: 40,
    stagger: 0.12,
  });
});
</script>

<template>
  <section
    ref="sectionEl"
    class="relative mx-auto max-w-6xl px-6 py-16 lg:px-10 lg:py-20"
  >
    <div
      class="mt-8 grid grid-cols-1 items-start gap-10 lg:grid-cols-[1.1fr_0.9fr]"
    >
      <!-- LEFT SIDE -->
      <div>
        <h2
          ref="headingEl"
          class="mt-5 max-w-xl font-display text-4xl font-bold leading-tight lg:text-5xl"
        >
          <span class="text-black">What is </span>
          <span class="text-[#0D8BF2]">Cryptocurrency?</span>
          <br />
        </h2>

        <div
          class="mt-8 space-y-7 text-2xl leading-9 text-[#04243E] text-justify"
        >
          <p>
            Cryptocurrency is digital money. You can't hold it in your hand like
            cash because it exists only on computers connected through the
            internet.
          </p>

          <p>
            Unlike regular money that is managed by governments and banks,
            cryptocurrencies work through thousands of computers around the
            world. Every transaction is recorded on a blockchain.
          </p>

          <p>
            Bitcoin was the first cryptocurrency, introduced in 2009. Today
            there are thousands of cryptocurrencies including Ethereum, Solana,
            Avalanche and many others.
          </p>

          <p>
            Understanding cryptocurrency before investing helps you avoid scams,
            unrealistic expectations and expensive mistakes.
          </p>
        </div>
      </div>

      <!-- RIGHT SIDE -->
      <div ref="compareEl">
        <div
          class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl"
        >
          <table class="w-full border-collapse">
            <thead>
              <tr class="bg-slate-50">
                <th
                  class="border-b border-r border-slate-200 p-5 text-left text-sm font-semibold uppercase tracking-wide text-slate-500"
                >
                  Regular Money
                </th>

                <th
                  class="border-b border-slate-200 p-5 text-left text-sm font-semibold uppercase tracking-wide text-blue-600"
                >
                  Cryptocurrency
                </th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="(point, index) in cryptoBasics.compare.regular.points"
                :key="index"
                class="border-b last:border-0"
              >
                <td class="border-r border-slate-200 p-5 text-slate-700">
                  {{ point }}
                </td>

                <td class="p-5 text-slate-700">
                  {{ cryptoBasics.compare.crypto.points[index] }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Regular money vs crypto -->

    <!-- How trading works -->

    <!-- Investing vs trading -->
    <!-- Investing vs Trading -->
    <div class="mt-18 border-t border-slate-200 pt-20">
      <h2
        class="max-w-2xl font-display text-4xl font-bold leading-tight text-blue-600"
      >
        {{ cryptoBasics.investingVsTrading.heading }}
      </h2>

      <p class="mt-6 max-w-2xl text-lg leading-9 text-slate-600">
        {{ cryptoBasics.investingVsTrading.subtitle }}
      </p>

      <!-- Comparison -->
      <div
        ref="duoEl"
        class="mt-14 overflow-hidden border border-slate-300 bg-white"
      >
        <div class="grid lg:grid-cols-2">
          <div
            v-for="(card, index) in cryptoBasics.investingVsTrading.cards"
            :key="card.title"
            class="border-b border-slate-200 p-10 lg:border-b-0"
            :class="index === 0 ? 'lg:border-r border-slate-300' : ''"
          >
            <p
              class="text-sm font-semibold uppercase tracking-wider text-blue-700"
            >
              {{ card.label }}
            </p>

            <h3 class="mt-5 text-4xl font-bold text-slate-900">
              {{ card.title }}
            </h3>

            <p class="mt-6 text-lg leading-9 text-slate-700">
              {{ card.description }}
            </p>
          </div>
        </div>
      </div>

      <!-- Bottom Note -->
      <div
        class="mt-8 max-w-3xl border-l-4 border-emerald-700 bg-emerald-50 px-6 py-6"
      >
        <p class="text-lg leading-9 text-slate-700">
          <strong>In plain terms:</strong>

          Investing is generally slower and lower risk because you're holding
          assets for a longer period. Trading focuses on short-term price
          movements, requires more experience, and carries a higher chance of
          losing money if you don't have a proper strategy.
        </p>
      </div>
    </div>

    <!-- Key terms -->
    <!-- How Crypto Trading Works -->
    <div class="mt-18">
      <div class="max-w-3xl">
        <h3 class="font-display text-4xl font-bold leading-tight text-blue-600">
          {{ cryptoBasics.howItWorks.heading }}
        </h3>

        <p class="mt-4 text-lg leading-8 text-slate-600">
          {{ cryptoBasics.howItWorks.subtitle }}
        </p>
      </div>

      <div
        ref="stepsEl"
        class="mt-14 divide-y divide-slate-200 border-t border-slate-200"
      >
        <div
          v-for="(step, i) in cryptoBasics.howItWorks.steps"
          :key="step.title"
          class="grid grid-cols-[70px_1fr] gap-8 py-8"
        >
          <!-- Number -->
          <div
            class="font-display text-4xl font-bold leading-none text-blue-600"
          >
            {{ String(i + 1).padStart(2, "0") }}
          </div>

          <!-- Content -->
          <div>
            <h4 class="text-2xl font-semibold text-slate-900">
              {{ step.title }}
            </h4>

            <p class="mt-3 max-w-3xl text-lg leading-8 text-slate-600">
              {{ step.description }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
