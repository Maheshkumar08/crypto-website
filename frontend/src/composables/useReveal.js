import { gsap, SplitText, ScrollTrigger } from './gsapSetup'

/**
 * Splits a heading into characters (or words) and reveals them on scroll.
 * Returns the SplitText instance so callers can .revert() it on unmount.
 */
export function revealHeading(el, { type = 'chars', trigger = el, start = 'top 82%', stagger = 0.02, delay = 0 } = {}) {
  if (!el) return null

  const split = new SplitText(el, {
    type: type === 'chars' ? 'chars,words' : 'words,lines',
    linesClass: 'split-line',
  })

  const targets = type === 'chars' ? split.chars : type === 'words' ? split.words : split.lines

  gsap.set(targets, { yPercent: 130, opacity: 0, rotateZ: type === 'chars' ? 6 : 0 })

  gsap.to(targets, {
    yPercent: 0,
    opacity: 1,
    rotateZ: 0,
    duration: 1,
    ease: 'power4.out',
    stagger: stagger,
    delay,
    scrollTrigger: {
      trigger,
      start,
      toggleActions: 'play none none reverse',
    },
  })

  return split
}

/**
 * Generic fade/slide-up reveal for groups of elements, staggered.
 */
export function revealUp(targets, { trigger, start = 'top 85%', y = 40, stagger = 0.12, delay = 0 } = {}) {
  if (!targets) return null

  const tween = gsap.fromTo(
    targets,
    { y, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 1,
      ease: 'power3.out',
      stagger,
      delay,
      scrollTrigger: {
        trigger: trigger || targets,
        start,
        toggleActions: 'play none none reverse',
      },
    }
  )

  return tween
}

/**
 * Cinematic clip-path reveal for hero/cover images — the image slides up
 * out of a mask while settling from a slight scale, rather than a plain fade.
 */
export function revealMask(el, { trigger = el, start = 'top 80%', duration = 1.3, delay = 0, scale = 1.08 } = {}) {
  if (!el) return null

  gsap.set(el, { clipPath: 'inset(0% 0% 100% 0%)', scale })

  return gsap.to(el, {
    clipPath: 'inset(0% 0% 0% 0%)',
    scale: 1,
    duration,
    delay,
    ease: 'power4.out',
    scrollTrigger: trigger
      ? {
          trigger,
          start,
          toggleActions: 'play none none none',
        }
      : undefined,
  })
}

export { gsap, ScrollTrigger }
