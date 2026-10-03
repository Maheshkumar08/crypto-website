import { readFileSync } from "node:fs";
import path from "node:path";
import mongoose from "mongoose";
import { config } from "../config/env.js";
import { HttpError } from "../utils/httpError.js";

const ERROR_PAGE = path.join(config.paths.views, "error.html");

/** Self-contained error page (views/error.html) for site requests. */
export function errorPage(status, title, message) {
  let html;
  try {
    html = readFileSync(ERROR_PAGE, "utf8");
  } catch {
    html = "<!doctype html><title>{{title}}</title><h1>{{title}}</h1><p>{{message}}</p>";
  }
  const escape = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  return html.replaceAll("{{status}}", String(status)).replaceAll("{{title}}", escape(title)).replaceAll("{{message}}", escape(message));
}

function normalize(err) {
  if (err instanceof HttpError) return err;
  if (err instanceof mongoose.Error.ValidationError) {
    const fields = Object.fromEntries(Object.entries(err.errors).map(([k, v]) => [k, v.message]));
    return new HttpError(400, "invalid-request", "Some fields are invalid.", fields);
  }
  if (err instanceof mongoose.Error.CastError) return new HttpError(404, "not-found", "Not found.");
  if (err?.type === "entity.parse.failed") return new HttpError(400, "invalid-json", "The request body isn't valid JSON.");
  if (err?.type === "entity.too.large") return new HttpError(413, "too-large", "The request is too large.");
  const databaseDown =
    ["MongooseServerSelectionError", "MongoServerSelectionError", "MongoNotConnectedError", "MongoNetworkError", "MongoNetworkTimeoutError"].includes(err?.name) ||
    (err?.name === "MongooseError" && /initial connection|buffering timed out|not connected/i.test(err.message));
  if (databaseDown) {
    return new HttpError(503, "database-unavailable", "The database is unavailable — try again shortly.");
  }
  return null;
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, _next) {
  const known = normalize(err);
  const status = known?.status || 500;
  if (status >= 500) console.error(`[error] ${req.method} ${req.originalUrl}:`, err);
  if (res.headersSent) return;

  res.status(status).set("Cache-Control", "no-store");
  if (req.originalUrl.startsWith("/api/")) {
    const error = known
      ? { code: known.code, message: known.message, ...(known.fields ? { fields: known.fields } : {}) }
      : { code: "server-error", message: "Something went wrong — please try again." };
    res.json({ error });
    return;
  }
  res.type("html").send(
    status === 503
      ? errorPage(503, "Temporarily unavailable", "This page could not be loaded right now. Please try again in a moment.")
      : errorPage(status, "Something went wrong", "We hit an unexpected error. Please try again in a moment."),
  );
}

export function apiNotFound(req, res) {
  res.status(404).json({ error: { code: "not-found", message: `No API route for ${req.method} ${req.path}.` } });
}
