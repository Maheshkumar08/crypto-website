import { api, hasAccessToken, query, toDate } from "./api";

/**
 * Blogs and articles are structurally identical (same fields, same admin
 * workflow) and are served by two API routes: /api/blogs and /api/articles.
 * This factory is the single place that logic lives, so the two feature
 * sets never drift apart.
 *
 * Category/search filtering happens client-side — this is a small-to-medium
 * content site, not a search engine.
 */
export function createPostsService(collectionName) {
  const base = collectionName === "blogs" ? "/blogs" : "/articles";

  // API documents are wrapped like snapshots so normalize() — shared with
  // the server renderer (composables/serverData.js) — reads them the same way.
  const fromApi = (doc) => normalize({ id: doc.id, data: () => doc });

  async function list({ publishedOnly = true } = {}) {
    // Drafts are only returned to a signed-in editor (the admin lists).
    const status = !publishedOnly && hasAccessToken() ? "all" : undefined;
    const posts = (await api.get(`${base}${query({ status })}`)).map(fromApi);
    return publishedOnly
      ? posts.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
      : posts;
  }

  async function getById(id) {
    try {
      return fromApi(await api.get(`${base}/id/${encodeURIComponent(id)}`));
    } catch (err) {
      if (err.status === 404) return null;
      throw err;
    }
  }

  async function getBySlug(slug) {
    try {
      return fromApi(await api.get(`${base}/${encodeURIComponent(slug)}`));
    } catch (err) {
      if (err.status === 404) return null;
      throw err;
    }
  }

  async function getByGuide(guideCardId) {
    const [post] = await api.get(`${base}${query({ guideCardId, limit: 1 })}`);
    return post ? fromApi(post) : null;
  }

  async function slugExists(slug, excludeId = null) {
    const { exists } = await api.get(`${base}/slug-exists${query({ slug, excludeId })}`);
    return exists;
  }

  async function create(data) {
    const created = await api.post(base, data);
    return created.id;
  }

  async function update(id, data) {
    await api.put(`${base}/${encodeURIComponent(id)}`, data);
  }

  async function remove(id) {
    await api.delete(`${base}/${encodeURIComponent(id)}`);
  }

  /** Fire-and-forget view counter — never blocks or fails the page for the reader. */
  function incrementViews(id) {
    api.post(`${base}/${encodeURIComponent(id)}/views`, {}).catch(() => {});
  }

  /** Fire-and-forget like counter, mirroring incrementViews — the reader's own liked/unliked state is tracked client-side (see useLikes.js). */
  function incrementLikes(id) {
    api.post(`${base}/${encodeURIComponent(id)}/likes`, { delta: 1 }).catch(() => {});
  }

  function decrementLikes(id) {
    api.post(`${base}/${encodeURIComponent(id)}/likes`, { delta: -1 }).catch(() => {});
  }

  // Lets usePostListing load the same list on the server (serverData.js).
  list.collection = collectionName;

  return {
    list,
    getById,
    getBySlug,
    getByGuide, // 👈 add
    slugExists,
    create,
    update,
    remove,
    incrementViews,
    incrementLikes,
    decrementLikes,
  };
}

export function normalize(snap) {
  const data = snap.data();
  return {
    id: snap.id,
    ...data,

    views: data.views || 0,
    likes: data.likes || 0,

    guideCardId: data.guideCardId || "",
    guideSection: data.guideSection || "",

    faqs: Array.isArray(data.faqs) ? data.faqs : [],
    keyTakeaways: Array.isArray(data.keyTakeaways) ? data.keyTakeaways : [],

    createdAt: toDate(data.createdAt),

    updatedAt: toDate(data.updatedAt),
  };
}
