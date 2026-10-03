import mongoose from "mongoose";
import { Page } from "../models/Page.js";
import { conflict, notFound } from "../utils/httpError.js";
import { slugify } from "../utils/text.js";
import { cached, clearContentCache } from "./contentCache.js";

/** Pages: the API shape matches src/services/pages.js's normalize(). */
export function toClient(doc) {
  return {
    id: String(doc._id),
    title: doc.title,
    slug: doc.slug,
    coverImage: doc.coverImage,
    shortDescription: doc.shortDescription,
    content: doc.content,
    seoTitle: doc.seoTitle,
    metaDescription: doc.metaDescription,
    published: doc.status === "published",
    status: doc.status,
    sortOrder: doc.sortOrder || 0,
    author: doc.author,
    createdAt: doc.publishedAt || doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

const text = (v) => (v == null ? "" : String(v).trim());

function fromClient(body, existing) {
  const update = {};
  for (const key of ["title", "coverImage", "shortDescription", "seoTitle", "metaDescription"]) {
    if (body[key] !== undefined) update[key] = text(body[key]);
  }
  if (body.content !== undefined) update.content = String(body.content ?? "");
  if (body.sortOrder !== undefined) update.sortOrder = Number(body.sortOrder) || 0;
  if (body.author !== undefined) update.author = text(body.author) || "cryptolearner.us Team";
  if (body.slug !== undefined || !existing) update.slug = slugify(body.slug || body.title || existing?.title || "");
  if (update.metaDescription === "" && update.shortDescription) update.metaDescription = update.shortDescription;

  const status = body.status ?? (body.published === undefined ? undefined : body.published ? "published" : "draft");
  if (status !== undefined) {
    update.status = status === "published" ? "published" : "draft";
    if (update.status === "published" && !existing?.publishedAt) update.publishedAt = new Date();
  }
  return update;
}

function assertId(id) {
  if (!mongoose.isValidObjectId(id)) throw notFound("Page not found.");
}

function rethrowDuplicate(err) {
  if (err?.code === 11000) throw conflict("slug-taken", "Another page already uses this slug.");
  throw err;
}

export async function listPages({ includeDrafts = false } = {}) {
  const docs = await Page.find(includeDrafts ? {} : { status: "published" }).sort({ sortOrder: 1, title: 1 }).lean();
  return docs.map(toClient);
}

export async function getPageBySlug(slug, { includeDrafts = false } = {}) {
  const doc = await Page.findOne({ slug: String(slug).toLowerCase(), ...(includeDrafts ? {} : { status: "published" }) }).lean();
  return doc ? toClient(doc) : null;
}

/** Any page with this slug, published or not (the server renderer decides). */
export async function findPageBySlug(slug) {
  const doc = await Page.findOne({ slug: String(slug).toLowerCase() }).lean();
  return doc ? toClient(doc) : null;
}

export async function getPageById(id) {
  assertId(id);
  const doc = await Page.findById(id).lean();
  if (!doc) throw notFound("Page not found.");
  return toClient(doc);
}

export async function pageSlugExists(slug, excludeId) {
  const filter = { slug: slugify(slug) };
  if (excludeId && mongoose.isValidObjectId(excludeId)) filter._id = { $ne: excludeId };
  return !!(await Page.exists(filter));
}

export async function createPage(body) {
  try {
    const doc = await Page.create(fromClient(body, null));
    clearContentCache();
    return toClient(doc.toObject());
  } catch (err) {
    return rethrowDuplicate(err);
  }
}

export async function updatePage(id, body) {
  assertId(id);
  const existing = await Page.findById(id).lean();
  if (!existing) throw notFound("Page not found.");
  try {
    const doc = await Page.findByIdAndUpdate(id, fromClient(body, existing), { returnDocument: "after", runValidators: true }).lean();
    clearContentCache();
    return toClient(doc);
  } catch (err) {
    return rethrowDuplicate(err);
  }
}

export async function deletePage(id) {
  assertId(id);
  if (!(await Page.findByIdAndDelete(id))) throw notFound("Page not found.");
  clearContentCache();
}

export function listPublishedPagesForRender() {
  return cached("pages", () => listPages());
}
