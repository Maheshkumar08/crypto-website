import * as articles from "../services/articleService.js";
import { badRequest, notFound } from "../utils/httpError.js";

/**
 * Articles (/api/articles) and blog posts (/api/blogs) share these
 * handlers; the router sets req.kind.
 */

const truthy = (v) => ["1", "true", "yes"].includes(String(v).toLowerCase());

/** GET / — published posts; `?status=all` adds drafts for signed-in staff. */
export async function list(req, res) {
  const q = req.query;
  const includeDrafts = !!req.user && (q.status === "all" || q.status === "draft");
  let items = await articles.listArticles({
    kind: req.kind,
    includeDrafts,
    guideCardId: q.guideCardId,
    search: q.search || q.q,
    category: q.category,
    tag: q.tag,
    featured: q.featured === undefined ? undefined : truthy(q.featured),
    limit: q.limit,
    skip: q.skip,
    summary: truthy(q.summary),
  });
  if (q.status === "draft") items = items.filter((p) => !p.published);
  res.set("Cache-Control", req.user ? "no-store" : "no-cache").json(items);
}

/** GET /:slug — a published post (drafts too for signed-in staff: preview). */
export async function getBySlug(req, res) {
  const post = await articles.getArticleBySlug(req.kind, req.params.slug, { includeDrafts: !!req.user });
  if (!post) throw notFound("Post not found.");
  res.set("Cache-Control", req.user ? "no-store" : "no-cache").json(post);
}

/** GET /id/:id (staff) */
export async function getById(req, res) {
  res.set("Cache-Control", "no-store").json(await articles.getArticleById(req.params.id));
}

/** GET /slug-exists?slug=…&excludeId=… (staff) */
export async function slugExists(req, res) {
  if (!req.query.slug) throw badRequest("Pass ?slug=…");
  res.json({ exists: await articles.slugExists(req.kind, req.query.slug, req.query.excludeId) });
}

/** POST / (staff) */
export async function create(req, res) {
  res.status(201).json(await articles.createArticle(req.kind, req.body || {}, req.user));
}

/** PUT|PATCH /:id (staff) */
export async function update(req, res) {
  res.json(await articles.updateArticle(req.params.id, req.body || {}, req.user));
}

/** DELETE /:id (admin) */
export async function remove(req, res) {
  await articles.deleteArticle(req.params.id);
  res.status(204).end();
}

/** POST /:id/views */
export async function view(req, res) {
  res.json({ views: await articles.bumpCounter(req.params.id, "views", 1) });
}

/** POST /:id/likes { delta: 1 | -1 } */
export async function like(req, res) {
  const delta = Number(req.body?.delta ?? 1) < 0 ? -1 : 1;
  res.json({ likes: await articles.bumpCounter(req.params.id, "likes", delta) });
}
