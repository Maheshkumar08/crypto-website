<script setup>
import { useSeoMeta } from "../composables/useSeoMeta";
useSeoMeta({
  title: "Crypto Disclosures | Transparency & Important Information",
  description:
    "Explore Cryptolearner’s disclosures for important information about our content, crypto risks, educational resources, and transparency practices.",
  path: "/disclosures",
});
const disclosures = [
  {
    title: "Educational Purpose",
    content:
      "CryptoLearn is an educational platform created to help readers understand cryptocurrency, blockchain technology, digital assets, wallets, exchanges, taxes, and related topics. All content is provided solely for informational and educational purposes.",
  },
  {
    title: "No Financial Advice",
    content:
      "Nothing on this website should be considered financial, investment, legal, accounting, or tax advice. Our articles are designed to explain concepts—not recommend investments. Always consult a qualified professional before making financial decisions.",
  },
  {
    title: "Investment Risk",
    content:
      "Cryptocurrency markets are highly volatile. Digital assets can gain or lose significant value in a short period of time. Never invest money you cannot afford to lose, and always conduct your own research (DYOR).",
  },
  {
    title: "Editorial Independence",
    content:
      "Our educational content is researched and written independently. Opinions expressed in articles are intended to educate readers and are not influenced by advertisers or third parties.",
  },
  {
    title: "Accuracy of Information",
    content:
      "We strive to keep our content accurate and up to date. However, cryptocurrency regulations, technology, and market conditions change frequently. We cannot guarantee that every article reflects the latest developments at all times.",
  },
  {
    title: "Affiliate Disclosure",
    content:
      "Some pages on CryptoLearn may contain affiliate links. If you click on one of these links and make a purchase or sign up for a service, we may earn a small commission at no additional cost to you. These commissions help support our educational content and website maintenance.",
  },
  {
    title: "Sponsored Content",
    content:
      "If any article or page is sponsored by a third party, it will be clearly identified as sponsored content. Our editorial standards remain independent, and sponsorship does not influence the accuracy or objectivity of our educational materials.",
  },
  {
    title: "Advertising Disclosure",
    content:
      "CryptoLearn may display advertisements from trusted advertising partners. Advertisements are clearly distinguishable from editorial content and do not represent endorsements or recommendations.",
  },
  {
    title: "Third-Party Websites",
    content:
      "Our website may link to external websites, exchanges, wallets, or educational resources. We are not responsible for the content, privacy practices, products, or services offered by third-party websites. Please review their policies before using them.",
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
          Disclosures
        </span>

        <h1
          class="mt-6 text-4xl md:text-5xl font-bold text-slate-900 leading-tight font-['Space_Grotesk'] max-w-3xl"
        >
          Transparency
          <span class="text-sky-600">builds trust.</span>
        </h1>

        <p class="mt-6 text-lg text-slate-600 leading-8 max-w-3xl">
          We believe readers deserve complete transparency about how our
          educational content is created, funded, and maintained. This page
          explains our editorial standards, affiliate relationships, and
          important legal disclosures.
        </p>

        <div
          class="mt-8 inline-flex items-center gap-2 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200 px-4 py-1.5 text-sm font-semibold"
        >
          <span class="h-2 w-2 rounded-full bg-emerald-500"></span>
          Last Updated: September 2026
        </div>
      </div>
    </section>

    <!-- Content -->
    <section class="px-6 py-16 border-t border-sky-100">
      <div class="max-w-5xl mx-auto space-y-4">
        <article
          v-for="item in disclosures"
          :key="item.title"
          class="bg-white border border-sky-100 rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md hover:border-sky-300 transition-all duration-200"
        >
          <h2
            class="text-xl md:text-2xl font-semibold text-slate-900 font-['Space_Grotesk'] mb-3"
          >
            {{ item.title }}
          </h2>

          <p class="text-slate-600 leading-8">
            {{ item.content }}
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
            If you have any questions regarding our disclosures or editorial
            practices, please contact us.
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

        <!-- Transparency Commitment -->
        <div
          class="bg-amber-50 border-l-4 border-amber-500 rounded-r-xl p-6 md:p-8 text-amber-900"
        >
          <h3
            class="text-lg font-semibold text-amber-800 mb-3 font-['Space_Grotesk']"
          >
            Our Commitment to Transparency
          </h3>

          <p class="leading-8">
            At CryptoLearn, transparency is one of our core values. We clearly
            disclose affiliate relationships, sponsored content, and advertising
            practices so our readers can make informed decisions while using our
            educational resources.
          </p>
        </div>
      </div>
    </section>
  </main>
</template>
