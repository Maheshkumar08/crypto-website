import { normalize as normalizePost } from "../services/posts";
import { normalize as normalizePage } from "../services/pages";

/**
 * inject() key for the app's initialState (provided in main.js). Pages
 * rendered by the Express backend embed their data here, so the browser
 * hydrates from it instead of calling the API.
 */
export const PRERENDER_STATE = Symbol("prerender-state");

const DATE_FIELDS = new Set(["createdAt", "updatedAt"]);

let source = null;

/**
 * Server only. The Express backend (backend/services/ssr/renderService.js)
 * plugs in its MongoDB reader:
 *   { listPublished(collection), getBySlug(collection, slug), listGuideCards(category) }
 * Both resolve to raw documents ({ id, ...data }) in the API's shape.
 */
export function setServerDataSource(dataSource) {
  source = dataSource;
}

function requireSource() {
  if (!source) {
    throw new Error("[serverData] no data source — render through the Express backend.");
  }
  return source;
}

// Wrapping raw docs as snapshot-like objects lets the services' own
// normalize() shape them exactly like the browser's API reads.
function asSnapshot(raw) {
  const { id, ...data } = raw;
  return { id, data: () => data };
}

export async function getServerPosts(collection) {
  const docs = await requireSource().listPublished(collection);
  return docs
    .map((raw) => normalizePost(asSnapshot(raw)))
    .filter((p) => p.published)
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
}

export async function getServerPost(collection, slug) {
  const raw = await requireSource().getBySlug(collection, slug);
  return raw ? normalizePost(asSnapshot(raw)) : null;
}

/** Published pages, in their sort order (home page "Explore" section). */
export async function getServerPageList() {
  const docs = await requireSource().listPublished("pages");
  return docs
    .map((raw) => normalizePage(asSnapshot(raw)))
    .filter((p) => p.published)
    .sort((a, b) => a.sortOrder - b.sortOrder || (a.title || "").localeCompare(b.title || ""));
}

/** Enabled guide cards of one learning section, in their order. */
export async function getServerGuideCards(category) {
  return requireSource().listGuideCards(category);
}

export async function getServerPage(slug) {
  const raw = await requireSource().getBySlug("pages", slug);
  return raw ? normalizePage(asSnapshot(raw)) : null;
}

/**
 * The initial state travels as JSON, which turns Dates into strings;
 * the components sort and format them as Dates, so restore them.
 */
export function reviveDates(value) {
  if (Array.isArray(value)) return value.map(reviveDates);
  if (!value || typeof value !== "object") return value;

  const out = {};
  for (const [key, v] of Object.entries(value)) {
    out[key] =
      DATE_FIELDS.has(key) && typeof v === "string" ? new Date(v) : reviveDates(v);
  }
  return out;
}
