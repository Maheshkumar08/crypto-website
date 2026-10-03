import { config as loadDotenv } from "dotenv";
import { randomBytes } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Settings come from backend/.env only (real environment variables, e.g.
 * from a hosting panel, take precedence). MONGODB_URI is the one required
 * value; the server refuses to start without it (see server.js).
 */

const backendDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const envFile = path.join(backendDir, ".env");

loadDotenv({ path: envFile, quiet: true });

const env = process.env;
const runtimeDir = path.join(backendDir, ".runtime");

function str(...names) {
  for (const name of names) {
    const value = env[name];
    if (value !== undefined && value.trim() !== "") return value.trim();
  }
  return "";
}

function int(name, fallback) {
  const value = Number.parseInt(str(name), 10);
  return Number.isFinite(value) ? value : fallback;
}

/**
 * JWT secrets from .env, or — when left empty — generated once and kept in
 * backend/.runtime/secrets.json, so sessions survive restarts.
 */
function secret(...names) {
  const fromEnv = str(...names);
  if (fromEnv) return fromEnv;

  const key = names[0];
  const file = path.join(runtimeDir, "secrets.json");
  let stored = {};
  if (existsSync(file)) {
    try {
      stored = JSON.parse(readFileSync(file, "utf8"));
    } catch {
      stored = {};
    }
  }
  if (!stored[key]) {
    stored[key] = randomBytes(48).toString("base64url");
    mkdirSync(runtimeDir, { recursive: true });
    writeFileSync(file, JSON.stringify(stored, null, 2), { mode: 0o600 });
  }
  return stored[key];
}

// `npm run dev` passes --dev; otherwise NODE_ENV decides (production if unset).
const nodeEnv = process.argv.includes("--dev") ? "development" : str("NODE_ENV") || "production";
const siteUrl = (str("SITE_URL") || "http://localhost:5173").replace(/\/+$/, "");

export const config = {
  nodeEnv,
  isProduction: nodeEnv === "production",
  isDevelopment: nodeEnv === "development",
  // A TCP port, or a socket path some hosting panels pass in PORT.
  port: /^\d+$/.test(str("PORT")) ? Number(str("PORT")) : str("PORT") || 3000,
  // Public address of the site: canonical URLs, sitemap, RSS, cookie security.
  siteUrl,
  trustProxy: int("TRUST_PROXY", 1),

  mongoUri: str("MONGODB_URI"),
  dbConnectAttempts: Math.max(1, int("DB_CONNECT_ATTEMPTS", 3)),

  jwt: {
    accessSecret: secret("JWT_SECRET"),
    accessExpire: str("JWT_EXPIRE") || "15m",
    refreshSecret: secret("JWT_REFRESH_SECRET"),
    refreshExpire: str("JWT_REFRESH_EXPIRE") || "30d",
  },

  admin: {
    email: str("ADMIN_EMAIL").toLowerCase(),
    password: str("ADMIN_PASSWORD"),
    name: str("ADMIN_NAME") || "CryptoLearner Admin",
  },

  uploads: {
    // Uploaded images: backend/uploads unless UPLOAD_PATH says otherwise.
    dir: path.resolve(backendDir, str("UPLOAD_PATH") || "uploads"),
    maxBytes: int("UPLOAD_MAX_MB", 8) * 1024 * 1024,
  },

  listCacheSeconds: int("LIST_CACHE_SECONDS", 30),

  paths: {
    backend: backendDir,
    runtime: runtimeDir,
    frontend: path.resolve(backendDir, "..", "frontend"),
    // Production build output (`npm run build` in frontend/): the prerendered
    // pages and the server bundle that renders articles.
    dist: path.resolve(backendDir, "..", "frontend", "dist"),
    ssrEntry: path.join(backendDir, "ssr", "entry-server.mjs"),
    views: path.join(backendDir, "views"),
  },
};
