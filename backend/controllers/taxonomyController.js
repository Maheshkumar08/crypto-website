import { taxonomy } from "../services/articleService.js";

/** GET /api/categories?kind=article|blog — categories of published posts, with counts. */
export async function categories(req, res) {
  res.set("Cache-Control", "no-cache").json(await taxonomy("category", req.query.kind));
}

/** GET /api/tags?kind=article|blog */
export async function tags(req, res) {
  res.set("Cache-Control", "no-cache").json(await taxonomy("tags", req.query.kind));
}
