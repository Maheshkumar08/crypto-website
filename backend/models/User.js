import bcrypt from "bcrypt";
import mongoose from "mongoose";

export const ROLES = ["admin", "editor"];

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    name: { type: String, trim: true, default: "" },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ROLES, default: "editor" },
    active: { type: Boolean, default: true },
    // Bumped on logout / password change: every refresh token issued
    // before that stops working.
    tokenVersion: { type: Number, default: 0 },
    lastLoginAt: { type: Date, default: null },
  },
  { timestamps: true },
);

userSchema.methods.setPassword = async function setPassword(password) {
  if (typeof password !== "string" || password.length < 6) {
    throw new Error("Password must be at least 6 characters.");
  }
  this.passwordHash = await bcrypt.hash(password, 12);
};

userSchema.methods.checkPassword = function checkPassword(password) {
  return bcrypt.compare(String(password), this.passwordHash);
};

userSchema.methods.toPublic = function toPublic() {
  return { id: this.id, email: this.email, name: this.name, role: this.role };
};

export const User = mongoose.model("User", userSchema);
