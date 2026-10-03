<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import { gsap, SplitText } from "../../composables/gsapSetup";

defineProps({
  eyebrow: { type: String, default: "" },
  heading: { type: String, required: true },
  subtitle: { type: String, default: "" },
});

const eyebrowEl = ref(null);
const headingEl = ref(null);
const subtitleEl = ref(null);

let headingSplit;

onMounted(async () => {
  gsap.set(eyebrowEl.value, { opacity: 0, y: 12 });
  gsap.set(subtitleEl.value, { opacity: 0, y: 16 });

  if (document.fonts?.ready) {
    await document.fonts.ready;
  }

  headingSplit = new SplitText(headingEl.value, {
    type: "chars,lines",
    linesClass: "split-line overflow-hidden",
  });
  gsap.set(headingSplit.chars, { yPercent: 110, opacity: 0 });

  const tl = gsap.timeline({ delay: 0.1 });
  tl.to(eyebrowEl.value, { opacity: 1, y: 0, duration: 0.7 })
    .to(
      headingSplit.chars,
      {
        yPercent: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.014,
        ease: "power4.out",
      },
      "-=0.4",
    )
    .to(subtitleEl.value, { opacity: 1, y: 0, duration: 0.8 }, "-=0.6");
});

onBeforeUnmount(() => headingSplit?.revert());
</script>

<template>
  <section
    class="relative overflow-hidden px-6 pb-20 pt-40 lg:px-10 lg:pb-28 lg:pt-48"
  >
    <div
      class="pointer-events-none absolute left-1/2 top-0 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-blue-500/[0.06] blur-[130px]"
    />

    <div class="relative mx-auto max-w-3xl text-center">
      <p
        v-if="eyebrow"
        ref="eyebrowEl"
        class="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700"
      >
        <span class="h-1.5 w-1.5 rounded-full bg-blue-600" />
        {{ eyebrow }}
      </p>

      <h1
        ref="headingEl"
        class="font-display text-4xl font-bold leading-[1.1] tracking-tight text-gray-900 sm:text-5xl lg:text-6xl"
      >
        {{ heading }}
      </h1>

      <p
        v-if="subtitle"
        ref="subtitleEl"
        class="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-black"
      >
        {{ subtitle }}
      </p>
    </div>
  </section>
</template>
