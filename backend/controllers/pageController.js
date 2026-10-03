import * as pages from "../services/pageService.js";
import { badRequest, notFound } from "../utils/httpError.js";

/** GET /api/pages — published pages; `?status=all` adds drafts for staff. */
export async function list(req, res) {
  const includeDrafts = !!req.user && req.query.status === "all";
  res.set("Cache-Control", req.user ? "no-store" : "no-cache").json(await pages.listPages({ includeDrafts }));
}

/** GET /api/pages/:slug — drafts too for signed-in staff (preview). */
export async function getBySlug(req, res) {
  const page = await pages.getPageBySlug(req.params.slug, { includeDrafts: !!req.user });
  if (!page) throw notFound("Page not found.");
  res.set("Cache-Control", req.user ? "no-store" : "no-cache").json(page);
}

export async function getById(req, res) {
  res.set("Cache-Control", "no-store").json(await pages.getPageById(req.params.id));
}

export async function slugExists(req, res) {
  if (!req.query.slug) throw badRequest("Pass ?slug=…");
  res.json({ exists: await pages.pageSlugExists(req.query.slug, req.query.excludeId) });
}

export async function create(req, res) {
  res.status(201).json(await pages.createPage(req.body || {}));
}

export async function update(req, res) {
  res.json(await pages.updatePage(req.params.id, req.body || {}));
}

export async function remove(req, res) {
  await pages.deletePage(req.params.id);
  res.status(204).end();
}
