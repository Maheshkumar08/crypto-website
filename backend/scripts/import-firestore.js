#!/usr/bin/env node
/**
 * One-time migration: copies the old Firestore content into MongoDB.
 * Uses Firestore's public REST API over HTTPS — no Firebase SDK.
 *
 *   npm run import:firestore -- --project crypto-blog-b2fc7
 *   npm run import:firestore -- --project crypto-blog-b2fc7 --service-account ./serviceAccountKey.json
 *
 * Collections the Firestore rules don't let anyone read (blogs, messages,
 * newsletter) need --service-account. Re-running updates the same
 * documents (matched by their Firestore id); nothing is duplicated.
 */
import { createSign } from "node:crypto";
import { readFileSync } from "node:fs";
import { parseArgs } from "node:util";
import "../models/index.js";
import { connectDatabase, disconnectDatabase } from "../config/db.js";
import { Article } from "../models/Article.js";
import { GuideCard } from "../models/GuideCard.js";
import { Message } from "../models/Message.js";
import { Page } from "../models/Page.js";
import { Subscriber } from "../models/Subscriber.js";
import { estimateReadingTime, slugify, stripHtml } from "../utils/text.js";

const { values } = parseArgs({
  options: {
    project: { type: "string" },
    "service-account": { type: "string" },
    "api-key": { type: "string" },
    collections: { type: "string", default: "articles,blogs,pages,guideCards,messages,newsletter" },
  },
});

if (!values.project) {
  console.error("Usage: npm run import:firestore -- --project <firebase-project-id> [--service-account <key.json>] [--api-key <web api key>]");
  process.exit(1);
}

let token = null;

async function accessToken() {
  if (!values["service-account"]) return null;
  if (token) return token;
  const key = JSON.parse(readFileSync(values["service-account"], "utf8"));
  const now = Math.floor(Date.now() / 1000);
  const encode = (obj) => Buffer.from(JSON.stringify(obj)).toString("base64url");
  const unsigned = `${encode({ alg: "RS256", typ: "JWT" })}.${encode({
    iss: key.client_email,
    scope: "https://www.googleapis.com/auth/datastore",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  })}`;
  const signature = createSign("RSA-SHA256").update(unsigned).sign(key.private_key, "base64url");
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: `${unsigned}.${signature}` }),
  });
  const body = await res.json();
  if (!body.access_token) throw new Error(`Service-account login failed: ${body.error_description || res.status}`);
  return (token = body.access_token);
}

function decode(value) {
  const [type, raw] = Object.entries(value)[0];
  switch (type) {
    case "stringValue":
    case "referenceValue":
      return raw;
    case "booleanValue":
      return raw;
    case "integerValue":
      return Number(raw);
    case "doubleValue":
      return Number(raw);
    case "timestampValue":
      return new Date(raw);
    case "arrayValue":
      return (raw.values || []).map(decode);
    case "mapValue":
      return Object.fromEntries(Object.entries(raw.fields || {}).map(([k, v]) => [k, decode(v)]));
    default:
      return null;
  }
}

async function listDocuments(collection) {
  const documents = [];
  let pageToken = "";
  do {
    const params = new URLSearchParams({ pageSize: "300" });
    if (pageToken) params.set("pageToken", pageToken);
    const bearer = await accessToken();
    if (!bearer && values["api-key"]) params.set("key", values["api-key"]);
    const url = `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(values.project)}/databases/(default)/documents/${collection}?${params}`;
    const res = await fetch(url, { headers: bearer ? { Authorization: `Bearer ${bearer}` } : {} });
    const body = await res.json();
    if (!res.ok) {
      console.warn(`  ! ${collection}: ${body.error?.message || res.status}${bearer ? "" : " (try --service-account)"}`);
      return documents;
    }
    for (const doc of body.documents || []) {
      const fields = Object.fromEntries(Object.entries(doc.fields || {}).map(([k, v]) => [k, decode(v)]));
      documents.push({ id: doc.name.split("/").pop(), ...fields });
    }
    pageToken = body.nextPageToken || "";
  } while (pageToken);
  return documents;
}

/** Firestore article/blog → Article fields. */
function articleFields(doc, kind) {
  const content = String(doc.content || "");
  const createdAt = doc.createdAt instanceof Date ? doc.createdAt : new Date();
  const published = !!doc.published;
  return {
    kind,
    title: String(doc.title || ""),
    slug: slugify(doc.slug || doc.title || doc.id),
    excerpt: String(doc.description || "") || stripHtml(content, 160),
    content,
    category: String(doc.category || ""),
    tags: Array.isArray(doc.tags) ? doc.tags.map(String) : [],
    featuredImage: String(doc.coverImage || ""),
    author: String(doc.author || "") || "cryptolearner.us Team",
    status: published ? "published" : "draft",
    publishedAt: published ? createdAt : null,
    views: Number(doc.views) || 0,
    likes: Number(doc.likes) || 0,
    readingTime: Number(doc.readingTime) || estimateReadingTime(content),
    metaTitle: String(doc.seoTitle || ""),
    metaDescription: String(doc.seoDescription || ""),
    canonical: String(doc.canonicalUrl || ""),
    focusKeyword: String(doc.focusKeyword || ""),
    ogImage: String(doc.ogImage || ""),
    faq: (Array.isArray(doc.faqs) ? doc.faqs : []).filter((f) => f?.question && f?.answer).map((f) => ({ question: f.question, answer: f.answer })),
    featured: !!doc.featured,
    difficulty: String(doc.difficulty || ""),
    keyTakeaways: Array.isArray(doc.keyTakeaways) ? doc.keyTakeaways.map(String) : [],
    guideCategory: String(doc.guideCategory || ""),
    guideCardId: String(doc.guideCardId || ""),
    guideSection: String(doc.guideSection || ""),
    legacyId: doc.id,
    createdAt,
    updatedAt: doc.updatedAt instanceof Date ? doc.updatedAt : createdAt,
  };
}

