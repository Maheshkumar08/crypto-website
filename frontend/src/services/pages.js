import { api, hasAccessToken, query, toDate } from './api'

export function normalize(snap) {
  const data = snap.data()
  return {
    id: snap.id,
    title: data.title || '',
    slug: data.slug || '',
    coverImage: data.coverImage || '',
    shortDescription: data.shortDescription || data.metaDescription || '',
    content: data.content || '',
    seoTitle: data.seoTitle || '',
    metaDescription: data.metaDescription || data.shortDescription || '',
    published: !!data.published,
    sortOrder: typeof data.sortOrder === 'number' ? data.sortOrder : Number(data.sortOrder) || 0,
    author: data.author || 'cryptolearner.us Team',
    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt),
  }
}

const fromApi = (doc) => normalize({ id: doc.id, data: () => doc })

function payload(data) {
  return {
    title: (data.title || '').trim(),
    slug: (data.slug || '').trim(),
    coverImage: data.coverImage || '',
    shortDescription: (data.shortDescription || '').trim(),
    content: data.content || '',
    seoTitle: (data.seoTitle || '').trim(),
    metaDescription: (data.metaDescription || data.shortDescription || '').trim(),
    published: !!data.published,
    sortOrder: Number(data.sortOrder) || 0,
    author: (data.author || '').trim() || 'cryptolearner.us Team',
  }
}

/**
 * Fetch list of pages, sorted by sortOrder, then title. Drafts are only
 * returned to a signed-in editor.
 */
export async function getPages({ publishedOnly = false } = {}) {
  const status = !publishedOnly && hasAccessToken() ? 'all' : undefined
  const pages = (await api.get(`/pages${query({ status })}`)).map(fromApi)

  // Sort by sortOrder ascending, fallback to title
  return pages.sort((a, b) => {
    if (a.sortOrder !== b.sortOrder) {
      return a.sortOrder - b.sortOrder
    }
    return (a.title || '').localeCompare(b.title || '')
  })
}

export async function getPageById(id) {
  try {
    return fromApi(await api.get(`/pages/id/${encodeURIComponent(id)}`))
  } catch (err) {
    if (err.status === 404) return null
    throw err
  }
}

export async function getPageBySlug(slug) {
  try {
    return fromApi(await api.get(`/pages/${encodeURIComponent(slug)}`))
  } catch (err) {
    if (err.status === 404) return null
    throw err
  }
}

export async function pageSlugExists(slug, excludeId = null) {
  const { exists } = await api.get(`/pages/slug-exists${query({ slug, excludeId })}`)
  return exists
}

export async function createPage(data) {
  const created = await api.post('/pages', payload(data))
  return created.id
}

export async function updatePage(id, data) {
  await api.put(`/pages/${encodeURIComponent(id)}`, payload(data))
}

export async function deletePage(id) {
  await api.delete(`/pages/${encodeURIComponent(id)}`)
}
