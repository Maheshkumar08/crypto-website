<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  title: { type: String, required: true },
  url: { type: String, required: true },
  vertical: { type: Boolean, default: false },
})

const copied = ref(false)

const links = computed(() => {
  const u = encodeURIComponent(props.url)
  const t = encodeURIComponent(props.title)
  return [
    { label: 'X', href: `https://twitter.com/intent/tweet?url=${u}&text=${t}` },
    { label: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}` },
    { label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${u}` },
  ]
})

async function copyLink() {
  try {
    await navigator.clipboard.writeText(props.url)
    copied.value = true
    setTimeout(() => (copied.value = false), 1800)
  } catch {
    /* clipboard unavailable — ignore silently */
  }
}
</script>

<template>
  <div v-if="!vertical" class="flex flex-wrap items-center gap-2">
    <a
      v-for="link in links"
      :key="link.label"
      :href="link.href"
      target="_blank"
      rel="noopener noreferrer"
      data-cursor-hover
      class="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-gray-600 transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:text-gray-900 hover:shadow-soft"
    >
      {{ link.label }}
    </a>
    <button
      type="button"
      data-cursor-hover
      class="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-gray-600 transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:text-gray-900 hover:shadow-soft"
      @click="copyLink"
    >
      {{ copied ? 'Copied!' : 'Copy link' }}
    </button>
  </div>

  <div v-else class="flex flex-col items-center gap-2">
    <a
      v-for="link in links"
      :key="link.label"
      :href="link.href"
      target="_blank"
      rel="noopener noreferrer"
      data-cursor-hover
      :title="`Share on ${link.label}`"
      class="flex h-9 w-9 items-center justify-center rounded-xl text-xs font-semibold text-gray-500 transition-all duration-300 hover:scale-110 hover:bg-slate-100 hover:text-gray-900"
    >
      {{ link.label[0] }}
    </a>
    <button
      type="button"
      data-cursor-hover
      title="Copy link"
      class="flex h-9 w-9 items-center justify-center rounded-xl text-gray-500 transition-all duration-300 hover:scale-110 hover:bg-slate-100 hover:text-gray-900"
      @click="copyLink"
    >
      <svg v-if="!copied" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" class="h-4 w-4">
        <rect x="7" y="7" width="10" height="10" rx="2" />
        <path d="M4 13V5a2 2 0 0 1 2-2h8" />
      </svg>
      <svg v-else viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" class="h-4 w-4 text-cyan-600">
        <path d="M4 10.5 8 14l8-8" />
      </svg>
    </button>
  </div>
</template>
