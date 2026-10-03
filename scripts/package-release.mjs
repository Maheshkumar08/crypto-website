#!/usr/bin/env node
/**
 * `npm run release`: builds the site and assembles exactly what the cPanel
 * server needs — nothing else — into
 *
 *   release/cryptolearner.us/            → upload as /home/USERNAME/cryptolearner.us/
 *     backend/                           → cPanel "Application root"
 *       passenger.cjs                    → cPanel "Application startup file"
 *       .env                             → production settings (from backend/.env)
 *       package.json, package-lock.json  → `npm ci` on the server
 *       ssr/                             → server renderer (built)
 *     frontend/dist/                     → browser assets + page template (built)
 *
 * and packs it as release/cryptolearner-release.tar.gz for one upload.
 * Not included: node_modules, frontend sources, dev tooling, local uploads,
 * backend/.runtime, the Firestore import script.
 */
import { execFileSync } from "node:child_process";
import { randomBytes } from "node:crypto";
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const releaseRoot = path.join(root, "release");
const out = path.join(releaseRoot, "cryptolearner.us");
const npmCli = process.env.npm_execpath;

if (!npmCli) {
  console.error("Run this with `npm run release`.");
  process.exit(1);
}
const npm = (args, cwd) => execFileSync(process.execPath, [npmCli, ...args], { cwd, stdio: "inherit" });

// 1. Production build (frontend/dist + backend/ssr).
console.log("\n[release] building…");
npm(["run", "build"], root);

// 2. Fresh release folder.
rmSync(releaseRoot, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

// 3. Backend: source + built renderer, without local-only files.
const SKIP = new Set(["node_modules", ".env", ".env.example", ".runtime", "README.md"]);
cpSync(path.join(root, "backend"), path.join(out, "backend"), {
  recursive: true,
  filter: (src) => {
    const rel = path.relative(path.join(root, "backend"), src);
    if (!rel) return true;
    const [first] = rel.split(path.sep);
    if (SKIP.has(first)) return false;
    if (rel === path.join("scripts", "import-firestore.js")) return false; // one-time local migration
    if (first === "uploads") return false; // UPLOAD_PATH points outside backend/
    return true;
  },
});

// The Firestore import is not shipped, so neither is its npm script.
const pkgFile = path.join(out, "backend", "package.json");
const pkg = JSON.parse(readFileSync(pkgFile, "utf8"));
delete pkg.scripts["import:firestore"];
delete pkg.scripts.dev;
writeFileSync(pkgFile, JSON.stringify(pkg, null, 2) + "\n");

// 4. Frontend: only the build output.
cpSync(path.join(root, "frontend", "dist"), path.join(out, "frontend", "dist"), { recursive: true });

// 5. Apache must never hand out these folders as files, whatever the
//    domain's document root is (Express serves everything itself).
const DENY = "# Served by the Node.js app (Express), never directly by Apache.\nRequire all denied\n";
writeFileSync(path.join(out, "backend", ".htaccess"), DENY);
writeFileSync(path.join(out, "frontend", ".htaccess"), DENY);

// 6. Production backend/.env: the local values (MongoDB URI, admin, JWT
//    secrets) with production settings on top.
const localEnv = path.join(root, "backend", ".env");
const values = Object.fromEntries(
  (existsSync(localEnv) ? readFileSync(localEnv, "utf8") : "")
    .split(/\r?\n/)
    .filter((line) => /^[A-Z_]+=/.test(line))
    .map((line) => [line.slice(0, line.indexOf("=")), line.slice(line.indexOf("=") + 1).trim()]),
);
const secret = (key) => values[key] || randomBytes(48).toString("base64url");
const siteUrl = process.env.RELEASE_SITE_URL || "https://www.cryptolearner.us";
writeFileSync(
  path.join(out, "backend", ".env"),
  `# cryptolearner.us — production settings (cPanel / Passenger).
# PORT is not set: Passenger assigns the socket itself.

NODE_ENV=production
SITE_URL=${siteUrl}

# MongoDB Atlas connection string (Atlas → Network Access must allow this server's IP).
MONGODB_URI=${values.MONGODB_URI || ""}

# Login token signing keys. Keep them secret; changing them signs everyone out.
JWT_SECRET=${secret("JWT_SECRET")}
JWT_REFRESH_SECRET=${secret("JWT_REFRESH_SECRET")}

# Created on first start if this account doesn't exist. Change the password
# after signing in: npm run create-user -- --email <email> --password "<new>"
ADMIN_EMAIL=${values.ADMIN_EMAIL || "admin52@gmail.com"}
ADMIN_PASSWORD=${values.ADMIN_PASSWORD || "123456"}

# Uploaded images (served at /uploads). Outside backend/ so a redeploy of the
# code never touches them; created automatically.
UPLOAD_PATH=../uploads

# One reverse proxy (Apache/LiteSpeed) sits in front of Node.
TRUST_PROXY=1
`,
);

// 7. Exact dependency versions for `npm ci` on the server (backend only —
//    the server needs none of the frontend's packages).
console.log("\n[release] locking backend dependencies…");
npm(["install", "--package-lock-only", "--ignore-scripts", "--no-audit", "--no-fund"], path.join(out, "backend"));

// 8. One archive to upload.
execFileSync("tar", ["-czf", "cryptolearner-release.tar.gz", "cryptolearner.us"], { cwd: releaseRoot, stdio: "inherit" });

console.log(`
[release] done:
  ${path.join(releaseRoot, "cryptolearner-release.tar.gz")}
  ${out}${values.MONGODB_URI ? "" : "\n\n  ! MONGODB_URI is empty — fill it in release/cryptolearner.us/backend/.env (or on the server)"}
`);
