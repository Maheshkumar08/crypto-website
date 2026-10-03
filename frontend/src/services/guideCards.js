import { api, query, toDate } from './api'

function normalize(doc) {
  return {
    ...doc,
    order: typeof doc.order === 'number' ? doc.order : 0,
    enabled: doc.enabled !== false,
    createdAt: toDate(doc.createdAt),
    updatedAt: toDate(doc.updatedAt),
  }
}

/**
 * Guide cards, optionally narrowed to one category, sorted by `order`.
 * Visitors only ever get enabled cards; a signed-in editor gets all of them
 * unless `enabledOnly` is set.
 */
export async function listGuideCards({ category, enabledOnly = false } = {}) {
  const cards = (await api.get(`/guide-cards${query({ category, enabledOnly: enabledOnly ? 1 : undefined })}`)).map(normalize)
  return cards.sort((a, b) => a.order - b.order)
}

export async function getGuideCardById(id) {
  try {
    return normalize(await api.get(`/guide-cards/${encodeURIComponent(id)}`))
  } catch (err) {
    if (err.status === 404) return null
    throw err
  }
}

/**
 * `cardId` is globally unique across every category (not just within one),
 * so an article can resolve its guide card with a single lookup by
 * guideCardId, with no risk of collision.
 */
export async function cardIdExists(cardId, excludeId = null) {
  const { exists } = await api.get(`/guide-cards/card-id-exists${query({ cardId, excludeId })}`)
  return exists
}

export async function createGuideCard(data) {
  const created = await api.post('/guide-cards', data)
  return created.id
}

export async function updateGuideCard(id, data) {
  await api.put(`/guide-cards/${encodeURIComponent(id)}`, data)
}

export async function deleteGuideCard(id) {
  await api.delete(`/guide-cards/${encodeURIComponent(id)}`)
}

/** Persists a drag-reordered list for one category in a single request. */
export async function reorderGuideCards(cards) {
  await api.put('/guide-cards/reorder', { ids: cards.map((card) => card.id) })
}
