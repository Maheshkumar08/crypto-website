<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { gsap, SplitText, ScrollTrigger } from "../../composables/gsapSetup";
import { formatDate } from "../../composables/text";
import { optimizedUrl } from "../../services/cloudinary";
import { prefetchRoute } from "../../composables/usePrefetch";
import { attachTilt } from "../../composables/useTilt";
import Badge from "../ui/Badge.vue";
import Avatar from "../ui/Avatar.vue";
import MagneticButton from "../ui/MagneticButton.vue";

const props = defineProps({
  post: { type: Object, default: null },
  kicker: { type: String, default: "" },
  fallbackHeading: { type: String, required: true },
  fallbackSubtitle: { type: String, default: "" },
  stats: { type: Array, default: () => [] },
});

const sectionEl = ref(null);
const coverEl = ref(null);
const kickerEl = ref(null);
const badgeEl = ref(null);
const headingEl = ref(null);
const subtitleEl = ref(null);
const metaEl = ref(null);
const ctaEl = ref(null);
const statsEl = ref(null);

let headingSplit;
let cleanupTilt = () => {};
let scrollTween;

function killScroll() {
  scrollTween?.scrollTrigger?.kill();
  scrollTween?.kill();
}

async function playIntro() {
  if (document.fonts?.ready) await document.fonts.ready;
  await nextTick();

  headingSplit?.revert();
  gsap.set(
    [
      kickerEl.value,
      badgeEl.value,
      subtitleEl.value,
      metaEl.value,
      ctaEl.value,
    ],
    { opacity: 0, y: 18 },
  );

  if (headingEl.value) {
    headingSplit = new SplitText(headingEl.value, {
      type: "lines",
      linesClass: "split-line overflow-hidden",
    });
    gsap.set(headingSplit.lines, { yPercent: 115, opacity: 0 });
  }

  if (coverEl.value) {
    gsap.set(coverEl.value, { clipPath: "inset(0% 0% 100% 0%)", scale: 1.12 });
  }

  const tl = gsap.timeline({ delay: 0.05 });
  tl.to(
    coverEl.value,
    {
      clipPath: "inset(0% 0% 0% 0%)",
      scale: 1,
      duration: 1.4,
      ease: "power4.out",
    },
    0,
  )
    .to(kickerEl.value, { opacity: 1, y: 0, duration: 0.6 }, 0.15)
    .to(badgeEl.value, { opacity: 1, y: 0, duration: 0.6 }, 0.28)
    .to(
      headingSplit?.lines || [],
      {
        yPercent: 0,
        opacity: 1,
        duration: 1.1,
        stagger: 0.09,
        ease: "power4.out",
      },
      0.35,
    )
    .to(subtitleEl.value, { opacity: 1, y: 0, duration: 0.7 }, "-=0.6")
    .to(metaEl.value, { opacity: 1, y: 0, duration: 0.6 }, "-=0.5")
    .to(ctaEl.value, { opacity: 1, y: 0, duration: 0.6 }, "-=0.5")
    .to(
      statsEl.value?.children || [],
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.08 },
      "-=0.4",
    );

  if (coverEl.value) {
    killScroll();
    scrollTween = gsap.to(coverEl.value, {
      yPercent: 12,
      ease: "none",
      scrollTrigger: {
        trigger: sectionEl.value,
        start: "top top",
        end: "bottom top",
        scrub: 0.6,
      },
    });
  }
}

onMounted(() => {
  gsap.set(statsEl.value?.children || [], { opacity: 0, y: 16 });
  playIntro();
  cleanupTilt = attachTilt(coverEl.value, { max: 2.5 });
});

watch(
  () => props.post?.id,
  async (id, prevId) => {
    if (!id || id === prevId) return;
    await playIntro();
  },
);

onBeforeUnmount(() => {
  headingSplit?.revert();
  cleanupTilt();
  killScroll();
});
</script>

