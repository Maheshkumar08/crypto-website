import { onBeforeUnmount, onMounted, ref, toValue } from 'vue'

/**
 * Tracks scroll progress (0–1) through a target element, for a reading
 * progress bar. Accepts a ref, a getter function, or a plain value via
 * `toValue()` — a component prop is already unwrapped by the time it
 * reaches here, so treating it as a ref and reading `.value` off it would
 * throw once the prop is null (e.g. before the parent's own ref attaches).
 */
export function useReadingProgress(target) {
  const progress = ref(0)

  function update() {
    const el = toValue(target)
    if (!el) return
    const rect = el.getBoundingClientRect()
    const total = rect.height - window.innerHeight
    if (total <= 0) {
      progress.value = 1
      return
    }
    const scrolled = -rect.top
    progress.value = Math.min(1, Math.max(0, scrolled / total))
  }

  onMounted(() => {
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    update()
  })

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', update)
    window.removeEventListener('resize', update)
  })

  return progress
}
