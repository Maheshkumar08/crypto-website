// REST client for the Express API (backend/routes/api.js). Every service
// in this folder talks to the server through it.
//
// Auth: the access token lives in memory only; the refresh token is an
// httpOnly cookie the browser sends to /api/auth automatically. A 401 is
// retried once after refreshing the access token.

const API = (import.meta.env.VITE_API_URL || "/api").replace(/\/+$/, "");
const TIMEOUT_MS = 15000;

let accessToken = null;
let refreshing = null;

export function setAccessToken(token) {
  accessToken = token || null;
}

export function hasAccessToken() {
  return !!accessToken;
}

export function getAccessToken() {
  return accessToken;
}

export class ApiError extends Error {
  constructor(status, code, message, fields) {
    super(message);
    this.status = status;
    this.code = code;
    this.fields = fields;
  }
}

async function send(method, path, { body, form, signal, auth = true } = {}) {
  const headers = {};
  if (auth && accessToken) headers.Authorization = `Bearer ${accessToken}`;
  if (body !== undefined) headers["Content-Type"] = "application/json";

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  signal?.addEventListener("abort", () => controller.abort(), { once: true });

  try {
    const res = await fetch(`${API}${path}`, {
      method,
      headers,
      body: form ?? (body !== undefined ? JSON.stringify(body) : undefined),
      credentials: "include",
      signal: controller.signal,
    });
    const data = res.status === 204 ? null : await res.json().catch(() => null);
    if (!res.ok) {
      throw new ApiError(res.status, data?.error?.code || `http-${res.status}`, data?.error?.message || `Request failed (${res.status}).`, data?.error?.fields);
    }
    return data;
  } catch (err) {
    if (err.name === "AbortError") throw new ApiError(0, "timeout", "The server took too long to answer. Check your connection and try again.");
    if (err instanceof ApiError) throw err;
    throw new ApiError(0, "network-error", "Could not reach the server. Check your connection and try again.");
  } finally {
    clearTimeout(timer);
  }
}

/** New access token from the refresh cookie (shared by concurrent callers). */
export function refreshSession() {
  refreshing ??= send("POST", "/auth/refresh", { auth: false })
    .then((session) => {
      if (!session) throw new ApiError(401, "unauthenticated", "Not signed in.");
      setAccessToken(session.accessToken);
      return session;
    })
    .finally(() => {
      refreshing = null;
    });
  return refreshing;
}

export async function request(method, path, options = {}) {
  try {
    return await send(method, path, options);
  } catch (err) {
    if (err.status !== 401 || !accessToken || path.startsWith("/auth/")) throw err;
    // Access token expired mid-session: refresh once, then retry.
    try {
      await refreshSession();
    } catch {
      setAccessToken(null);
      throw err;
    }
    return send(method, path, options);
  }
}

export const api = {
  get: (path, options) => request("GET", path, options),
  post: (path, body, options) => request("POST", path, { ...options, body }),
  put: (path, body, options) => request("PUT", path, { ...options, body }),
  patch: (path, body, options) => request("PATCH", path, { ...options, body }),
  delete: (path, options) => request("DELETE", path, options),
};

/** "?a=1&b=2" from an object, skipping empty values. */
export function query(params) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params || {})) {
    if (value !== undefined && value !== null && value !== "") search.set(key, String(value));
  }
  const text = search.toString();
  return text ? `?${text}` : "";
}

/** Date from the API's ISO strings (or a Date already). */
export function toDate(value) {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value.toDate === "function") return value.toDate();
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}
