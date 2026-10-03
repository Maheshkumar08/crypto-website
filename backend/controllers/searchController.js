import { Article } from "../models/Article.js";
import { Page } from "../models/Page.js";
import { badRequest } from "../utils/httpError.js";
import { escapeRegex } from "../utils/text.js";

const GUIDE_SECTIONS = new Set(["getting-started", "safety", "coins", "exchanges", "taxes", "glossary"]);
const TYPES = ["articles", "blogs", "pages"];

function postPath(doc) {
  if (doc.kind === "blog") return `/blog/${doc.slug}`;
  return GUIDE_SECTIONS.has(doc.guideSection) ? `/${doc.guideSection}/${doc.slug}` : `/articles/${doc.slug}`;
}

/** Title matches rank above body/excerpt matches; newer first within a rank. */
function score(doc, pattern) {
  return (pattern.test(doc.title) ? 2 : 0) + ((doc.tags || []).some((t) => pattern.test(t)) || pattern.test(doc.category || "") ? 1 : 0);
}

/**
 * GET /api/search?q=…&type=articles,blogs,pages&limit=20
 * Published content only; each result carries its public URL.
 */
export async function search(req, res) {
  const q = String(req.query.q ?? req.query.query ?? "").trim();
  if (q.length < 2) throw badRequest("Search for at least 2 characters.");
  const types = String(req.query.type || TYPES.join(","))
    .split(",")
    .map((t) => t.trim())
    .filter((t) => TYPES.includes(t));
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20));
  const pattern = new RegExp(escapeRegex(q.slice(0, 100)), "i");

  const kinds = [types.includes("articles") && "article", types.includes("blogs") && "blog"].filter(Boolean);
  const [posts, pages] = await Promise.all([
    kinds.length
      ? Article.find({
          kind: { $in: kinds },
          status: "published",
          $or: [{ title: pattern }, { excerpt: pattern }, { tags: pattern }, { category: pattern }, { content: pattern }],
        })
          .select("kind title slug excerpt category tags featuredImage guideSection publishedAt createdAt readingTime")
          .sort({ publishedAt: -1 })
          .limit(limit * 2)
          .lean()
      : [],
    types.includes("pages")
      ? Page.find({ status: "published", $or: [{ title: pattern }, { shortDescription: pattern }, { content: pattern }] })
          .select("title slug shortDescription coverImage publishedAt createdAt")
          .limit(limit)
          .lean()
      : [],
  ]);

  const results = [
    ...posts.map((p) => ({
      type: p.kind === "blog" ? "blog" : "article",
      id: String(p._id),
      title: p.title,
      slug: p.slug,
      description: p.excerpt,
      category: p.category,
      tags: p.tags || [],
      coverImage: p.featuredImage,
      readingTime: p.readingTime,
      path: postPath(p),
      createdAt: p.publishedAt || p.createdAt,
      _score: score(p, pattern),
    })),
    ...pages.map((p) => ({
      type: "page",
      id: String(p._id),
      title: p.title,
      slug: p.slug,
      description: p.shortDescription,
      coverImage: p.coverImage,
      path: `/${p.slug}`,
      createdAt: p.publishedAt || p.createdAt,
      _score: score(p, pattern),
    })),
  ]
    .sort((a, b) => b._score - a._score || new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, limit)
    .map(({ _score, ...r }) => r);

  res.set("Cache-Control", "no-cache").json({ query: q, total: results.length, results });
}
