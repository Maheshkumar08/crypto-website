import mongoose from "mongoose";

/** Contact-form submissions (/contact). */
const messageSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    email: { type: String, trim: true, lowercase: true, required: true },
    subject: { type: String, trim: true, required: true },
    message: { type: String, trim: true, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Message = mongoose.model("Message", messageSchema);
