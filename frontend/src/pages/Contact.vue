<script setup>
import { onMounted, ref } from "vue";
import {
  contactHero,
  contactFaqs,
  contactGetInTouch,
  contactClosing,
} from "../data/content";
import { useSeoMeta } from "../composables/useSeoMeta";
import { revealHeading, revealUp } from "../composables/useReveal";
import PageHero from "../components/sections/PageHero.vue";
import WhyWeStarted from "../components/sections/contact/WhyWeStarted.vue";
import ReviewProcess from "../components/sections/contact/ReviewProcess.vue";

import NeverDoList from "../components/sections/contact/NeverDoList.vue";
import CorrectionsNote from "../components/sections/contact/CorrectionsNote.vue";
import ContactInfoCards from "../components/sections/contact/ContactInfoCards.vue";
import ContactForm from "../components/sections/contact/ContactForm.vue";
import VisitPanel from "../components/sections/contact/VisitPanel.vue";
import FaqSection from "../components/sections/FaqSection.vue";

useSeoMeta({
  title: "Contact Cryptolearner | Crypto questions & Support",
  description:
    "Contact Cryptolearner for questions, feedback, suggestions, or support related to Bitcoin, blockchain, Ethereum, Web3, NFTs, and DeFi.",
  path: "/contact",
});

const getInTouchHeadingEl = ref(null);
const getInTouchSectionEl = ref(null);
const closingEl = ref(null);

onMounted(() => {
  revealHeading(getInTouchHeadingEl.value, {
    type: "words",
    trigger: getInTouchSectionEl.value,
    stagger: 0.03,
  });
  revealUp(closingEl.value, {
    trigger: closingEl.value,
    start: "top 90%",
    y: 16,
  });
});
</script>

<template>
  <PageHero
    :eyebrow="contactHero.eyebrow"
    :heading="contactHero.heading"
    :subtitle="contactHero.subtitle"
  />

  <WhyWeStarted />
  <ReviewProcess />

  <NeverDoList />
  <CorrectionsNote />

  <section
    ref="getInTouchSectionEl"
    class="relative mx-auto max-w-4xl px-6 pt-16 lg:px-10"
  >
    <h2
      ref="getInTouchHeadingEl"
      class="font-display text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl"
    >
      {{ contactGetInTouch.heading }}
    </h2>
    <p class="mt-4 max-w-2xl text-lg text-gray-500">
      {{ contactGetInTouch.intro }}
    </p>
  </section>

  <ContactInfoCards />

  <section class="relative mx-auto max-w-7xl px-6 pb-8 lg:px-10">
    <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <ContactForm />
      <VisitPanel />
    </div>
  </section>

  <p
    class="mx-auto max-w-4xl px-6 pb-16 text-center text-xs font-medium text-amber-700 lg:px-10"
  >
    {{ contactGetInTouch.safetyNote }}
  </p>

  <FaqSection
    :faqs="contactFaqs"
    eyebrow="Common questions"
    heading="A few things people usually ask."
    section-id="contact-faq"
  />

  <section class="border-y border-slate-200 bg-blue-50/50 px-6 py-20 lg:px-10">
    <p
      ref="closingEl"
      class="mx-auto max-w-3xl text-center text-lg italic leading-8 text-gray-700"
    >
      {{ contactClosing.text }}
    </p>
  </section>
</template>
