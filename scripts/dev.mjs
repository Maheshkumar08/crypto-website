#!/usr/bin/env node
/**
 * `npm run dev`: the API (backend, restarted on file changes) and the Vite
 * dev server (frontend, which proxies /api and /uploads to the API) in one
 * terminal. Ctrl+C stops both.
 */
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
// npm's own CLI, run by this Node binary: no shell needed on any platform.
const npmCli = process.env.npm_execpath;
if (!npmCli) {
  console.error("Start this with `npm run dev`.");
  process.exit(1);
}

const processes = [
  { name: "api", color: 36, args: ["run", "dev", "--workspace", "backend"], env: { NODE_ENV: "development" } },
  { name: "web", color: 35, args: ["run", "dev", "--workspace", "frontend"], env: {} },
].map(({ name, color, args, env }) => {
  const child = spawn(process.execPath, [npmCli, ...args], {
    cwd: root,
    env: { ...process.env, ...env, FORCE_COLOR: "1" },
    stdio: ["inherit", "pipe", "pipe"],
  });
  const prefix = `\x1b[${color}m[${name}]\x1b[0m `;
  const relay = (stream, out) => {
    let buffer = "";
    stream.on("data", (chunk) => {
      buffer += chunk;
      const lines = buffer.split(/\r?\n/);
      buffer = lines.pop();
      for (const line of lines) out.write(prefix + line + "\n");
    });
  };
  relay(child.stdout, process.stdout);
  relay(child.stderr, process.stderr);
  child.on("exit", (code) => {
    console.log(`${prefix}exited with code ${code}`);
    shutdown(code ?? 0);
  });
  return child;
});

let stopping = false;
function shutdown(code) {
  if (stopping) return;
  stopping = true;
  for (const child of processes) if (child.exitCode === null) child.kill();
  setTimeout(() => process.exit(code), 500);
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));
