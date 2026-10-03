import Lenis from "@studio-freight/lenis";
import { gsap, ScrollTrigger } from "./gsapSetup";

let lenis = null;

function raf(time) {
  lenis?.raf(time * 1000);
}

/**
 * Resolves a scroll target (number, selector or element) to a document Y
 * for the native fallback used when Lenis isn't running.
 */
function resolveTop(target, offset) {
  if (typeof target === "number") return target + offset;

  let el = target;
  if (typeof target === "string") {
    try {
      el = document.querySelector(target);
    } catch {
      el = null;
    }
  }
  if (!el?.getBoundingClientRect) return null;

  return el.getBoundingClientRect().top + window.scrollY + offset;
}

export function useLenis() {
  function start() {
    if (lenis || typeof window === "undefined") return lenis;

    lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.2,
    });

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return lenis;
  }

  function scrollTo(target, opts = {}) {
    const { offset = -80, duration = 1.4, immediate = false, ...rest } = opts;

    if (lenis) {
      lenis.scrollTo(target, { offset, duration, immediate, ...rest });
      return;
    }

    const top = resolveTop(target, offset);
    if (top === null) return;

    window.scrollTo({
      top: Math.max(0, top),
      behavior: immediate ? "instant" : "smooth",
    });
  }

  /**
   * Instantly moves to `top`, cancelling any in-flight Lenis animation or
   * momentum. A plain window.scrollTo isn't enough while Lenis is running:
   * its next frame would scroll back to its own stale target.
   */
  function jumpTo(top) {
    if (lenis) {
      lenis.scrollTo(top, { immediate: true, force: true });
      return;
    }

    window.scrollTo({ top, left: 0, behavior: "instant" });
  }

  function stop() {
    lenis?.stop();
  }

  function resume() {
    lenis?.start();
  }

  function destroy() {
    if (!lenis) return;

    gsap.ticker.remove(raf);
    lenis.destroy();
    lenis = null;
  }

  return {
    start,
    scrollTo,
    jumpTo,
    stop,
    resume,
    destroy,
    instance: () => lenis,
  };
}
