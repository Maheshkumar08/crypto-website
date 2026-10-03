import compression from "compression";
import cookieParser from "cookie-parser";
import express from "express";
import morgan from "morgan";
import { config } from "./config/env.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { cspNonce, securityHeaders } from "./middleware/security.js";
import { trailingSlash } from "./middleware/trailingSlash.js";
import { apiRouter } from "./routes/api.js";
import { siteRouter } from "./routes/site.js";

/** The Express app: API under /api, the website (Vue + server rendering) for everything else. */
export function createApp() {
  const app = express();

  app.set("trust proxy", config.trustProxy);
  app.disable("x-powered-by");

  app.use(morgan(config.isProduction ? "combined" : "dev"));
  app.use(cspNonce);
  app.use(securityHeaders);
  app.use(compression());
  app.use(trailingSlash);

  // Same-origin only: in development the Vite dev server proxies /api here,
  // so the browser never makes a cross-origin request.
  app.use("/api", express.json({ limit: "2mb" }), cookieParser(), apiRouter());

  app.use(siteRouter());
  app.use(errorHandler);
  return app;
}
