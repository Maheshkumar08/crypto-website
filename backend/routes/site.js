import express, { Router } from "express";
import { config } from "../config/env.js";
import * as site from "../controllers/siteController.js";

const ONE_YEAR = 60 * 60 * 24 * 365;

/** Everything that isn't /api: files, the Vue pages, server-rendered content. */
export function siteRouter() {
  const router = Router();

  // Uploaded images: random file names, never overwritten → cache for a year.
  router.use(
    "/uploads",
    express.static(config.uploads.dir, { index: false, redirect: false, dotfiles: "ignore", maxAge: ONE_YEAR * 1000, immutable: true }),
  );

  router.get("/sitemap.xml", site.sitemap);
  router.get("/rss.xml", site.rss);

  if (config.isDevelopment) {
    // `npm run dev`: the Vite dev server (SITE_URL) serves the Vue app and
    // proxies article pages here, which are rendered from the live source.
    router.use(site.toViteDevServer);
    router.get("/{*path}", site.renderPage);
    return router;
  }

  router.use(site.missingBuild);

  // dist/index.html is the template pages are rendered into, not a page.
  router.get("/index.html", (req, res) => res.redirect(301, "/"));

  // Real files from frontend/dist (JS, CSS, images, robots.txt …).
  router.use(
    express.static(config.paths.dist, {
      index: false,
      redirect: false,
      dotfiles: "ignore",
      setHeaders(res, filePath) {
        if (/[\\/]assets[\\/]/.test(filePath)) res.setHeader("Cache-Control", `public, max-age=${ONE_YEAR}, immutable`);
        else if (filePath.endsWith(".html")) res.setHeader("Cache-Control", "no-cache");
        else res.setHeader("Cache-Control", "public, max-age=3600");
      },
    }),
  );

  router.get(["/admin", "/admin/{*rest}"], site.adminShell);

  // Every public page — home, about, contact, guides, articles, blog,
  // categories, tags, CMS pages, 404s — is rendered by Vue on this request.
  router.get("/{*path}", site.missingFile, site.renderPage);

  return router;
}
