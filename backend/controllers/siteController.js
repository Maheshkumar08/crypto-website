import { existsSync } from "node:fs";
import path from "node:path";
import { config } from "../config/env.js";
import { isDatabaseReady } from "../config/db.js";
import { errorPage } from "../middleware/errorHandler.js";
import { buildRss, buildSitemap } from "../services/feedService.js";
import { MANIFEST_FILE, TEMPLATE_FILE, renderAdminShell } from "../services/ssr/htmlTemplate.js";
import { renderUrl, serverBundleExists } from "../services/ssr/renderService.js";

export function buildExists() {
  return existsSync(TEMPLATE_FILE) && existsSync(MANIFEST_FILE) && serverBundleExists();
}

/**
 * A missing file must 404 as a file: answering /assets/old-chunk.js with
 * HTML would surface as a confusing MIME-type error in the browser.
 */
export function missingFile(req, res, next) {
  if (path.posix.extname(req.path) === "") return next();
  res.status(404).set("Cache-Control", "no-store").type("text/plain").send("Not Found");
}

/** Admin panel: client-rendered behind sign-in, never indexed. */
export function adminShell(req, res) {
  res.set({ "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" }).type("html").send(renderAdminShell());
}

/**
 * Every public page — marketing pages, articles, guides, blog posts, CMS
 * pages, categories, tags and real 404s — rendered by Vue on this request
 * (content from MongoDB): complete HTML, head tags and JSON-LD in the
 * response, and a publish is live on the next request.
 */
export async function renderPage(req, res) {
  if (!isDatabaseReady()) {
    res.status(503).set({ "Cache-Control": "no-store", "Retry-After": "30" }).type("html")
      .send(errorPage(503, "Temporarily unavailable", "This page could not be loaded right now. Please try again in a moment."));
    return;
  }

  const result = await renderUrl(req.originalUrl, { nonce: res.locals.cspNonce });
  if (result.redirect) {
    res.redirect(301, result.redirect);
    return;
  }
  res
    .status(result.statusCode)
    .set("Cache-Control", result.statusCode === 200 ? "no-cache" : "no-store")
    .type("html")
    .send(result.html);
}

export async function sitemap(req, res) {
  res.set({ "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "no-cache" }).send(await buildSitemap());
}

export async function rss(req, res) {
  res.set({ "Content-Type": "application/rss+xml; charset=utf-8", "Cache-Control": "no-cache" }).send(await buildRss());
}

/** GET /api/health — deployment check. */
export function health(req, res) {
  const status = { mode: config.nodeEnv, build: config.isDevelopment || buildExists(), database: isDatabaseReady() };
  res.status(status.build && status.database ? 200 : 503).set("Cache-Control", "no-store").json(status);
}

/**
 * Development: pages belong to the Vite dev server (SITE_URL). Requests it
 * proxies here keep its Host header and are rendered; a browser that opened
 * the API port directly is sent to the dev server instead.
 */
export function toViteDevServer(req, res, next) {
  const devHost = new URL(config.siteUrl).host;
  if (req.get("host") === devHost) return next();
  res.redirect(302, config.siteUrl + req.originalUrl);
}

/** Shown for every page while `npm run build` hasn't been run (production). */
export function missingBuild(req, res, next) {
  if (buildExists() || req.path.startsWith("/api/") || req.path.startsWith("/uploads/")) return next();
  res.status(503).set("Cache-Control", "no-store").type("html")
    .send(errorPage(503, "Build missing", 'Run "npm run build" before "npm start".'));
}