<template>
  <section
    ref="sectionEl"
    class="relative isolate min-h-[88vh] overflow-hidden bg-gray-950 pt-28"
  >
    <div class="absolute inset-0">
      <img
        v-if="post?.coverImage"
        ref="coverEl"
        :src="optimizedUrl(post.coverImage, { width: 1600 })"
        :alt="post.title"
        fetchpriority="high"
        class="h-full w-full scale-110 object-cover"
      />
      <div
        v-else
        ref="coverEl"
        class="h-full w-full scale-110 bg-[radial-gradient(60%_60%_at_20%_20%,rgba(37,99,235,0.35),transparent_60%),radial-gradient(50%_60%_at_85%_75%,rgba(6,182,212,0.3),transparent_60%)]"
      />
      <div
        class="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/55 to-gray-950/20"
      />
      <div
        class="absolute inset-0 bg-gradient-to-b from-gray-950/70 via-transparent to-transparent"
      />
    </div>

    <div
      class="relative flex min-h-[88vh] flex-col justify-between px-6 pb-14 lg:px-10"
    >
      <p
        ref="kickerEl"
        class="text-xs font-semibold uppercase tracking-[0.3em] text-white/60"
      >
        {{ kicker }}
      </p>

      <div class="mx-auto w-full max-w-5xl">
        <template v-if="post">
          <span ref="badgeEl"
            ><Badge v-if="post.category" color="white" variant="soft">{{
              post.category
            }}</Badge></span
          >

          <h1
            ref="headingEl"
            class="mt-6 font-display text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-[5.25rem]"
          >
            {{ post.title }}
          </h1>

          <p
            v-if="post.description"
            ref="subtitleEl"
            class="mt-6 max-w-2xl text-lg leading-relaxed text-white/70"
          >
            {{ post.description }}
          </p>

          <div
            ref="metaEl"
            class="mt-8 flex flex-wrap items-center gap-4 text-sm text-white/70"
          >
            <div class="flex items-center gap-3">
              <Avatar :name="post.author || 'cryptolearner.us'" size="sm" />
              <span class="font-medium text-white">{{ post.author }}</span>
            </div>
            <span class="h-1 w-1 rounded-full bg-white/40" />
            <span>{{ formatDate(post.createdAt) }}</span>
            <span class="h-1 w-1 rounded-full bg-white/40" />
            <span>{{ post.readingTime }} min read</span>
            <template v-if="post.views">
              <span class="h-1 w-1 rounded-full bg-white/40" />
              <span>{{ post.views.toLocaleString() }} views</span>
            </template>
          </div>

          <div ref="ctaEl" class="mt-9">
            <MagneticButton
              as="router-link"
              :to="`/blog/${post.slug}`"
              data-cursor-hover
              @mouseenter="prefetchRoute('blog-details')"
            >
              Read the full story
              <svg
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                class="h-4 w-4"
              >
                <path d="M4 10h12M11 5l5 5-5 5" />
              </svg>
            </MagneticButton>
          </div>
        </template>

        <template v-else>
          <h1
            ref="headingEl"
            class="font-display text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl"
          >
            {{ fallbackHeading }}
          </h1>
          <p
            v-if="fallbackSubtitle"
            ref="subtitleEl"
            class="mt-6 max-w-xl text-lg leading-relaxed text-white/70"
          >
            {{ fallbackSubtitle }}
          </p>
        </template>
      </div>

      <div
        v-if="stats.length"
        ref="statsEl"
        class="flex flex-wrap items-center gap-x-10 gap-y-4"
      >
        <div v-for="stat in stats" :key="stat.label">
          <p class="font-display text-2xl font-bold text-white sm:text-3xl">
            {{ stat.value }}
          </p>
          <p
            class="mt-1 text-xs font-medium uppercase tracking-wide text-white/50"
          >
            {{ stat.label }}
          </p>
        </div>
      </div>
      <div v-else class="h-1" />
    </div>
  </section>
</template>
