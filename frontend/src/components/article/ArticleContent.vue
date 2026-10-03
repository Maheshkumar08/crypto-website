<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { sanitizeArticleHtml } from '../../composables/sanitizeArticleHtml'
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import python from 'highlight.js/lib/languages/python'
import bash from 'highlight.js/lib/languages/bash'
import json from 'highlight.js/lib/languages/json'
import xml from 'highlight.js/lib/languages/xml'
import css from 'highlight.js/lib/languages/css'
import sql from 'highlight.js/lib/languages/sql'
import 'highlight.js/styles/atom-one-dark.css'
import { gsap } from '../../composables/gsapSetup'

// Only the languages a crypto-education blog is likely to show, rather than
// the ~190-language default bundle, keeps this route's chunk lean.
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('python', python)
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('json', json)
hljs.registerLanguage('xml', xml)
hljs.registerLanguage('css', css)
hljs.registerLanguage('sql', sql)

const props = defineProps({
  html: { type: String, default: '' },
})

// Sanitized independently of whatever the caller already did — a component
// that renders arbitrary HTML via v-html should never assume an upstream
// step remembered to sanitize it first.
const sanitizedHtml = computed(() => sanitizeArticleHtml(props.html))

const contentEl = ref(null)
const zoomSrc = ref('')
const zoomAlt = ref('')

let triggers = []

function clearTriggers() {
  triggers.forEach((t) => t.kill())
  triggers = []
}

function enhance() {
  const root = contentEl.value
  if (!root) return

  // Syntax-highlight every code block (Tiptap's plain <pre><code> output
  // carries no language class, so hljs falls back to auto-detection).
  root.querySelectorAll('pre code').forEach((block) => {
    if (!block.dataset.highlighted) hljs.highlightElement(block)
  })

  // Wrap bare content images in a responsive, captioned, zoomable figure —
  // the editor stores plain <img> tags, so captions are derived from alt text.
  root.querySelectorAll('img').forEach((img) => {
    if (img.closest('figure') || img.closest('.content-gallery')) return
    const figure = document.createElement('figure')
    img.classList.add('cursor-zoom-in', 'transition-transform', 'duration-500', 'hover:scale-[1.01]')
    img.parentNode.insertBefore(figure, img)
    figure.appendChild(img)

    const caption = img.getAttribute('alt')
    if (caption) {
      const figcaption = document.createElement('figcaption')
      figcaption.textContent = caption
      figure.appendChild(figcaption)
    }
  })

  // Tables scroll horizontally on narrow screens instead of overflowing or
  // squashing columns unreadably.
  root.querySelectorAll('table').forEach((table) => {
    if (table.closest('.table-scroll')) return
    const wrapper = document.createElement('div')
    wrapper.className = 'table-scroll'
    table.parentNode.insertBefore(wrapper, table)
    wrapper.appendChild(table)
  })

  // Fade+lift every top-level block in as it scrolls into view.
  clearTriggers()
  Array.from(root.children).forEach((el) => {
    gsap.set(el, { opacity: 0, y: 26 })
    const tween = gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 92%',
        toggleActions: 'play none none reverse',
      },
    })
    if (tween.scrollTrigger) triggers.push(tween.scrollTrigger)
  })
}

function onContentClick(e) {
  const img = e.target.closest('img')
  if (!img || !contentEl.value?.contains(img)) return
  zoomSrc.value = img.currentSrc || img.src
  zoomAlt.value = img.getAttribute('alt') || ''
}

function closeZoom() {
  zoomSrc.value = ''
}

function onKeydown(e) {
  if (e.key === 'Escape') closeZoom()
}

watch(
  sanitizedHtml,
  async () => {
    await nextTick()
    enhance()
  },
  { immediate: true }
)

window.addEventListener('keydown', onKeydown)
onBeforeUnmount(() => {
  clearTriggers()
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <div
    ref="contentEl"
    class="article-content"
    v-html="sanitizedHtml"
    @click="onContentClick"
  />

  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="zoomSrc"
        class="fixed inset-0 z-[100] flex items-center justify-center bg-gray-950/90 p-6 backdrop-blur-sm"
        @click="closeZoom"
      >
        <button
          type="button"
          class="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          aria-label="Close"
          @click.stop="closeZoom"
        >
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" class="h-5 w-5"><path d="m5 5 10 10M15 5 5 15" /></svg>
        </button>
        <figure class="max-h-full max-w-5xl">
          <img :src="zoomSrc" :alt="zoomAlt" class="max-h-[85vh] w-auto rounded-2xl object-contain shadow-lift" @click.stop />
          <figcaption v-if="zoomAlt" class="mt-4 text-center text-sm text-white/60">{{ zoomAlt }}</figcaption>
        </figure>
      </div>
    </Transition>
  </Teleport>
</template>
