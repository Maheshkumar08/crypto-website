import { JSDOM, VirtualConsole } from "jsdom";

let installed = false;

/**
 * Gives the Vue server bundle the browser globals (window, document…) that
 * vite-ssg's `mock: true` provides while prerendering, so the app renders
 * here exactly as it does at build time — article HTML is sanitized
 * (DOMPurify) and its table of contents built (DOM parsing) on the server.
 */
export function installBrowserGlobals(url) {
  if (installed) return;
  installed = true;

  // jsdom reports "Not implemented: window.scrollTo" etc. for browser-only
  // calls the router makes; those are expected on a server, so drop them.
  const virtualConsole = new VirtualConsole();
  virtualConsole.sendTo(console, { omitJSDOMErrors: true });

  const { window } = new JSDOM("<!doctype html><html><head></head><body></body></html>", {
    url,
    pretendToBeVisual: true,
    virtualConsole,
  });

  for (const key of Object.getOwnPropertyNames(window)) {
    if (key.startsWith("_") || key in globalThis) continue;
    globalThis[key] = window[key];
  }
  globalThis.window = window;
  globalThis.document = window.document;
  window.console = globalThis.console;
}
