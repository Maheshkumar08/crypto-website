import { config } from "../config/env.js";

/**
 * Short-lived cache for published-post lists (category/tag pages, sitemap,
 * RSS). Every content write clears it, so a publish is visible on the very
 * next request; the TTL only bounds staleness from writes made elsewhere.
 */
const entries = new Map();

export function cached(key, load) {
  const hit = entries.get(key);
  if (hit && hit.expires > Date.now()) return hit.promise;

  const promise = load();
  entries.set(key, { expires: Date.now() + config.listCacheSeconds * 1000, promise });
  promise.catch(() => entries.delete(key));
  return promise;
}

export function clearContentCache() {
  entries.clear();
}
