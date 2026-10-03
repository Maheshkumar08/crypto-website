<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { gsap } from '../../composables/gsapSetup'

const dotEl = ref(null)
const ringEl = ref(null)
let quickX, quickY, ringX, ringY

function onMove(e) {
  quickX(e.clientX)
  quickY(e.clientY)
  ringX(e.clientX)
  ringY(e.clientY)
}

function onEnterInteractive() {
  gsap.to(ringEl.value, { scale: 2.2, opacity: 0.6, duration: 0.35, ease: 'power3.out' })
}

function onLeaveInteractive() {
  gsap.to(ringEl.value, { scale: 1, opacity: 1, duration: 0.35, ease: 'power3.out' })
}

let observer

onMounted(() => {
  quickX = gsap.quickTo(dotEl.value, 'x', { duration: 0.12, ease: 'power3.out' })
  quickY = gsap.quickTo(dotEl.value, 'y', { duration: 0.12, ease: 'power3.out' })
  ringX = gsap.quickTo(ringEl.value, 'x', { duration: 0.45, ease: 'power3.out' })
  ringY = gsap.quickTo(ringEl.value, 'y', { duration: 0.45, ease: 'power3.out' })

  window.addEventListener('pointermove', onMove)

  const attachHandlers = () => {
    document.querySelectorAll('[data-cursor-hover]').forEach((el) => {
      el.addEventListener('mouseenter', onEnterInteractive)
      el.addEventListener('mouseleave', onLeaveInteractive)
    })
  }

  attachHandlers()
  observer = new MutationObserver(attachHandlers)
  observer.observe(document.body, { childList: true, subtree: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('pointermove', onMove)
  observer?.disconnect()
})
</script>

<template>
  <div class="pointer-events-none fixed inset-0 z-[90] hidden md:block">
    <div
      ref="dotEl"
      class="cursor-dot fixed left-0 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600"
    />
    <div
      ref="ringEl"
      class="cursor-ring fixed left-0 top-0 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-600/40"
    />
  </div>
</template>
