<script setup>
import { aboutHero, aboutStats, aboutCta } from "../data/content";
import { useSeoMeta } from "../composables/useSeoMeta";
import PageHero from "../components/sections/PageHero.vue";
import CompanyStory from "../components/sections/about/CompanyStory.vue";
import EditorialProcess from "../components/sections/about/EditorialProcess.vue";

import NeverList from "../components/sections/about/NeverList.vue";

import CorrectionsPolicy from "../components/sections/about/CorrectionsPolicy.vue";
import AboutContactOptions from "../components/sections/about/AboutContactOptions.vue";
import ClosingQuote from "../components/sections/about/ClosingQuote.vue";
import CtaBanner from "../components/sections/CtaBanner.vue";

useSeoMeta({
  title: "About Cryptolearner | Simple Crypto Education",
  description:
    "Learn about Cryptolearner and our mission to make Bitcoin, blockchain, Web3, Ethereum, NFTs, and DeFi easier to understand for everyone.",
  path: "/about",
});
</script>

<template>
  <PageHero
    :eyebrow="aboutHero.eyebrow"
    :heading="aboutHero.heading"
    :subtitle="aboutHero.subtitle"
  />
  <CompanyStory />
  <EditorialProcess />

  <NeverList />

  <CorrectionsPolicy />
  <AboutContactOptions />
  <ClosingQuote />
</template>
