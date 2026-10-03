import { createApp as createClientApp, createSSRApp } from "vue";
import { createMemoryHistory, createRouter, createWebHistory } from "vue-router";
import { createHead as createClientHead } from "@unhead/vue/client";
import { createHead as createServerHead } from "@unhead/vue/server";
import { createPinia } from "pinia";
import App from "./App.vue";
import { routerOptions, installGuards } from "./router";
import { defaultHead } from "./composables/useSeoMeta";
import { PRERENDER_STATE } from "./composables/serverData";

import "./style.css";
import "./assets/article-content.css";

/**
 * One app factory for both sides:
 *   server  — src/entry-server.js renders `url` to HTML on every request
 *             (Express, backend/services/ssr/renderService.js);
 *   browser — the bottom of this file mounts the app over that HTML.
 * The router, head defaults and initial state are identical on both, so the
 * page the browser builds matches the one the server sent.
 */
export async function createApp(url) {
  const isServer = import.meta.env.SSR;

  const app = isServer ? createSSRApp(App) : createClientApp(App);
  const head = isServer ? createServerHead() : createClientHead();
  app.use(head);
  app.use(createPinia());

  // Site-wide <head> fallbacks; pages override them via useSeoMeta.
  head.push(defaultHead());

  // Data the server rendered a page from (article, page, taxonomy lists),
  // serialised into the HTML and handed back here, so the browser starts
  // from exactly that data without another API request.
  const initialState = isServer ? {} : readInitialState();
  app.provide(PRERENDER_STATE, initialState);

  const router = createRouter({
    history: isServer ? createMemoryHistory() : createWebHistory(),
    ...routerOptions,
  });
  // The auth check needs the admin session, which only exists in the browser.
  if (!isServer) installGuards(router);
  app.use(router);

  if (isServer) {
    router.push(url);
    await router.isReady();
  }

  return { app, router, head, initialState };
}

/** window.__INITIAL_STATE__ is a JSON string (see entry-server.js). */
function readInitialState() {
  try {
    return JSON.parse(window.__INITIAL_STATE__ || "{}");
  } catch (err) {
    console.error("[app] could not read the server state:", err);
    return {};
  }
}

if (!import.meta.env.SSR) {
  createApp().then(async ({ app, router }) => {
    await router.isReady();
    app.mount("#app");
  });
}
