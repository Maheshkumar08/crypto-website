<script setup>
import { computed, ref } from "vue";

const props = defineProps({
  title: { type: String, required: true },
  url: { type: String, required: true },
});

const copied = ref(false);

const links = computed(() => {
  const u = encodeURIComponent(props.url);
  const t = encodeURIComponent(props.title);
  return [
    {
      id: "x",
      label: "Share on X",
      href: `https://twitter.com/intent/tweet?url=${u}&text=${t}`,
    },
    {
      id: "linkedin",
      label: "Share on LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`,
    },
    {
      id: "facebook",
      label: "Share on Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${u}`,
    },
  ];
});

async function copyLink() {
  try {
    await navigator.clipboard.writeText(props.url);
    copied.value = true;
    setTimeout(() => (copied.value = false), 1800);
  } catch {
    /* clipboard unavailable — ignore silently */
  }
}
</script>

<template>
  <div class="flex flex-wrap items-center gap-2.5">
    <a
      v-for="link in links"
      :key="link.id"
      :href="link.href"
      target="_blank"
      rel="noopener noreferrer"
      :aria-label="link.label"
      :title="link.label"
      data-cursor-hover
      class="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-gray-500 transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 hover:text-gray-900"
    >
      <svg
        v-if="link.id === 'x'"
        viewBox="0 0 24 24"
        class="h-4 w-4"
        fill="currentColor"
      >
        <path
          d="M18.3 2H21l-6.7 7.6L22.2 22h-6.9l-5.4-6.9L3.7 22H1l7.2-8.2L1.1 2h7l4.9 6.3L18.3 2Zm-1.2 18h1.9L7 4H5l12.1 16Z"
        />
      </svg>
      <svg
        v-else-if="link.id === 'linkedin'"
        viewBox="0 0 24 24"
        class="h-4 w-4"
        fill="currentColor"
      >
        <path
          d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-1 1.83-2.1 3.76-2.1 4.02 0 4.76 2.6 4.76 6V21h-4v-5.5c0-1.3-.02-3-1.83-3-1.83 0-2.1 1.4-2.1 2.9V21h-4V9Z"
        />
      </svg>
      <svg v-else viewBox="0 0 24 24" class="h-4 w-4" fill="currentColor">
        <path
          d="M13.5 22v-8h2.7l.4-3.2h-3.1V8.7c0-.9.25-1.6 1.6-1.6h1.7V4.2C16.5 4.1 15.4 4 14.2 4c-2.6 0-4.4 1.6-4.4 4.5v2.3H7v3.2h2.8v8h3.7Z"
        />
      </svg>
    </a>
  </div>
</template>
