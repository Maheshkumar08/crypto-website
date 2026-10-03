import mongoose from "mongoose";

/**
 * Cards on the learning-section pages (/getting-started, /safety …). An
 * article joins a card through its guideCardId = the card's cardId.
 */
const guideCardSchema = new mongoose.Schema(
  {
    cardId: { type: String, trim: true, required: true, unique: true },
    category: { type: String, trim: true, required: true, index: true },
    title: { type: String, trim: true, default: "" },
    description: { type: String, trim: true, default: "" },
    order: { type: Number, default: 0 },
    enabled: { type: Boolean, default: true },
    legacyId: { type: String, default: "", index: true },
  },
  { timestamps: true },
);

export const GuideCard = mongoose.model("GuideCard", guideCardSchema);
