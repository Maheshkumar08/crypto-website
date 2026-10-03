import mongoose from "mongoose";
import { Article } from "../models/Article.js";
import { badRequest, conflict, notFound } from "../utils/httpError.js";
import { escapeRegex, estimateReadingTime, slugify, stripHtml } from "../utils/text.js";
import { cached, clearContentCache } from "./contentCache.js";

/**
 * Articles and blog posts. MongoDB stores the field names of the article
 * schema (excerpt, featuredImage, metaTitle …); the API speaks the names the
 * Vue site and admin already use (description, coverImage, seoTitle …).
 * This file is the only place the two meet.
 */

export const KINDS = { articles: "article", blogs: "blog", article: "article", blog: "blog" };

export function kindFrom(value) {
  const kind = KINDS[String(value || "article")];
  if (!kind) throw badRequest(`Unknown kind "${value}" (use article or blog).`);
  return kind;
}

/** Model document → the shape src/services/posts.js normalizes. */
export function toClient(doc) {
  const published = doc.status === "published";
  return {
    id: String(doc._id),
    kind: doc.kind,
    title: doc.title,
    slug: doc.slug,
    description: doc.excerpt,
    content: doc.content,
    category: doc.category,
    tags: doc.tags || [],
    coverImage: doc.featuredImage,
    author: doc.author,
    published,
    status: doc.status,
    publishedAt: doc.publishedAt,
    // The site sorts and dates posts by createdAt: the publish date once
    // there is one.
    createdAt: doc.publishedAt || doc.createdAt,
    updatedAt: doc.updatedAt,
    views: doc.views || 0,
    likes: doc.likes || 0,
    readingTime: doc.readingTime || 1,
    seoTitle: doc.metaTitle,
    seoDescription: doc.metaDescription,
    canonicalUrl: doc.canonical,
    focusKeyword: doc.focusKeyword,
    ogTitle: doc.ogTitle,
    ogDescription: doc.ogDescription,
    ogImage: doc.ogImage,
    twitterTitle: doc.twitterTitle,
    twitterDescription: doc.twitterDescription,
    schema: doc.schemaMarkup ?? null,
    faqs: (doc.faq || []).map(({ question, answer }) => ({ question, answer })),
    featured: !!doc.featured,
    difficulty: doc.difficulty,
    keyTakeaways: doc.keyTakeaways || [],
    guideCategory: doc.guideCategory,
    guideCardId: doc.guideCardId,
    guideSection: doc.guideSection,
  };
}

const text = (v) => (v == null ? "" : String(v).trim());
const strings = (v) => (Array.isArray(v) ? v.map(text).filter(Boolean) : text(v) ? text(v).split(",").map(text).filter(Boolean) : []);

// client field (or schema field) → [model field, sanitize]
const FIELDS = {
  title: ["title", text],
  description: ["excerpt", text],
  excerpt: ["excerpt", text],
  content: ["content", (v) => (v == null ? "" : String(v))],
  category: ["category", text],
  tags: ["tags", strings],
  coverImage: ["featuredImage", text],
  featuredImage: ["featuredImage", text],
  author: ["author", (v) => text(v) || "cryptolearner.us Team"],
  seoTitle: ["metaTitle", text],
  metaTitle: ["metaTitle", text],
  seoDescription: ["metaDescription", text],
  metaDescription: ["metaDescription", text],
  canonicalUrl: ["canonical", text],
  canonical: ["canonical", text],
  focusKeyword: ["focusKeyword", text],
  ogTitle: ["ogTitle", text],
  ogDescription: ["ogDescription", text],
  ogImage: ["ogImage", text],
  twitterTitle: ["twitterTitle", text],
  twitterDescription: ["twitterDescription", text],
  schema: ["schemaMarkup", (v) => (v && typeof v === "object" ? v : null)],
  schemaMarkup: ["schemaMarkup", (v) => (v && typeof v === "object" ? v : null)],
  faqs: ["faq", faqList],
  faq: ["faq", faqList],
  featured: ["featured", Boolean],
  difficulty: ["difficulty", text],
  keyTakeaways: ["keyTakeaways", strings],
  guideCategory: ["guideCategory", text],
  guideCardId: ["guideCardId", text],
  guideSection: ["guideSection", text],
  views: ["views", (v) => Math.max(0, Number(v) || 0)],
  likes: ["likes", (v) => Math.max(0, Number(v) || 0)],
};

function faqList(value) {
  return (Array.isArray(value) ? value : [])
    .map((f) => ({ question: text(f?.question), answer: text(f?.answer) }))
    .filter((f) => f.question && f.answer);
}

/** Request body (either naming) → model update. Only fields present are set. */
function fromClient(body, existing) {
  const update = {};
  for (const [key, [field, sanitize]] of Object.entries(FIELDS)) {
    if (body[key] !== undefined) update[field] = sanitize(body[key]);
  }

  if (body.slug !== undefined || !existing) {
    update.slug = slugify(body.slug || body.title || existing?.title || "");
  }
  if (update.content !== undefined) {
    update.readingTime = estimateReadingTime(update.content);
    if (!update.excerpt && !existing?.excerpt) update.excerpt = stripHtml(update.content, 160);
  }

  const status = body.status ?? (body.published === undefined ? undefined : body.published ? "published" : "draft");
  if (status !== undefined) {
    if (!["draft", "published"].includes(status)) throw badRequest('status must be "draft" or "published".');
    update.status = status;
    if (status === "published" && !existing?.publishedAt) {
      update.publishedAt = body.publishedAt ? new Date(body.publishedAt) : new Date();
    }
  }
  return update;
}

