import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { config } from "../../config/env.js";
import { getArticleBySlugAnyStatus, listPublishedForRender } from "../articleService.js";
import { listGuideCards } from "../guideCardService.js";
import { findPageBySlug, listPublishedPagesForRender } from "../pageService.js";
import { installBrowserGlobals } from "./browserGlobals.js";
import { injectDocument, renderDocument, renderPreloadLinks } from "./htmlTemplate.js";

/**
 * Server rendering of the existing Vue pages (src/entry-server.js) with
 * data from MongoDB:
 *   production  — the bundle `npm run build` writes to backend/ssr
 *   development — the live source through Vite, so no build is needed and
 *                 edits show up on the next request
 */

/** What the Vue app reads through src/composables/serverData.js. */
const dataSource = {
  listPublished(collection) {
    return collection === "pages" ? listPublishedPagesForRender() : listPublishedForRender(collection);
  },
  getBySlug(collection, slug) {
    return collection === "pages" ? findPageBySlug(slug) : getArticleBySlugAnyStatus(collection, slug);
  },
  listGuideCards(category) {
    return listGuideCards({ category, enabledOnly: true });
  },
};

export function serverBundleExists() {
  return existsSync(config.paths.ssrEntry);
}

/* ---------------- production ---------------- */

let bundlePromise = null;

export function getBundle() {
  bundlePromise ??= (async () => {
    installBrowserGlobals(config.siteUrl);
    const bundle = await import(pathToFileURL(config.paths.ssrEntry).href);
    bundle.setServerDataSource(dataSource);
    return bundle;
  })().catch((err) => {
    bundlePromise = null;
    throw err;
  });
  return bundlePromise;
}

/* ---------------- development ---------------- */

let vitePromise = null;

/** A Vite dev server in middleware mode, used only to load Vue modules for SSR. */
function getVite() {
  vitePromise ??= (async () => {
    let vitePackage;
    try {
      vitePackage = createRequire(path.join(config.paths.frontend, "package.json")).resolve("vite/package.json");
    } catch {
      throw new Error("development rendering needs the frontend's packages — run `npm install` in the project root.");
    }
    const { createServer } = await import(pathToFileURL(path.join(path.dirname(vitePackage), "dist", "node", "index.js")).href);
    return createServer({
      root: config.paths.frontend,
      configFile: path.join(config.paths.frontend, "vite.config.js"),
      server: { middlewareMode: true, hmr: false },
      appType: "custom",
      logLevel: "warn",
    });
  })().catch((err) => {
    vitePromise = null;
    throw err;
  });
  return vitePromise;
}

async function renderWithVite(url, nonce) {
  const vite = await getVite();
  const template = await vite.transformIndexHtml(url, readFileSync(path.join(config.paths.frontend, "index.html"), "utf8"));
  installBrowserGlobals(config.siteUrl);
  try {
    const bundle = await vite.ssrLoadModule("/src/entry-server.js");
    bundle.setServerDataSource(dataSource);
    const result = await bundle.render(url);
    if (result.redirect) return { redirect: result.redirect };
    return {
      statusCode: result.statusCode,
      html: injectDocument(template, { head: result.head, appHtml: result.appHtml, state: result.state, nonce }),
    };
  } catch (err) {
    vite.ssrFixStacktrace(err);
    throw err;
  }
}

/* ---------------- shared ---------------- */

/** The Vue app's public pages without parameters (/, /about …), for the sitemap. */
export async function getStaticPaths() {
  const bundle = config.isDevelopment ? await (await getVite()).ssrLoadModule("/src/entry-server.js") : await getBundle();
  return bundle.staticPaths();
}

/** Renders one URL from MongoDB into a complete HTML document. */
export async function renderUrl(url, { nonce } = {}) {
  if (config.isDevelopment) return renderWithVite(url, nonce);

  const { render } = await getBundle();
  const result = await render(url);
  if (result.redirect) return { redirect: result.redirect };
  return {
    statusCode: result.statusCode,
    html: renderDocument({
      head: result.head,
      preloadLinks: renderPreloadLinks(result.modules),
      appHtml: result.appHtml,
      state: result.state,
      nonce,
    }),
  };
}

/** Loads the renderer at startup instead of on the first visitor's request. */
export async function prepareRenderer() {
  if (config.isDevelopment) {
    await getVite();
    return;
  }
  if (!serverBundleExists()) {
    throw new Error('no production build — run "npm run build" (article pages answer 503 until then).');
  }
  await getBundle();
}
