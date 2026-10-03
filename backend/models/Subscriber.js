import mongoose from "mongoose";

/** Newsletter sign-ups. */
const subscriberSchema = new mongoose.Schema(
  {
    email: { type: String, trim: true, lowercase: true, required: true, unique: true },
    source: { type: String, trim: true, default: "blog" },
  },
  { timestamps: true },
);

export const Subscriber = mongoose.model("Subscriber", subscriberSchema);
