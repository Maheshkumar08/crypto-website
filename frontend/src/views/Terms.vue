<script setup>
import { useSeoMeta } from "../composables/useSeoMeta";
useSeoMeta({
  title: "Crypto Glossary | Crypto Terms & Definitions",
  description:
    "Explore the Cryptolearner glossary to understand crypto terms and definitions, from Bitcoin and blockchain to Web3, DeFi, NFTs, wallets, and more.",
  path: "/terms",
});
const sections = [
  {
    title: "Acceptance of Terms",
    content:
      "By accessing and using CryptoLearn, you agree to be bound by these Terms of Use. If you do not agree with any part of these terms, you should discontinue using the website immediately.",
  },
  {
    title: "Educational Purpose",
    content:
      "CryptoLearn provides educational content about cryptocurrency, blockchain technology, wallets, exchanges, taxes, and related topics. All information is intended for learning purposes only and should not be considered financial, investment, legal, or tax advice.",
  },
  {
    title: "No Financial Advice",
    content:
      "Nothing published on CryptoLearn constitutes professional financial advice. Always conduct your own research (DYOR) and consult a qualified financial advisor before making investment decisions.",
  },
  {
    title: "User Responsibilities",
    content:
      "You agree to use this website responsibly and lawfully. You may not misuse the website, attempt unauthorized access, distribute malicious software, or interfere with website operations.",
  },
  {
    title: "Accuracy of Information",
    content:
      "While we strive to keep all educational content accurate and up to date, cryptocurrency regulations, markets, and technologies change rapidly. We cannot guarantee that all information is always complete, current, or error-free.",
  },
  {
    title: "Intellectual Property",
    content:
      "All content on CryptoLearn, including articles, graphics, branding, logos, and educational materials, is owned by or licensed to CryptoLearn. You may view and share our content for personal, non-commercial purposes, but you may not copy, reproduce, modify, or redistribute it without prior written permission.",
  },
  {
    title: "Third-Party Links",
    content:
      "Our website may include links to third-party websites for additional educational resources. We are not responsible for the content, privacy practices, security, or availability of external websites. Visiting third-party websites is at your own risk.",
  },
  {
    title: "Limitation of Liability",
    content:
      "CryptoLearn and its contributors shall not be liable for any direct, indirect, incidental, consequential, or financial losses arising from the use of this website or reliance on any information published here. All investment decisions remain solely your responsibility.",
  },
  {
    title: "Changes to These Terms",
    content:
      "We reserve the right to modify these Terms at any time. Updated versions will be published on this page with a revised effective date. Continued use of CryptoLearn after changes indicates your acceptance of the updated Terms.",
  },
  {
    title: "Governing Law",
    content:
      "These Terms shall be governed and interpreted in accordance with the applicable laws of the jurisdiction in which CryptoLearn operates, without regard to conflict of law principles.",
  },
];
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
          Terms of Use
        </span>

        <h1
          class="mt-6 text-4xl md:text-5xl font-bold text-slate-900 leading-tight font-['Space_Grotesk'] max-w-3xl"
        >
          Terms &amp;
          <span class="text-sky-600">Conditions.</span>
        </h1>

        <p class="mt-6 text-lg text-slate-600 leading-8 max-w-3xl">
          These Terms govern your access to and use of CryptoLearn. By using
          this website, you agree to comply with these conditions and our
          Privacy Policy.
        </p>

        <div
          class="mt-8 inline-flex items-center gap-2 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200 px-4 py-1.5 text-sm font-semibold"
        >
          <span class="h-2 w-2 rounded-full bg-emerald-500"></span>
          Effective Date: September 2026
        </div>
      </div>
    </section>

    <!-- Content -->
    <section class="px-6 py-16 border-t border-sky-100">
      <div class="max-w-5xl mx-auto space-y-4">
        <article
          v-for="section in sections"
          :key="section.title"
          class="bg-white border border-sky-100 rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md hover:border-sky-300 transition-all duration-200"
        >
          <h2
            class="text-xl md:text-2xl font-semibold text-slate-900 font-['Space_Grotesk'] mb-3"
          >
            {{ section.title }}
          </h2>

          <p class="text-slate-600 leading-8">
            {{ section.content }}
          </p>
        </article>

        <!-- Contact Information -->
        <article
          class="bg-white border border-sky-100 rounded-2xl p-6 md:p-8 shadow-sm"
        >
          <h2
            class="text-xl md:text-2xl font-semibold text-slate-900 font-['Space_Grotesk'] mb-3"
          >
            Contact Us
          </h2>

          <p class="text-slate-600 leading-8 mb-6">
            If you have any questions regarding these Terms, please contact us.
          </p>

          <div class="grid md:grid-cols-2 gap-4">
            <div
              class="rounded-xl bg-sky-50 border border-sky-100 p-5 hover:border-sky-300 transition-colors"
            >
              <h3
                class="font-semibold text-slate-900 mb-1 text-sm uppercase tracking-wider"
              >
                Email
              </h3>
              <p class="text-sky-700 font-medium">support@cryptolearner.us</p>
            </div>

            <div
              class="rounded-xl bg-sky-50 border border-sky-100 p-5 hover:border-sky-300 transition-colors"
            >
              <h3
                class="font-semibold text-slate-900 mb-1 text-sm uppercase tracking-wider"
              >
                Website
              </h3>
              <p class="text-sky-700 font-medium">
                https://www.cryptolearner.us
              </p>
            </div>
          </div>
        </article>

        <!-- Educational Disclaimer -->
        <div
          class="bg-amber-50 border-l-4 border-amber-500 rounded-r-xl p-6 md:p-8 text-amber-900"
        >
          <h3
            class="text-lg font-semibold text-amber-800 mb-3 font-['Space_Grotesk']"
          >
            Educational Disclaimer
          </h3>

          <p class="leading-8">
            CryptoLearn exists to simplify cryptocurrency education. Nothing on
            this website should be interpreted as financial, legal, investment,
            or tax advice. Always perform your own research and consult licensed
            professionals before making financial decisions.
          </p>
        </div>
      </div>
    </section>
  </main>
</template>
