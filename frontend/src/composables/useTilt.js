import { gsap } from './gsapSetup'

/**
 * Subtle 3D mouse-parallax tilt for premium cards (Stripe/Linear-style),
 * paired with a CSS-driven glow border via --glow-x/--glow-y custom
 * properties the caller's stylesheet can use (see .hover-glow in style.css).
 */
export function attachTilt(el, { max = 6 } = {}) {
  if (!el) return () => {}

  function onMove(e) {
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height

    gsap.to(el, {
      rotateX: (0.5 - py) * max,
      rotateY: (px - 0.5) * max,
      transformPerspective: 900,
      duration: 0.4,
      ease: 'power2.out',
    })

    el.style.setProperty('--glow-x', `${px * 100}%`)
    el.style.setProperty('--glow-y', `${py * 100}%`)
  }

  function onLeave() {
    gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.6, ease: 'power3.out' })
  }

  el.addEventListener('mousemove', onMove)
  el.addEventListener('mouseleave', onLeave)

  return () => {
    el.removeEventListener('mousemove', onMove)
    el.removeEventListener('mouseleave', onLeave)
  }
}