function rethrowDuplicate(err) {
  if (err?.code === 11000) throw conflict("slug-taken", "Another post already uses this slug.");
  throw err;
}

function assertId(id) {
  if (!mongoose.isValidObjectId(id)) throw notFound("Post not found.");
}

/* ---------------- queries ---------------- */

/**
 * @param {object} options
 * @param {boolean} options.includeDrafts  only for signed-in editors
 */
export async function listArticles({ kind, includeDrafts = false, guideCardId, search, category, tag, featured, limit, skip, summary } = {}) {
  const filter = { kind: kindFrom(kind) };
  if (!includeDrafts) filter.status = "published";
  if (guideCardId) filter.guideCardId = String(guideCardId);
  if (category) filter.category = new RegExp(`^${escapeRegex(category)}$`, "i");
  if (tag) filter.tags = new RegExp(`^${escapeRegex(tag)}$`, "i");
  if (featured !== undefined) filter.featured = featured;
  if (search) {
    const pattern = new RegExp(escapeRegex(String(search).trim()), "i");
    filter.$or = [{ title: pattern }, { excerpt: pattern }, { tags: pattern }, { category: pattern }];
  }

  let query = Article.find(filter).sort(includeDrafts ? { createdAt: -1 } : { publishedAt: -1, createdAt: -1 });
  if (summary) query = query.select("-content");
  if (skip) query = query.skip(Math.max(0, Number(skip) || 0));
  if (limit) query = query.limit(Math.min(500, Math.max(1, Number(limit) || 0)));
  return (await query.lean()).map(toClient);
}

export async function getArticleBySlug(kind, slug, { includeDrafts = false } = {}) {
  const filter = { kind: kindFrom(kind), slug: String(slug).toLowerCase() };
  if (!includeDrafts) filter.status = "published";
  const doc = await Article.findOne(filter).lean();
  return doc ? toClient(doc) : null;
}

export async function getArticleById(id) {
  assertId(id);
  const doc = await Article.findById(id).lean();
  if (!doc) throw notFound("Post not found.");
  return toClient(doc);
}

export async function slugExists(kind, slug, excludeId) {
  const filter = { kind: kindFrom(kind), slug: slugify(slug) };
  if (excludeId && mongoose.isValidObjectId(excludeId)) filter._id = { $ne: excludeId };
  return !!(await Article.exists(filter));
}

export async function createArticle(kind, body, user) {
  const update = fromClient(body, null);
  try {
    const doc = await Article.create({ ...update, kind: kindFrom(kind), createdBy: user?.id, updatedBy: user?.id });
    clearContentCache();
    return toClient(doc.toObject());
  } catch (err) {
    return rethrowDuplicate(err);
  }
}

export async function updateArticle(id, body, user) {
  assertId(id);
  const existing = await Article.findById(id).lean();
  if (!existing) throw notFound("Post not found.");
  try {
    const doc = await Article.findByIdAndUpdate(id, { ...fromClient(body, existing), updatedBy: user?.id }, { returnDocument: "after", runValidators: true }).lean();
    clearContentCache();
    return toClient(doc);
  } catch (err) {
    return rethrowDuplicate(err);
  }
}

export async function deleteArticle(id) {
  assertId(id);
  const doc = await Article.findByIdAndDelete(id).lean();
  if (!doc) throw notFound("Post not found.");
  clearContentCache();
}

/** Atomic counter change on a published post; returns the new value. */
export async function bumpCounter(id, field, delta) {
  assertId(id);
  const doc = await Article.findOneAndUpdate(
    { _id: id, status: "published", ...(delta < 0 ? { [field]: { $gt: 0 } } : {}) },
    { $inc: { [field]: delta } },
    { returnDocument: "after", projection: { [field]: 1 }, timestamps: false },
  ).lean();
  if (!doc) {
    const current = await Article.findById(id, { [field]: 1, status: 1 }).lean();
    if (!current || current.status !== "published") throw notFound("Post not found.");
    return current[field] || 0;
  }
  return doc[field];
}

/** Categories / tags with how many published posts use them. */
export async function taxonomy(field, kind) {
  const match = { status: "published" };
  if (kind) match.kind = kindFrom(kind);
  const path = field === "tags" ? "$tags" : "$category";
  const rows = await Article.aggregate([
    { $match: match },
    ...(field === "tags" ? [{ $unwind: "$tags" }] : []),
    { $match: { [field === "tags" ? "tags" : "category"]: { $nin: ["", null] } } },
    { $group: { _id: path, count: { $sum: 1 } } },
    { $sort: { count: -1, _id: 1 } },
  ]);
  return rows.map((r) => ({ name: r._id, slug: slugify(r._id), count: r.count }));
}

/* ---------------- server rendering data source ---------------- */

/** Published posts of a collection ("articles" | "blogs"), briefly cached. */
export function listPublishedForRender(collection) {
  return cached(`posts:${collection}`, () => listArticles({ kind: collection }));
}

/** Any post with this slug, published or not (the Vue page decides). */
export function getArticleBySlugAnyStatus(collection, slug) {
  return getArticleBySlug(collection, slug, { includeDrafts: true });
}
