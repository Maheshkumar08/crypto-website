<script setup>
import { learningCards } from "../../data/content";
</script>

<template>
  <section class="relative mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-20">
    <!-- ================= SECTION 09 ================= -->

    <div class="border-b border-slate-200 pb-20">
      <div class="mx-auto max-w-4xl text-center">
        <span
          class="inline-flex rounded-full bg-blue-50 px-4 py-1 text-sm font-semibold uppercase tracking-[0.2em] text-blue-600"
        >
          Who Can Benefit
        </span>

        <h2 class="mt-5 text-4xl font-bold text-[#0D1B2A] md:text-5xl">
          Who This Site Is <span class="text-[#0D8BF2]">For</span>
        </h2>

        <p class="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">
          CryptoLearner is designed for anyone who wants to understand
          cryptocurrency in a simple, honest, and beginner-friendly way—without
          confusing jargon or sales hype.
        </p>
      </div>

      <div class="mt-14 grid gap-6 md:grid-cols-2">
        <div class="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
          <div
            class="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-xl"
          >
            📘
          </div>

          <h3 class="mb-4 text-xl font-bold text-slate-900">
            Perfect for Beginners
          </h3>

          <ul class="space-y-4 text-slate-600">
            <li class="flex gap-3">
              <span class="mt-1 text-green-500">✔</span>
              <span>
                Someone who keeps hearing about crypto and wants to finally
                understand what it actually is.
              </span>
            </li>

            <li class="flex gap-3">
              <span class="mt-1 text-green-500">✔</span>
              <span>
                Someone who prefers simple, plain-English explanations instead
                of technical whitepapers.
              </span>
            </li>
          </ul>
        </div>

        <div class="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
          <div
            class="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-xl"
          >
            🛡️
          </div>

          <h3 class="mb-4 text-xl font-bold text-slate-900">Learn Safely</h3>

          <ul class="space-y-4 text-slate-600">
            <li class="flex gap-3">
              <span class="mt-1 text-green-500">✔</span>
              <span>
                Someone who's curious about crypto but wants to avoid scams and
                common mistakes.
              </span>
            </li>

            <li class="flex gap-3">
              <span class="mt-1 text-green-500">✔</span>
              <span>
                Someone looking for balanced information that explains both the
                benefits and the risks.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- ================= SECTION 10 ================= -->

    <div class="pt-20">
      <div class="flex items-end justify-between">
        <h2
          class="mt-4 text-center text-4xl font-bold text-slate-900 md:text-left"
        >
          Explore our guides
        </h2>

        <RouterLink
          to="/articles"
          class="hidden text-sm text-slate-600 md:block"
        >
          View all guides →
        </RouterLink>
      </div>

      <div
        class="mt-12 overflow-hidden rounded-xl border border-slate-200 bg-white md:grid md:grid-cols-2 lg:grid-cols-5"
      >
        <RouterLink
          v-for="card in learningCards"
          :key="card.title"
          :to="card.link || '#'"
          class="border-r border-b border-slate-200 p-8"
        >
          <p
            class="text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-orange-600 md:text-left"
          >
            {{ card.tag }}
          </p>

          <h3
            class="mt-5 text-center text-2xl font-bold text-slate-900 md:text-left"
          >
            {{ card.title }}
          </h3>

          <p class="mt-5 text-center leading-7 text-slate-600 md:text-left">
            {{ card.description }}
          </p>
        </RouterLink>
      </div>
    </div>

    <!-- ================= PROMISE ================= -->

    <div class="mt-16 rounded-2xl bg-[#edf8f7] p-10">
      <p
        class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-600"
      >
        OUR PROMISE TO YOU
      </p>

      <div class="mt-8 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
        <div class="flex items-start gap-3">
          <span class="text-green-700 text-lg">✓</span>
          <p class="text-slate-700 leading-7">
            We will never tell you a coin is
            <strong>"guaranteed"</strong>
            to go up.
          </p>
        </div>

        <div class="flex items-start gap-3">
          <span class="text-green-700 text-lg">✓</span>
          <p class="text-slate-700 leading-7">
            We will never accept payment to favor one exchange or coin.
          </p>
        </div>

        <div class="flex items-start gap-3">
          <span class="text-green-700 text-lg">✓</span>
          <p class="text-slate-700 leading-7">
            We will always show risks alongside benefits, every time.
          </p>
        </div>

        <div class="flex items-start gap-3">
          <span class="text-green-700 text-lg">✓</span>
          <p class="text-slate-700 leading-7">
            We will keep content dated and reviewed by credentialed people.
          </p>
        </div>
      </div>
      <div class="mt-10 rounded-xl border border-cyan-200 bg-white p-6">
        <h4 class="text-lg font-bold text-slate-900">
          EDUCATIONAL CONTENT — NOT FINANCIAL ADVICE
        </h4>

        <p class="mt-3 leading-7 text-slate-600">
          Everything on CryptoLearner is created to help you understand how
          cryptocurrency works. Nothing on this website should be considered
          investment, legal, or financial advice. Always do your own research
          and consult a qualified professional before making financial
          decisions.
        </p>
      </div>
    </div>
  </section>
</template>
