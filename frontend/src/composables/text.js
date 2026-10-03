export function slugify(text) {
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

const WORDS_PER_MINUTE = 200

/** Estimates reading time (in minutes, minimum 1) from Tiptap/HTML content. */
export function estimateReadingTime(html) {
  if (!html) return 1
  const text = html.replace(/<[^>]*>/g, ' ')
  const words = text.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE))
}

/** Strips HTML tags for excerpts/meta descriptions. */
export function stripHtml(html, maxLength) {
  if (!html) return ''
  const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  if (!maxLength || text.length <= maxLength) return text
  return text.slice(0, maxLength).replace(/\s+\S*$/, '') + '…'
}

export function formatDate(date) {
  if (!date) return ''
  const d = date instanceof Date ? date : new Date(date)
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

/** Feed-style relative timestamp ("2h ago"), falling back to a full date past a week old. */
export function formatRelativeTime(date) {
  if (!date) return ''
  const d = date instanceof Date ? date : new Date(date)
  const diffSec = Math.round((Date.now() - d.getTime()) / 1000)

  if (diffSec < 60) return 'Just now'
  const diffMin = Math.round(diffSec / 60)
  if (diffMin < 60) return `${diffMin}m ago`
  const diffHour = Math.round(diffMin / 60)
  if (diffHour < 24) return `${diffHour}h ago`
  const diffDay = Math.round(diffHour / 24)
  if (diffDay < 7) return `${diffDay}d ago`
  return formatDate(d)
}
