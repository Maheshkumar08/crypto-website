<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from "vue";
import { gsap, ScrollTrigger } from "../composables/gsapSetup";

import { useSeoMeta, SITE_URL } from "../composables/useSeoMeta";

import HeroSection from "../components/sections/HeroSection.vue";
import CryptoBasics from "../components/sections/home/CryptoBasics.vue";
import BenefitsRisks from "../components/sections/home/BenefitsRisks.vue";

import ProsVsCons from "../components/sections/home/ProsVsCons.vue";
import StatsCounter from "../components/sections/StatsCounter.vue";
import SafetyChecklist from "../components/sections/home/SafetyChecklist.vue";
import AnimatedCards from "../components/sections/AnimatedCards.vue";
import TrustStrip from "../components/sections/home/TrustStrip.vue";
import FaqSection from "../components/sections/FaqSection.vue";
import ExplorePages from "../components/sections/home/ExplorePages.vue";

const bg = ref(null);
let ctx;

useSeoMeta({
  title: "Cryptolearner | Learn Crypto, Bitcoin, Blockchain & Web3",
  description:
    "Learn crypto with Cryptolearner through beginner-friendly guides on Cryptocurrency, Bitcoin, blockchain, Ethereum, Web3, NFTs, DeFi, and digital assets.",
  path: "/",
});

onMounted(async () => {
  await nextTick();

  // Each [data-bg-color] wrapper owns one solid color scene. A section's
  // "active range" runs from the moment its top edge crosses the viewport
  // center to the moment its bottom edge does — and because sections sit
  // flush against each other in the document, one section's bottom edge
  // is the exact same point as the next section's top edge. That makes
  // the ranges tile the scroll distance perfectly: no gaps, no overlap,
  // so exactly one section is ever "active" at a time. onToggle only
  // reacts when a section *becomes* active, in either scroll direction,
  // which is what drives the single fade to that section's color. Colors
  // are never scrubbed or blended — only ever crossfaded between two flat
  // values, and any in-flight fade is replaced (never stacked) by the next.
  //
  // Everything is created inside a gsap.context so it's reverted with the
  // page; otherwise these triggers outlive Home and keep firing against
  // detached nodes after navigating away.
  ctx = gsap.context(() => {
    const sections = gsap.utils.toArray("[data-bg-color]");
    let activeColor = sections[0]?.dataset.bgColor ?? "#ffffff";

    const activateColor = (color) => {
      if (color === activeColor) return;
      activeColor = color;
      gsap.to(bg.value, {
        backgroundColor: color,
        duration: 0.7,
        ease: "power2.inOut",
        overwrite: true,
      });
    };

    sections.forEach((section) => {
      ScrollTrigger.create({
        trigger: section,
        start: "top center",
        end: "bottom center",
        onToggle: (self) => {
          if (self.isActive) activateColor(section.dataset.bgColor);
        },
      });
    });
  });

  ScrollTrigger.refresh();
});

onBeforeUnmount(() => ctx?.revert());
</script>

<template>
  <!-- Fullscreen color-scene background: a single fixed layer behind every
       section. It always holds exactly one flat color — never a gradient
       or a blend of two. The [data-bg-color] wrappers below are the only
       thing that ever changes it, and only via the ScrollTrigger logic
       above; the sections themselves stay fully transparent so this layer
       is what the viewport actually shows. -->

  <div id="bg-layer" ref="bg" style="background-color: #ffffff"></div>

  <section data-bg-color="#ffffff">
    <HeroSection />
  </section>

  <section data-bg-color="#C1E1FB">
    <CryptoBasics />
  </section>

  <section data-bg-color="#D4C1FF">
    <BenefitsRisks />
  </section>

  <section data-bg-color="#F7E0D4">
    <ProsVsCons />
  </section>

  <section data-bg-color="#DBFBD2">
    <StatsCounter transparent />
  </section>

  <section data-bg-color="#FFF7E8">
    <SafetyChecklist />
  </section>

  <section data-bg-color="#F3E5FF">
    <AnimatedCards />
  </section>

  <section data-bg-color="#EEF5FF">
    <ExplorePages />
  </section>

  <section data-bg-color="#F5F8FC">
    <TrustStrip />
  </section>

  <section data-bg-color="#FFFFFF">
    <FaqSection />
  </section>
</template>

<style scoped>
#bg-layer {
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  will-change: background-color;
}
</style>
