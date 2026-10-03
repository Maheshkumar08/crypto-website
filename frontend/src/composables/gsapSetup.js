import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { Flip } from 'gsap/Flip'

// Server rendering runs with a jsdom window (backend/services/ssr) that has no
// matchMedia, which ScrollTrigger needs on registration. Animations only
// ever run in the browser, so registering there alone is enough.
if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
  gsap.registerPlugin(ScrollTrigger, SplitText, Flip)
}

// Consistent, premium easing used across the whole site
gsap.defaults({ ease: 'power3.out', duration: 0.9 })

export { gsap, ScrollTrigger, SplitText, Flip }