/**
 * Insert or update by legacy id, keeping the original timestamps. Firestore
 * never enforced unique slugs; a clash gets the source id appended.
 */
async function upsert(Model, filter, fields) {
  try {
    await Model.collection.updateOne(filter, { $set: fields }, { upsert: true });
  } catch (err) {
    if (err?.code !== 11000 || !fields.slug || !fields.legacyId) throw err;
    const slug = `${fields.slug}-${fields.legacyId.slice(0, 6).toLowerCase()}`;
    console.warn(`  ! slug "${fields.slug}" is already used — imported as "${slug}"`);
    await Model.collection.updateOne(filter, { $set: { ...fields, slug } }, { upsert: true });
  }
}

const importers = {
  async articles(docs) {
    for (const doc of docs) await upsert(Article, { legacyId: doc.id, kind: "article" }, articleFields(doc, "article"));
  },
  async blogs(docs) {
    for (const doc of docs) await upsert(Article, { legacyId: doc.id, kind: "blog" }, articleFields(doc, "blog"));
  },
  async pages(docs) {
    for (const doc of docs) {
      const createdAt = doc.createdAt instanceof Date ? doc.createdAt : new Date();
      await upsert(Page, { legacyId: doc.id }, {
        title: String(doc.title || ""),
        slug: slugify(doc.slug || doc.title || doc.id),
        coverImage: String(doc.coverImage || ""),
        shortDescription: String(doc.shortDescription || doc.metaDescription || ""),
        content: String(doc.content || ""),
        seoTitle: String(doc.seoTitle || ""),
        metaDescription: String(doc.metaDescription || doc.shortDescription || ""),
        status: doc.published ? "published" : "draft",
        publishedAt: doc.published ? createdAt : null,
        sortOrder: Number(doc.sortOrder) || 0,
        author: String(doc.author || "") || "cryptolearner.us Team",
        legacyId: doc.id,
        createdAt,
        updatedAt: doc.updatedAt instanceof Date ? doc.updatedAt : createdAt,
      });
    }
  },
  async guideCards(docs) {
    for (const doc of docs) {
      if (!doc.cardId) continue;
      await upsert(GuideCard, { cardId: slugify(doc.cardId) }, {
        cardId: slugify(doc.cardId),
        category: String(doc.category || ""),
        title: String(doc.title || ""),
        description: String(doc.description || ""),
        order: Number(doc.order) || 0,
        enabled: doc.enabled !== false,
        legacyId: doc.id,
        createdAt: doc.createdAt instanceof Date ? doc.createdAt : new Date(),
        updatedAt: doc.updatedAt instanceof Date ? doc.updatedAt : new Date(),
      });
    }
  },
  async messages(docs) {
    for (const doc of docs) {
      if (!doc.email || !doc.message) continue;
      await upsert(Message, { email: String(doc.email).toLowerCase(), createdAt: doc.createdAt }, {
        name: String(doc.name || ""),
        email: String(doc.email).toLowerCase(),
        subject: String(doc.subject || "(no subject)"),
        message: String(doc.message),
        read: !!doc.read,
        createdAt: doc.createdAt instanceof Date ? doc.createdAt : new Date(),
        updatedAt: new Date(),
      });
    }
  },
  async newsletter(docs) {
    for (const doc of docs) {
      if (!doc.email) continue;
      const email = String(doc.email).toLowerCase();
      await upsert(Subscriber, { email }, { email, source: String(doc.source || "blog"), createdAt: doc.createdAt instanceof Date ? doc.createdAt : new Date(), updatedAt: new Date() });
    }
  },
};

try {
  await connectDatabase();
  for (const collection of values.collections.split(",").map((c) => c.trim()).filter(Boolean)) {
    if (!importers[collection]) {
      console.warn(`  ! unknown collection "${collection}"`);
      continue;
    }
    const docs = await listDocuments(collection);
    await importers[collection](docs);
    console.log(`  ${collection}: ${docs.length} imported`);
  }
  console.log("Done. Check the admin, then this script is no longer needed.");
} catch (err) {
  console.error(`Import failed: ${err.message}`);
  process.exitCode = 1;
} finally {
  await disconnectDatabase();
}
