import { ScrollTrigger } from "./gsapSetup";
import { useLenis } from "./useLenis";

// Clearance for the fixed SiteHeader when landing on an in-page anchor.
const HEADER_OFFSET = 80;

// Upper bound on waiting for async content (API lists, images) before
// restoring a saved position or resolving an anchor. The wait ends the moment
// the page is ready; this cap only matters if the content never arrives.
const MAX_CONTENT_WAIT = 1500;

const { jumpTo, scrollTo } = useLenis();

// Incremented per navigation so a slow restore can't scroll a page the user
// has already navigated away from.
let navigationId = 0;

/**
 * Router scrollBehavior. Vue Router calls it after the new route's DOM has
 * rendered, so this is the single place that owns scroll on navigation:
 *
 *   1. drop ScrollTriggers left behind by the page that just unmounted
 *   2. move to the target position through Lenis (when running), so its
 *      internal scroll state is reset instead of fighting a native scrollTo
 *   3. recompute every ScrollTrigger against the new page at its final scroll
 *
 * Returns false because the scroll has already been applied here.
 */
export async function handleRouteScroll(to, from, savedPosition) {
  const id = ++navigationId;

  // Query-only change on the same page (filters, tabs): not a new page.
  if (to.path === from.path && to.hash === from.hash) return false;

  // Admin/auth views reused in place (e.g. new → :id/edit after saving).
  if (to.meta.layout && sameView(to, from) && !savedPosition) return false;

  pruneDetachedTriggers();

  let top = 0;
  let smooth = false;

  if (savedPosition) {
    // Back/forward: the previous page may still be loading its content, so
    // wait until it's tall enough to hold the saved position.
    await waitFor(() => maxScroll() >= savedPosition.top);
    top = savedPosition.top;
  } else if (to.hash) {
    const el = await waitFor(() => findAnchor(to.hash));
    if (el) {
      top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
      smooth = to.path === from.path;
    }
  }

  if (id !== navigationId) return false;

  if (smooth) scrollTo(top, { offset: 0 });
  else jumpTo(top);

  ScrollTrigger.refresh();
  return false;
}

/**
 * Keeps ScrollTrigger positions in sync with the page height. On a hard load
 * ScrollTrigger refreshes on window "load"; client-side navigation fires no
 * such event, so content that arrives later (fetched lists, images, fonts)
 * would otherwise leave start/end positions stale and reveal animations
 * stuck at opacity 0.
 */
let resizeObserver = null;

export function installScrollSync() {
  if (resizeObserver || typeof ResizeObserver === "undefined") return;

  let frame = 0;
  resizeObserver = new ResizeObserver(() => {
    // Deferred a frame: refreshing inside the observer callback would change
    // layout mid-callback and trigger a ResizeObserver loop warning.
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => ScrollTrigger.refresh());
  });
  resizeObserver.observe(document.body);
}

function pruneDetachedTriggers() {
  ScrollTrigger.getAll().forEach((st) => {
    if (st.trigger && !st.trigger.isConnected) st.kill();
  });
}

function sameView(to, from) {
  const a = to.matched[to.matched.length - 1]?.components?.default;
  const b = from.matched[from.matched.length - 1]?.components?.default;
  return !!a && a === b;
}

function maxScroll() {
  return document.documentElement.scrollHeight - window.innerHeight;
}

function findAnchor(hash) {
  const id = decodeURIComponent(hash.slice(1));
  return id ? document.getElementById(id) : null;
}

/**
 * Resolves with check()'s result as soon as it's truthy, re-checking on
 * every DOM mutation or body resize, or with its final result after
 * MAX_CONTENT_WAIT.
 */
function waitFor(check) {
  const ready = check();
  if (ready) return Promise.resolve(ready);

  return new Promise((resolve) => {
    const probe = () => {
      if (check()) finish();
    };
    const ro = new ResizeObserver(probe);
    const mo = new MutationObserver(probe);
    const timer = setTimeout(finish, MAX_CONTENT_WAIT);

    function finish() {
      ro.disconnect();
      mo.disconnect();
      clearTimeout(timer);
      resolve(check());
    }

    ro.observe(document.body);
    mo.observe(document.body, { childList: true, subtree: true });
  });
}
