import { gsap } from './gsapSetup'

/**
 * Attaches a magnetic-pull hover interaction to an element.
 * @param {HTMLElement} el - the element to animate
 * @param {HTMLElement} [strengthEl] - optional inner element that moves further (parallax layer)
 * @param {number} strength - how strongly the element follows the pointer (0-1)
 */
export function attachMagnetic(el, { strength = 0.4, innerStrength = 0.7 } = {}) {
  if (!el) return () => {}

  const inner = el.querySelector('[data-magnetic-inner]')

  function onMove(e) {
    const rect = el.getBoundingClientRect()
    const relX = e.clientX - rect.left - rect.width / 2
    const relY = e.clientY - rect.top - rect.height / 2

    gsap.to(el, {
      x: relX * strength,
      y: relY * strength,
      duration: 0.6,
      ease: 'power3.out',
    })

    if (inner) {
      gsap.to(inner, {
        x: relX * innerStrength,
        y: relY * innerStrength,
        duration: 0.6,
        ease: 'power3.out',
      })
    }
  }

  function onLeave() {
    gsap.to([el, inner].filter(Boolean), {
      x: 0,
      y: 0,
      duration: 0.7,
      ease: 'elastic.out(1, 0.4)',
    })
  }

  el.addEventListener('pointermove', onMove)
  el.addEventListener('pointerleave', onLeave)

  return () => {
    el.removeEventListener('pointermove', onMove)
    el.removeEventListener('pointerleave', onLeave)
  }
}
