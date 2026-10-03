import "./models/index.js";
import { createApp } from "./app.js";
import { config, envFile } from "./config/env.js";
import { connectDatabase, disconnectDatabase } from "./config/db.js";
import { ensureInitialAdmin } from "./services/authService.js";
import { prepareRenderer } from "./services/ssr/renderService.js";

/**
 * Startup order: database first, then the first admin, then HTTP. If MongoDB
 * can't be reached the process exits with the reason, instead of running
 * half-working and failing on every request.
 */
async function start() {
  await connectDatabase();
  await ensureInitialAdmin();

  const app = createApp();
  // cPanel/Passenger owns the socket; everywhere else listen on PORT.
  const target = typeof globalThis.PhusionPassenger !== "undefined" ? "passenger" : config.port;

  const server = app.listen(target);
  await new Promise((resolve, reject) => {
    server.once("listening", resolve);
    server.once("error", reject);
  });
  const where = target === "passenger" ? "via Passenger" : `on port ${config.port}`;
  console.log(`[server] ${config.nodeEnv} — listening ${where}, site ${config.siteUrl}`);

  // Warm the article renderer (production bundle, or Vite in development).
  prepareRenderer().catch((err) => console.error("[ssr]", err.message));

  const shutdown = (signal) => {
    console.log(`[server] ${signal}: shutting down`);
    server.close(() => disconnectDatabase().finally(() => process.exit(0)));
    setTimeout(() => process.exit(1), 10000).unref();
  };
  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}

process.on("unhandledRejection", (err) => console.error("[server] unhandled rejection:", err));

start().catch((err) => {
  const reason = err?.code === "EADDRINUSE" ? `port ${config.port} is already in use — stop the other server or change PORT in ${envFile}.` : err.message;
  console.error(`\n[server] could not start: ${reason}\n`);
  process.exit(1);
});
