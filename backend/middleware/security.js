import { createHash, randomBytes } from "node:crypto";
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import helmet from "helmet";
import { config } from "../config/env.js";
import { TEMPLATE_FILE } from "../services/ssr/htmlTemplate.js";

/**
 * Helmet with a Content-Security-Policy that allows exactly what the site
 * loads: its own scripts, Google Tag Manager/Analytics, Google Fonts, images
 * from anywhere over HTTPS (uploads, old Cloudinary images), and video
 * embeds from the hosts the article sanitizer allows.
 *
 * Inline scripts: the Google tag in index.html is allowed by its SHA-256
 * hash; the per-page __INITIAL_STATE__ script by a per-request nonce.
 */

let hashCache = { key: null, hashes: [] };

function inlineScriptHashes() {
  let key;
  try {
    key = statSync(TEMPLATE_FILE).mtimeMs;
  } catch {
    return [];
  }
  if (hashCache.key === key) return hashCache.hashes;

  const hashes = new Set();
  const collect = (html) => {
    for (const [, body] of html.matchAll(/<script(?![^>]*\bsrc=)(?![^>]*type="application\/ld\+json")[^>]*>([\s\S]*?)<\/script>/gi)) {
      if (body.trim()) hashes.add(`'sha256-${createHash("sha256").update(body).digest("base64")}'`);
    }
  };
  // The template and every prerendered page (their serialisation of the
  // same snippet can differ by whitespace).
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory() && entry.name !== "assets") walk(full);
      else if (entry.name.endsWith(".html")) collect(readFileSync(full, "utf8"));
    }
  };
  try {
    walk(config.paths.dist);
  } catch {
    // No build yet: the server answers with its "run npm run build" page.
  }
  hashCache = { key, hashes: [...hashes] };
  return hashCache.hashes;
}

const EMBED_HOSTS = [
  "https://www.youtube.com",
  "https://www.youtube-nocookie.com",
  "https://player.vimeo.com",
  "https://codepen.io",
  "https://www.figma.com",
  "https://www.loom.com",
];

export function cspNonce(_req, res, next) {
  res.locals.cspNonce = randomBytes(16).toString("base64");
  next();
}

export const securityHeaders = helmet({
  // In development Vite's dev tooling needs inline scripts; the policy
  // applies to the production build.
  contentSecurityPolicy: config.isDevelopment ? false : {
    useDefaults: false,
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        (_req, res) => `'nonce-${res.locals.cspNonce}'`,
        (_req, _res) => inlineScriptHashes().join(" ") || "'self'",
        "https://www.googletagmanager.com",
      ],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "data:", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "blob:", "https:"],
      mediaSrc: ["'self'", "blob:", "https:"],
      connectSrc: ["'self'", "https://www.googletagmanager.com", "https://*.google-analytics.com", "https://*.analytics.google.com"],
      frameSrc: ["'self'", ...EMBED_HOSTS],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      frameAncestors: ["'self'"],
      ...(config.siteUrl.startsWith("https://") ? { upgradeInsecureRequests: [] } : {}),
    },
  },
  strictTransportSecurity: config.siteUrl.startsWith("https://"),
  // Embedded videos and images from other origins are part of the content.
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "same-site" },
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
});
