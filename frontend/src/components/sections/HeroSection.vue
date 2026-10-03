<script setup>
import { onMounted, onBeforeUnmount, ref, watch } from "vue";
import { gsap, SplitText } from "../../composables/gsapSetup";
import { createHeroScene } from "../../composables/useHeroScene";
import { hero } from "../../data/content";
import MagneticButton from "../ui/MagneticButton.vue";

// Intro plays on mount unless a parent (e.g. a preloader) holds it back with
// :start="false" and flips it later.
const props = defineProps({ start: { type: Boolean, default: true } });

const canvasEl = ref(null);
const eyebrowEl = ref(null);
const headingEl = ref(null);
const subtitleEl = ref(null);
const ctaEl = ref(null);
const scrollHintEl = ref(null);

let scene, headingSplit, subtitleSplit, introTl;
let splitReady = false;
let pendingStart = false;

onMounted(async () => {
  scene = createHeroScene(canvasEl.value);
  scene.start();

  gsap.set(eyebrowEl.value, { opacity: 0, y: 12 });
  gsap.set(ctaEl.value.children, { opacity: 0, y: 18 });
  gsap.set(scrollHintEl.value, { opacity: 0 });

  // Wait for web fonts before measuring line breaks, otherwise SplitText
  // commits to line groupings based on the fallback font and text can
  // look mis-wrapped once the real font swaps in.
  if (document.fonts?.ready) {
    await document.fonts.ready;
  }

  // Navigated away while fonts were loading: refs are already cleared.
  if (!headingEl.value) return;

  headingSplit = new SplitText(headingEl.value, {
    type: "chars,lines",
    linesClass: "split-line overflow-hidden",
  });
  subtitleSplit = new SplitText(subtitleEl.value, {
    type: "lines",
    linesClass: "split-line overflow-hidden",
  });

  gsap.set(headingSplit.chars, { yPercent: 110, opacity: 0 });
  gsap.set(subtitleSplit.lines, { yPercent: 110, opacity: 0 });

  splitReady = true;
  if (props.start || pendingStart) playIntro();
});

watch(
  () => props.start,
  (val) => {
    if (!val) return;
    if (splitReady) playIntro();
    else pendingStart = true;
  },
);

function playIntro() {
  introTl = gsap.timeline({ delay: 0.1 });
  introTl
    .to(eyebrowEl.value, { opacity: 1, y: 0, duration: 0.7 })
    .to(
      headingSplit.chars,
      {
        yPercent: 0,
        opacity: 1,
        duration: 1.1,
        stagger: 0.016,
        ease: "power4.out",
      },
      "-=0.4",
    )
    .to(
      subtitleSplit.lines,
      { yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.08 },
      "-=0.7",
    )
    .to(
      ctaEl.value.children,
      { opacity: 1, y: 0, duration: 0.7, stagger: 0.1 },
      "-=0.5",
    )
    .to(scrollHintEl.value, { opacity: 1, duration: 0.6 }, "-=0.3");
}

onBeforeUnmount(() => {
  introTl?.kill();
  scene?.destroy();
  headingSplit?.revert();
  subtitleSplit?.revert();
});
</script>

<template>
  <section
    class="relative overflow-hidden bg-white min-h-screen flex items-start px-6 pt-20 pb-16 sm:pt-24 md:pt-28 lg:min-h-screen lg:items-center lg:px-10"
  >
    <canvas
      ref="canvasEl"
      class="pointer-events-none absolute inset-0 h-full w-full opacity-80"
    ></canvas>

    <div
      class="pointer-events-none absolute left-1/2 top-[18%] h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-blue-500/[0.07] blur-[130px]"
    />
    <div
      class="pointer-events-none absolute bottom-0 right-0 h-[24rem] w-[24rem] rounded-full bg-cyan-400/[0.08] blur-[130px]"
    />

    <div
      class="relative z-10 mx-auto w-full max-w-7xl grid gap-16 pt-6 lg:pt-0 items-center lg:grid-cols-[1.1fr,0.9fr]"
    >
      <div>
        <p
          ref="eyebrowEl"
          class="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700"
        >
          <span class="h-1.5 w-1.5 rounded-full bg-blue-600" />
          {{ hero.eyebrow }}
        </p>

        <h1
          ref="headingEl"
          class="max-w-2xl font-display text-5xl font-bold leading-[1.08] tracking-tight text-black sm:text-6xl lg:text-7xl xl:text-[5.25rem]"
        >
          <span
            v-for="(line, i) in hero.heading"
            :key="line"
            class="block"
            :class="i > 0 && 'text-blue-600'"
            >{{ line }}</span
          >
        </h1>

        <p
          ref="subtitleEl"
          class="mt-8 max-w-2xl text-lg leading-relaxed text-gray-500"
        >
          {{ hero.subtitle }}
        </p>

        <div ref="ctaEl" class="mt-10 flex flex-wrap items-center gap-4">
          <MagneticButton data-cursor-hover>
            {{ hero.primaryCta }}
          </MagneticButton>
          <MagneticButton variant="ghost" data-cursor-hover class="text-black">
            {{ hero.secondaryCta }}
          </MagneticButton>
        </div>
      </div>
    </div>

    <div
      ref="scrollHintEl"
      class="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 text-xs text-gray-400"
    >
      <span class="tracking-wide">{{ hero.scrollHint }}</span>
      <span
        class="h-10 w-px animate-pulse bg-gradient-to-b from-gray-300 to-transparent"
      />
    </div>
  </section>
  <!-- Disclaimer -->
  <marquee
    behavior="scroll"
    direction="left"
    scrollamount="5"
    onmouseover="this.stop()"
    onmouseout="this.start()"
  >
    ⚠️ This website is for <b>educational purposes only.</b>
    We are not financial advisors. Always do your own research before investing
    in cryptocurrency.
  </marquee>
</template>
