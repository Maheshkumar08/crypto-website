import mongoose from "mongoose";

/** Images uploaded through the admin (files live in UPLOAD_PATH). */
const mediaSchema = new mongoose.Schema(
  {
    filename: { type: String, required: true, unique: true },
    originalName: { type: String, default: "" },
    folder: { type: String, default: "" },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    width: { type: Number, default: null },
    height: { type: Number, default: null },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true },
);

export const Media = mongoose.model("Media", mediaSchema);
