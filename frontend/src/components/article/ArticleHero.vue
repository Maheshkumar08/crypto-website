<script setup>
import { computed, nextTick, onMounted, ref } from "vue";
import { gsap } from "../../composables/gsapSetup";
import { revealHeading } from "../../composables/useReveal";
import { formatDate, slugify } from "../../composables/text";
import { optimizedUrl } from "../../services/cloudinary";
import CategoryChip from "../sections/blog/CategoryChip.vue";
import AuthorAvatar from "../sections/blog/AuthorAvatar.vue";

const props = defineProps({
  post: { type: Object, required: true },
  basePath: { type: String, required: true },
  listLabel: { type: String, default: "Blog" },
});

const DIFFICULTY_STYLES = {
  Beginner: "bg-emerald-50 text-emerald-700",
  Intermediate: "bg-amber-50 text-amber-700",
  Advanced: "bg-rose-50 text-rose-700",
};

const difficultyClass = computed(
  () =>
    DIFFICULTY_STYLES[props.post.difficulty] || "bg-slate-100 text-gray-500",
);

const introEl = ref(null);
const titleEl = ref(null);
const metaEl = ref(null);
const imageEl = ref(null);

onMounted(async () => {
  await nextTick();

  gsap.set(introEl.value, { opacity: 0, y: 16 });
  gsap.set(metaEl.value, { opacity: 0, y: 14 });
  if (imageEl.value) gsap.set(imageEl.value, { opacity: 0, scale: 1.12 });

  const tl = gsap.timeline({ delay: 0.05 });
  tl.to(introEl.value, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" });
  revealHeading(titleEl.value, {
    type: "words",
    trigger: titleEl.value,
    start: "top 98%",
    stagger: 0.035,
    delay: 0.15,
  });
  tl.to(
    metaEl.value,
    { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" },
    "-=0.15",
  );
  if (imageEl.value)
    tl.to(
      imageEl.value,
      { opacity: 1, scale: 1, duration: 1.15, ease: "power4.out" },
      "-=0.25",
    );
});
</script>

<template>
  <header class="bg-white pt-8 sm:pt-10">
    <div class="mx-auto max-w-3xl px-6 text-center lg:px-10">
      <div ref="introEl">
        <div class="flex flex-wrap items-center justify-center gap-2">
          <router-link
            v-if="post.category"
            :to="`/category/${slugify(post.category)}`"
          >
            <CategoryChip :label="post.category" />
          </router-link>
          <span
            v-if="post.difficulty"
            class="inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold"
            :class="difficultyClass"
          >
            {{ post.difficulty }}
          </span>
        </div>
      </div>

      <h1
        ref="titleEl"
        class="mx-auto mt-6 max-w-3xl font-display text-3xl font-bold leading-[1.15] tracking-tight text-gray-900 sm:text-4xl lg:text-[2.75rem]"
      >
        {{ post.title }}
      </h1>

      
    </div>

    <div v-if="post.coverImage" class="mx-auto mt-10 max-w-6xl px-6 lg:px-10">
      <div class="overflow-hidden rounded-[2rem] shadow-lift">
        <img
          ref="imageEl"
          :src="optimizedUrl(post.coverImage, { width: 1600 })"
          :alt="post.title"
          fetchpriority="high"
          class="aspect-video w-full object-cover"
        />
      </div>
    </div>
  </header>
</template>
