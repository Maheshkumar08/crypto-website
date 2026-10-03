import { randomBytes } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import jwt from "jsonwebtoken";
import { config } from "../config/env.js";
import { User } from "../models/User.js";
import { HttpError, unauthorized } from "../utils/httpError.js";

/**
 * JWT auth: a short-lived access token (sent as `Authorization: Bearer`,
 * kept in memory by the admin) and a long-lived refresh token in an
 * httpOnly cookie, rotated on every refresh. Logging out bumps the user's
 * tokenVersion, which invalidates every refresh token issued before.
 */

export const REFRESH_COOKIE = "cl_refresh";

export function refreshCookieOptions() {
  return {
    httpOnly: true,
    secure: config.siteUrl.startsWith("https://"),
    sameSite: "strict",
    path: "/api/auth",
    maxAge: durationMs(config.jwt.refreshExpire),
  };
}

function durationMs(value) {
  const match = /^(\d+)\s*([smhd])?$/.exec(String(value).trim());
  if (!match) return 30 * 24 * 3600 * 1000;
  const unit = { s: 1, m: 60, h: 3600, d: 86400 }[match[2] || "s"];
  return Number(match[1]) * unit * 1000;
}

function issueTokens(user) {
  const accessToken = jwt.sign({ sub: user.id, role: user.role }, config.jwt.accessSecret, {
    expiresIn: config.jwt.accessExpire,
    audience: "cl-api",
  });
  const refreshToken = jwt.sign({ sub: user.id, v: user.tokenVersion }, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpire,
    audience: "cl-refresh",
  });
  return { accessToken, refreshToken };
}

/** Verifies an access token; returns { id, role } or null. */
export function verifyAccessToken(token) {
  try {
    const payload = jwt.verify(token, config.jwt.accessSecret, { audience: "cl-api" });
    return { id: payload.sub, role: payload.role };
  } catch {
    return null;
  }
}

export async function login(email, password) {
  const user = await User.findOne({ email: String(email || "").trim().toLowerCase() }).select("+passwordHash");
  // Same error for unknown email and wrong password.
  if (!user || !user.active || !(await user.checkPassword(password || ""))) {
    throw new HttpError(401, "invalid-credentials", "Invalid email or password.");
  }
  user.lastLoginAt = new Date();
  await user.save();
  return { user: user.toPublic(), ...issueTokens(user) };
}

export async function refresh(refreshToken) {
  if (!refreshToken) throw unauthorized("No active session.");
  let payload;
  try {
    payload = jwt.verify(refreshToken, config.jwt.refreshSecret, { audience: "cl-refresh" });
  } catch {
    throw unauthorized("Session expired — sign in again.");
  }
  const user = await User.findById(payload.sub);
  if (!user || !user.active || user.tokenVersion !== payload.v) throw unauthorized("Session expired — sign in again.");
  return { user: user.toPublic(), ...issueTokens(user) };
}

export async function logout(refreshToken) {
  if (!refreshToken) return;
  try {
    const payload = jwt.verify(refreshToken, config.jwt.refreshSecret, { audience: "cl-refresh" });
    await User.updateOne({ _id: payload.sub, tokenVersion: payload.v }, { $inc: { tokenVersion: 1 } });
  } catch {
    // An expired or invalid token has nothing left to revoke.
  }
}

export async function getUser(id) {
  const user = await User.findById(id);
  if (!user || !user.active) throw unauthorized();
  return user.toPublic();
}

/** Creates or updates a user (CLI). */
export async function upsertUser({ email, password, name, role = "admin" }) {
  const normalized = String(email || "").trim().toLowerCase();
  if (!normalized.includes("@")) throw new Error("A valid email is required.");
  const user = (await User.findOne({ email: normalized })) || new User({ email: normalized });
  if (name) user.name = name;
  user.role = role;
  user.active = true;
  await user.setPassword(password);
  user.tokenVersion += user.isNew ? 0 : 1;
  await user.save();
  return user.toPublic();
}

/**
 * On every start: if there is no account for ADMIN_EMAIL, create it as an
 * admin with ADMIN_PASSWORD (stored as a bcrypt hash), or with a generated
 * password written to backend/.runtime/initial-admin.txt (never to the log).
 * An existing account is never changed.
 */
export async function ensureInitialAdmin() {
  const { email, name } = config.admin;
  if (!email) {
    if (!(await User.exists({}))) console.warn("[auth] no users yet and ADMIN_EMAIL is empty — set ADMIN_EMAIL / ADMIN_PASSWORD in backend/.env to create the first admin");
    return;
  }
  if (await User.exists({ email })) {
    await warnIfDefaultPassword();
    return;
  }

  const generated = !config.admin.password;
  const password = config.admin.password || randomBytes(12).toString("base64url");
  await upsertUser({ email, password, name, role: "admin" });

  if (generated) {
    mkdirSync(config.paths.runtime, { recursive: true });
    const file = path.join(config.paths.runtime, "initial-admin.txt");
    writeFileSync(
      file,
      `Admin sign-in for ${config.siteUrl}/admin/login\n\nEmail:    ${email}\nPassword: ${password}\n\nChange it with: npm run create-user -- --email ${email} --password <new password>\nThen delete this file.\n`,
      { mode: 0o600 },
    );
    console.log(`[auth] created admin ${email}; the generated password is in ${file}`);
  } else {
    console.log(`[auth] created admin ${email} from ADMIN_EMAIL / ADMIN_PASSWORD`);
    await warnIfDefaultPassword();
  }
}

/** Logged on every start while the seeded admin still has a short password from .env. */
async function warnIfDefaultPassword() {
  const { email, password } = config.admin;
  if (!password || password.length >= 12) return;
  const user = await User.findOne({ email }).select("+passwordHash");
  if (user && (await user.checkPassword(password))) {
    console.warn(`[auth] WARNING: ${email} still uses the short ADMIN_PASSWORD from .env — change it: npm run create-user -- --email ${email} --password "<a long password>"`);
  }
}
