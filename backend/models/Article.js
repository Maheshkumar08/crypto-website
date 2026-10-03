import mongoose from "mongoose";

const faqSchema = new mongoose.Schema(
  {
    question: { type: String, trim: true, default: "" },
    answer: { type: String, trim: true, default: "" },
  },
  { _id: false },
);

/**
 * Articles and blog posts (one collection; `kind` tells them apart). The
 * body is stored as HTML exactly as the admin editor produces it.
 */
const articleSchema = new mongoose.Schema(
  {
    kind: { type: String, enum: ["article", "blog"], required: true, index: true },

    title: { type: String, trim: true, default: "" },
    slug: { type: String, trim: true, lowercase: true, default: "" },
    excerpt: { type: String, trim: true, default: "" },
    content: { type: String, default: "" },

    category: { type: String, trim: true, default: "", index: true },
    tags: { type: [String], default: [] },
    featuredImage: { type: String, trim: true, default: "" },
    author: { type: String, trim: true, default: "cryptolearner.us Team" },

    status: { type: String, enum: ["draft", "published"], default: "draft", index: true },
    publishedAt: { type: Date, default: null },

    views: { type: Number, default: 0, min: 0 },
    likes: { type: Number, default: 0, min: 0 },
    readingTime: { type: Number, default: 1, min: 1 },

    metaTitle: { type: String, trim: true, default: "" },
    metaDescription: { type: String, trim: true, default: "" },
    canonical: { type: String, trim: true, default: "" },
    focusKeyword: { type: String, trim: true, default: "" },
    ogTitle: { type: String, trim: true, default: "" },
    ogDescription: { type: String, trim: true, default: "" },
    ogImage: { type: String, trim: true, default: "" },
    twitterTitle: { type: String, trim: true, default: "" },
    twitterDescription: { type: String, trim: true, default: "" },
    // Extra JSON-LD node(s) merged into the page's @graph. Exposed as
    // "schema" by the API; stored under another name because "schema" is a
    // reserved Mongoose path (every document uses doc.schema internally).
    schemaMarkup: { type: mongoose.Schema.Types.Mixed, default: null },
    faq: { type: [faqSchema], default: [] },
    featured: { type: Boolean, default: false },

    // Fields the existing admin editor and article page use.
    difficulty: { type: String, trim: true, default: "" },
    keyTakeaways: { type: [String], default: [] },
    guideCategory: { type: String, trim: true, default: "" },
    guideCardId: { type: String, trim: true, default: "", index: true },
    guideSection: { type: String, trim: true, default: "" },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    // The source document id when imported from the old database.
    legacyId: { type: String, default: "", index: true },
  },
  { timestamps: true },
);

// One post per slug within articles / within blogs. Drafts may be saved
// before they have a slug, so empty slugs are left out of the index.
articleSchema.index(
  { kind: 1, slug: 1 },
  { unique: true, partialFilterExpression: { slug: { $type: "string", $gt: "" } } },
);
articleSchema.index({ kind: 1, status: 1, publishedAt: -1 });

export const Article = mongoose.model("Article", articleSchema);
