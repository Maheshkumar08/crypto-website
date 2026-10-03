# cryptolearner.us — Premium Crypto Education Landing Page

An original, production-ready landing page inspired by the _interaction quality_ of
learncrypto.com (smooth scroll, scroll-driven storytelling, glass/glow UI) — built with
its own visual identity, copy, and layout. No text, assets, or branding were copied from
any source.

## Architecture

This folder is the Vue app: the website and the admin panel. It talks to the
Express + MongoDB backend ([../backend](../backend/README.md)) only through
the REST API (`src/services/api.js`). Article, blog, guide, category and tag
pages are rendered by that backend on the server with these same components.
See the [project README](../README.md).

## Stack

- Vue 3 (`<script setup>`, Composition API)
- Vite
- GSAP 3 — ScrollTrigger, SplitText, Flip
- Lenis — smooth scrolling
- Three.js — hero background (floating wireframe geometry)
- Tailwind CSS

## Getting started

Run everything from the project root (one `npm install` covers both workspaces):

```bash
npm install
npm run dev       # API on :3000 + Vite on http://localhost:5173
npm run build     # frontend/dist (Vue pages) + backend/ssr (server renderer)
npm start         # production server on :3000
```

## Project structure

```
src/
  components/
    layout/        CustomCursor, SiteHeader, SiteFooter
    sections/       one component per landing-page section
    ui/             MagneticButton, GlowCard, FeatureIcon
  composables/
    gsapSetup.js    single place GSAP plugins are registered
    useLenis.js     Lenis instance wired into the GSAP ticker
    useMagnetic.js  magnetic hover interaction
    useReveal.js    reusable SplitText + ScrollTrigger reveal helpers
    useHeroScene.js Three.js hero background
  data/
    content.js      all copy — edit this file to reroute the whole site's text
```

## Sections implemented

1. Hero — fullscreen, Three.js wireframe field, char-by-char heading reveal, magnetic CTAs
2. Trusted-by marquee — infinite horizontal logo strip
3. Features grid — glass cards with cursor-reactive glow
4. Interactive timeline — **pinned + horizontal scroll** driven by vertical scroll progress
5. Stats counter — scroll-triggered count-up
6. Animated cards — sticky **card-stacking** scroll effect
7. Learning process — numbered sequence with a scroll-drawn connector line
8. Testimonials — parallax background glows behind reveal-in cards
9. Pricing — monthly/annual toggle animated with **GSAP Flip**
10. FAQ — accordion with animated height
11. CTA banner — animated drifting gradient glow
12. Footer

## Notes on performance

- GSAP and Three.js are split into their own chunks (`vite.config.js`) so the initial
  bundle stays lean.
- All scroll animations animate `transform`/`opacity` only (GPU-accelerated), never
  `top`/`left`/`width`.
- `prefers-reduced-motion` is respected globally in `src/style.css`.
- The custom cursor and Three.js scene are skipped/hidden on touch devices.

## Customizing

- Swap colors/fonts in `tailwind.config.js` and the Google Fonts `<link>` in
  `index.html`.
- All copy lives in `src/data/content.js` — no strings are hardcoded in components.
