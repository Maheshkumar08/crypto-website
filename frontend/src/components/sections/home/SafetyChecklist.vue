<script setup>
import { ref, onMounted } from "vue";
import { revealHeading, revealUp } from "../../../composables/useReveal";

const sectionEl = ref(null);
const headingEl = ref(null);
const listEl = ref(null);

const safetyTips = [
  {
    title: "Learn Before You Buy",
    desc: "Understand what Bitcoin, Ethereum, wallets, and blockchain actually do before investing any money.",
  },
  {
    title: "Only Invest What You Can Lose",
    desc: "Never use emergency savings, borrowed money, or rent money for crypto investments.",
  },
  {
    title: "Start Small",
    desc: "Begin with a small amount while learning instead of chasing huge profits immediately.",
  },
  {
    title: "Choose Trusted Exchanges",
    desc: "Use well-known, regulated exchanges that provide strong security and customer support.",
  },
  {
    title: "Enable Two-Factor Authentication",
    desc: "Protect every crypto account using 2FA to reduce the risk of unauthorized access.",
  },
  {
    title: "Protect Your Seed Phrase",
    desc: "Never share your recovery phrase. Store it offline in a secure location.",
  },
  {
    title: "Ignore Hype & FOMO",
    desc: "Don't buy simply because everyone on social media is talking about a coin.",
  },
  {
    title: "Think Long Term",
    desc: "Successful investing usually comes from patience, research, and disciplined decisions.",
  },
];

onMounted(() => {
  revealHeading(headingEl.value, {
    type: "words",
    trigger: sectionEl.value,
    stagger: 0.03,
  });

  revealUp(listEl.value.children, {
    trigger: listEl.value,
    start: "top 85%",
    y: 35,
    stagger: 0.08,
  });
});
</script>

<template>
  <section ref="sectionEl" class="py-18">
    <div class="mx-auto max-w-6xl px-6 lg:px-10">
      <h2
        ref="{headingEl}"
        className="mx-auto mt-4 max-w-3xl text-center text-4xl font-bold text-[#F08753] lg:text-5xl"
      >
        How to Approach Crypto Safely
      </h2>
      <p
        class="mx-auto mt-6 max-w-2xl text-center text-2xl leading-8 text-[#351403]"
      >
        Learning crypto is much safer when you understand the basics first.
        These practical guidelines can help reduce common mistakes and improve
        your confidence before making financial decisions.
      </p>

      <div ref="listEl" class="mt-20 grid gap-8 md:grid-cols-2">
        <div
          v-for="(tip, index) in safetyTips"
          :key="index"
          class="rounded-3xl border border-slate-200 bg-white p-8 transition duration-300 hover:-translate-y-1 hover:border-blue-500 hover:shadow-xl"
        >
          <div
            class="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-[#F08753] text-lg font-bold text-[#351403]"
          >
            {{ String(index + 1).padStart(2, "0") }}
          </div>

          <h3 class="text-xl font-semibold text-[#F08753]">
            {{ tip.title }}
          </h3>

          <p class="mt-3 leading-7 text-[#351403]">
            {{ tip.desc }}
          </p>
        </div>
      </div>

      <div class="mt-16 rounded-3xl bg-slate-900 p-8 text-center">
        <h3 class="text-2xl font-bold text-[#F08753]">
          Knowledge is Your Best Investment
        </h3>

        <p class="mx-auto mt-4 max-w-3xl text-slate-300 leading-8">
          The safest crypto strategy isn't finding the next coin—it's learning
          how the technology works, understanding the risks, and making informed
          decisions without fear or hype.
        </p>
      </div>
    </div>
  </section>
</template>
