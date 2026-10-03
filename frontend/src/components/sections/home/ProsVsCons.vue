<script setup>
import { ref, onMounted } from "vue";
import { revealHeading, revealUp } from "../../../composables/useReveal";

const sectionEl = ref(null);
const headingEl = ref(null);
const tableEl = ref(null);

const prosCons = [
  {
    pro: "You control your own funds",
    con: "No bank-style protection if something goes wrong",
  },
  {
    pro: "Works across borders",
    con: "Prices can swing wildly and unpredictably",
  },
  {
    pro: "Open to anyone, anytime",
    con: "Mistakes and scams are usually permanent",
  },
  {
    pro: "Transparent public record",
    con: "Regulations are still evolving",
  },
  {
    pro: "Interesting blockchain technology",
    con: "Hype can disconnect price from real value",
  },
  {
    pro: "Fast peer-to-peer transfers",
    con: "Requires learning wallet security",
  },
];

onMounted(() => {
  revealHeading(headingEl.value, {
    type: "words",
    trigger: sectionEl.value,
    stagger: 0.03,
  });

  revealUp(tableEl.value.children, {
    trigger: tableEl.value,
    start: "top 85%",
    y: 30,
    stagger: 0.08,
  });
});
</script>

<template>
  <section ref="sectionEl" class="py-16">
    <div class="mx-auto max-w-7xl px-6 lg:px-10">
      <h2 ref="{headingEl}" className="mt-4 text-4xl font-bold">
        <span className="text-[#EF6E2E]">Pros vs. Cons, </span>
        <span className="text-[#351403]">Side by Side</span>
      </h2>

      <p class="mt-5 max-w-2xl text-lg text-slate-600">
        Crypto has real advantages, but it also comes with real risks. Looking
        at both together helps you make better decisions.
      </p>

      <div
        ref="tableEl"
        class="mt-14 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg"
      >
        <!-- Header -->
        <div class="grid grid-cols-2 bg-slate-900 text-white">
          <div class="border-r border-slate-700 p-5 font-semibold">
            👍 What people like
          </div>

          <div class="p-5 font-semibold">⚠️ What people should know</div>
        </div>

        <!-- Rows -->
        <div
          v-for="(row, index) in prosCons"
          :key="index"
          class="grid grid-cols-2 border-t border-slate-200 hover:bg-slate-50 transition"
        >
          <div class="border-r border-slate-200 p-5 text-slate-700">
            {{ row.pro }}
          </div>

          <div class="p-5 text-slate-700">
            {{ row.con }}
          </div>
        </div>
      </div>

      <!-- Bottom Note -->
      <div class="mt-10 rounded-2xl border-l-4 border-blue-500 bg-blue-50 p-6">
        <p class="text-sm leading-7 text-slate-700">
          <strong>Remember:</strong> Crypto is neither completely good nor
          completely bad. Understanding both the opportunities and the risks
          will help you make informed decisions instead of emotional ones.
        </p>
      </div>
    </div>
  </section>
</template>
