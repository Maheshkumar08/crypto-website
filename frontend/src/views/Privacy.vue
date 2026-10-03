<script setup>
import { useSeoMeta } from "../composables/useSeoMeta";
useSeoMeta({
  title: "Privacy Policy | Cryptolearner",
  description:
    "Read the Cryptolearner Privacy Policy to learn how we collect, use, protect, and manage information when you visit and use our website.",
  path: "/privacy",
});
const sections = [
  {
    title: "Information We Collect",
    content:
      "We may collect personal information such as your name and email address when you contact us, subscribe to updates, or interact with our website. We also collect non-personal information including browser type, device information, IP address, and analytics data to improve our services.",
  },
  {
    title: "How We Use Your Information",
    content:
      "Your information is used to respond to inquiries, improve website performance, analyze visitor behavior, provide educational content, and maintain website security. We never sell your personal information.",
  },
  {
    title: "Cookies & Analytics",
    content:
      "CryptoLearn uses cookies and analytics tools to understand how visitors use the website. These technologies help us improve user experience and website performance.",
  },
  {
    title: "Third-Party Services",
    content:
      "We may use trusted third-party services such as Google Analytics or other tools that process limited information according to their own privacy policies.",
  },
  {
    title: "Data Security",
    content:
      "We implement reasonable technical and organizational measures to protect your information. However, no internet transmission or storage system is completely secure.",
  },
  {
    title: "Your Rights",
    content:
      "Depending on your location, you may have the right to request access, correction, or deletion of your personal information. Contact us if you wish to exercise these rights.",
  },
  {
    title: "Children's Privacy",
    content:
      "CryptoLearn is intended for general educational purposes and is not directed toward children under the age of 13. We do not knowingly collect personal information from children. If you believe a child has provided personal information, please contact us so we can remove the information promptly.",
  },
  {
    title: "Changes to This Privacy Policy",
    content:
      "We may update this Privacy Policy periodically to reflect changes in our services, legal requirements, or privacy practices. Any updates will be posted on this page along with the revised effective date.",
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
          Privacy Policy
        </span>

        <h1
          class="mt-6 text-4xl md:text-5xl font-bold text-slate-900 leading-tight font-['Space_Grotesk'] max-w-3xl"
        >
          Your privacy
          <span class="text-sky-600">matters to us.</span>
        </h1>

        <p class="mt-6 text-lg text-slate-600 leading-8 max-w-3xl">
          At CryptoLearn, we value transparency. This Privacy Policy explains
          what information we collect, how we use it, and how we protect your
          data while you explore our educational cryptocurrency content.
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
          v-for="section in sections"
          :key="section.title"
          class="group bg-white border border-sky-100 rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md hover:border-sky-300 transition-all duration-200"
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
            Contact Information
          </h2>

          <p class="text-slate-600 leading-8 mb-6">
            If you have any questions regarding this Privacy Policy or your
            personal information, feel free to contact us.
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
            Transparency Commitment
          </h3>

          <p class="leading-8">
            CryptoLearn is an educational platform. We respect your privacy and
            are committed to protecting your personal information. We do not
            sell user data, and we only collect information necessary to improve
            our educational content and website experience.
          </p>
        </div>
      </div>
    </section>
  </main>
</template>
