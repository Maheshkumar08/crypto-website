<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import { formatDate } from "../../composables/text";
import { optimizedUrl } from "../../services/cloudinary";
import { prefetchRoute } from "../../composables/usePrefetch";
import { attachMagnetic } from "../../composables/useMagnetic";
import { revealMask } from "../../composables/useReveal";
import Badge from "../ui/Badge.vue";
import Avatar from "../ui/Avatar.vue";

const props = defineProps({
  post: { type: Object, required: true },
});

const imgEl = ref(null);
const ctaEl = ref(null);
let cleanupMagnetic = () => {};

onMounted(() => {
  if (imgEl.value)
    revealMask(imgEl.value, { trigger: imgEl.value, start: "top 80%" });
  cleanupMagnetic = attachMagnetic(ctaEl.value, {
    strength: 0.4,
    innerStrength: 0.6,
  });
});
onBeforeUnmount(() => cleanupMagnetic());
</script>

<template>
  <router-link
    :to="`/articles/${post.slug}`"
    data-cursor-hover
    class="group grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-10"
    @mouseenter="prefetchRoute('article-details')"
  >
    <div class="order-2 lg:order-1">
      <Badge color="cyan" variant="outline">Featured research</Badge>
      <h2
        class="mt-5 font-display text-3xl font-bold leading-[1.1] tracking-tight text-gray-900 transition-colors group-hover:text-blue-600 sm:text-4xl lg:text-5xl"
      >
        {{ post.title }}
      </h2>
      <p class="mt-5 max-w-lg text-base leading-relaxed text-gray-500">
        {{ post.description }}
      </p>

      <div class="mt-6 flex items-center gap-3 text-sm text-gray-400">
        <Avatar :name="post.author || 'cryptolearner.us'" size="sm" />
        <span class="font-medium text-gray-700">{{ post.author }}</span>
        <span>·</span>
        <span>{{ formatDate(post.createdAt) }}</span>
        <span>·</span>
        <span>{{ post.readingTime }} min read</span>
      </div>

      <span
        ref="ctaEl"
        class="relative mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-blue-600/20 transition-colors group-hover:bg-blue-700"
      >
        <span data-magnetic-inner class="flex items-center gap-2">
          Read the full story
          <svg
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            class="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
          >
            <path d="M4 10h12M11 5l5 5-5 5" />
          </svg>
        </span>
      </span>
    </div>

    <div
      class="order-1 aspect-[4/3] overflow-hidden rounded-3xl bg-slate-100 shadow-lift lg:order-2"
    >
      <img
        v-if="post.coverImage"
        ref="imgEl"
        :src="optimizedUrl(post.coverImage, { width: 900 })"
        :alt="post.title"
        class="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />
    </div>
  </router-link>
</template>
