import { renderToString } from "vue/server-renderer";
import { renderSSRHead } from "@unhead/vue/server";
import { createApp } from "./main";
import { routes } from "./router";

export { setServerDataSource } from "./composables/serverData";

/**
 * Server entry for the Express backend: every public page is rendered from
 * this on every request (production: the bundle `npm run build` writes to
 * backend/ssr; development: the live source through Vite). The browser then
 * mounts the same app (src/main.js) over the HTML.
 */
export async function render(url) {
  const { app, router, head, initialState } = await createApp(url);

  const route = router.currentRoute.value;
  if (route.redirectedFrom) {
    return { redirect: route.fullPath };
  }

  const ctx = {};
  const appHtml = await renderToString(app, ctx);
  const headPayload = await renderSSRHead(head);

  return {
    statusCode: ctx.statusCode || (route.name === "not-found" ? 404 : 200),
    appHtml,
    head: headPayload,
    modules: [...(ctx.modules || [])],
    state: serializeState(initialState),
  };
}

// window.__INITIAL_STATE__ holds a JSON string, which src/main.js parses.
// Built from a string: as a regex literal, the bundler emits the two line
// separators as raw characters, which then can't be parsed.
const UNSAFE_CHARS = new RegExp("[<>/\\u2028\\u2029]", "g");
const ESCAPED = {
  "<": "\\u003C",
  ">": "\\u003E",
  "/": "\\u002F",
  " ": "\\u2028",
  " ": "\\u2029",
};

function serializeState(state) {
  if (!state || Object.keys(state).length === 0) return null;
  return JSON.stringify(JSON.stringify(state)).replace(UNSAFE_CHARS, (c) => ESCAPED[c]);
}

/**
 * Public pages without route parameters (/, /about, /safety …): the sitemap
 * lists these next to the posts, pages, categories and tags from MongoDB.
 */
export function staticPaths() {
  return routes
    .map((route) => route.path)
    .filter((path) => !path.includes(":") && !path.startsWith("/admin"));
}
