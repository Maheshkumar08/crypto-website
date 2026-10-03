import mongoose from "mongoose";

/** Standalone pages managed under Admin → Pages, served at /<slug>. */
const pageSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true, default: "" },
    slug: { type: String, trim: true, lowercase: true, default: "" },
    coverImage: { type: String, trim: true, default: "" },
    shortDescription: { type: String, trim: true, default: "" },
    content: { type: String, default: "" },
    seoTitle: { type: String, trim: true, default: "" },
    metaDescription: { type: String, trim: true, default: "" },
    status: { type: String, enum: ["draft", "published"], default: "draft", index: true },
    publishedAt: { type: Date, default: null },
    sortOrder: { type: Number, default: 0 },
    author: { type: String, trim: true, default: "cryptolearner.us Team" },
    legacyId: { type: String, default: "", index: true },
  },
  { timestamps: true },
);

pageSchema.index({ slug: 1 }, { unique: true, partialFilterExpression: { slug: { $type: "string", $gt: "" } } });

export const Page = mongoose.model("Page", pageSchema);
