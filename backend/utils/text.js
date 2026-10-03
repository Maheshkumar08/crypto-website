// Same rules as src/composables/text.js, so slugs and reading times
// computed on the server match the ones the admin editor shows.

export function slugify(text) {
  return String(text ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

const WORDS_PER_MINUTE = 200;

/** Reading time in minutes (minimum 1) from HTML. */
export function estimateReadingTime(html) {
  if (!html) return 1;
  const words = String(html).replace(/<[^>]*>/g, " ").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

/** Plain text from HTML, cut at a word boundary. */
export function stripHtml(html, maxLength) {
  if (!html) return "";
  const text = String(html).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  if (!maxLength || text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).replace(/\s+\S*$/, "")}…`;
}

export function escapeXml(value = "") {
  return String(value ?? "").replace(
    /[<>&'"]/g,
    (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[c],
  );
}

export function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
