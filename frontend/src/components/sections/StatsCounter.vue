<script setup>
import { ref, onMounted } from "vue";
import { revealHeading, revealUp } from "../../composables/useReveal";

defineProps({
  transparent: { type: Boolean, default: false },
});

const sectionEl = ref(null);
const headingEl = ref(null);
const gridEl = ref(null);

const terms = [
  {
    title: "Wallet",
    description:
      "A crypto wallet stores your digital assets and private keys. Some wallets are managed by exchanges, while self-custody wallets give you full control.",
  },
  {
    title: "Seed Phrase",
    description:
      "A 12–24 word recovery phrase used to restore your wallet. Anyone with these words can access your funds.",
  },
];

onMounted(() => {
  revealHeading(headingEl.value, {
    type: "words",
    trigger: sectionEl.value,
    stagger: 0.03,
  });

  revealUp(gridEl.value.children, {
    trigger: gridEl.value,
    start: "top 85%",
    y: 30,
    stagger: 0.08,
  });
});
</script>

<template>
  <section
    ref="sectionEl"
    class="py-16"
    :class="transparent ? '' : 'bg-slate-50'"
  >
    <div class="mx-auto max-w-7xl px-6 lg:px-10">
      <h2 ref="{headingEl}" className="mt-4 text-4xl font-bold text-[#31AB08]">
        Crypto terms every beginner should know
      </h2>

      <p class="mt-5 max-w-3xl text-lg text-slate-600">
        You'll see these words everywhere in crypto. Understanding them early
        makes the rest of your learning much easier.
      </p>

      <div ref="gridEl" class="mt-14 grid gap-6 md:grid-cols-2">
        <div
          v-for="term in terms"
          :key="term.title"
          class="rounded-3xl border border-slate-200 bg-white p-8 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
        >
          <h3 class="text-2xl font-bold text-[#31AB08]">
            {{ term.title }}
          </h3>

          <p class="mt-4 leading-8 text-slate-600">
            {{ term.description }}
          </p>
        </div>
      </div>

      <div
        class="mt-10 rounded-2xl border-l-4 border-amber-500 bg-amber-50 p-6"
      >
        <p class="text-sm leading-7 text-slate-700">
          <strong>Important:</strong> Your seed phrase and private key should
          never be shared with anyone. Losing them may permanently lock you out
          of your crypto, while sharing them allows others to steal it.
        </p>
      </div>
    </div>
  </section>
</template>
