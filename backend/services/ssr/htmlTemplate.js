import { readFileSync, statSync } from "node:fs";
import path from "node:path";
import { config } from "../../config/env.js";

// Both written by `npm run build` (vite build): the client index.html every
// page is rendered into, and the map from Vue modules to their JS/CSS chunks.
export const TEMPLATE_FILE = path.join(config.paths.dist, "index.html");
export const MANIFEST_FILE = path.join(config.paths.dist, ".vite", "ssr-manifest.json");

const cache = new Map();

// Re-read when the file changes, so a new build is picked up without a restart.
function readCached(file, parse) {
  const { mtimeMs } = statSync(file);
  const hit = cache.get(file);
  if (hit && hit.mtimeMs === mtimeMs) return hit.value;
  const value = parse(readFileSync(file, "utf8"));
  cache.set(file, { mtimeMs, value });
  return value;
}

const getTemplate = () => readCached(TEMPLATE_FILE, (s) => s);
const getManifest = () => readCached(MANIFEST_FILE, JSON.parse);

/** JS/CSS chunks the rendered route needs, from Vite's SSR manifest. */
export function renderPreloadLinks(modules) {
  const manifest = getManifest();
  const files = new Set();
  for (const id of modules) for (const file of manifest[id] || []) files.add(file);

  let links = "";
  for (const file of files) {
    if (file.endsWith(".js")) links += `<link rel="modulepreload" crossorigin href="${file}">\n`;
    else if (file.endsWith(".css")) links += `<link rel="stylesheet" href="${file}">\n`;
  }
  return links;
}

/**
 * Assembles a page: unhead's tags (which include charset/viewport) replace
 * the template's, route
 * chunks are preloaded, and the app HTML plus its state go into #app. The
 * state script carries the request's CSP nonce.
 */
export function renderDocument(parts) {
  return injectDocument(getTemplate(), parts);
}

/** The same assembly on any template (development renders Vite's index.html). */
export function injectDocument(template, { head, preloadLinks = "", appHtml = "", state = null, nonce = "" }) {
  let html = template;

  if (head?.headTags) {
    html = html
      .replace(/<meta charset[^>]*>\s*/i, "")
      .replace(/<meta\s+name="viewport"[^>]*>\s*/i, "")
      .replace(/<head>/i, () => `<head>\n${head.headTags}\n`);
  }

  html = html.replace(/<\/head>/i, () => `${preloadLinks}</head>`);

  if (head?.htmlAttrs) html = html.replace(/<html[^>]*>/i, () => `<html ${head.htmlAttrs}>`);
  if (head?.bodyAttrs) html = html.replace(/<body/i, () => `<body ${head.bodyAttrs}`);

  if (appHtml) {
    const nonceAttr = nonce ? ` nonce="${nonce}"` : "";
    const stateScript = state ? `\n<script${nonceAttr}>window.__INITIAL_STATE__=${state}</script>` : "";
    html = html.replace('<div id="app"></div>', () => `<div id="app" data-server-rendered="true">${appHtml}</div>${stateScript}`);
  }

  return html;
}

/** Client-only shell for the admin panel (the session lives in the browser). */
export function renderAdminShell() {
  return renderDocument({
    preloadLinks: '<title>Admin — cryptolearner.us</title>\n<meta name="robots" content="noindex, nofollow">\n',
  });
}

/** The template's inline scripts (the Google tag), for CSP hashes. */
export function templateInlineScripts() {
  return [...getTemplate().matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1]).filter((s) => s.trim());
}
