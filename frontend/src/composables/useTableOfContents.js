import { slugify } from './text'
import { sanitizeArticleHtml } from './sanitizeArticleHtml'

/**
 * Injects stable ids into h2/h3 headings inside an HTML string (Tiptap
 * output has none by default) and returns both the annotated HTML and a
 * flat outline, so the same pass feeds the rendered content and the TOC.
 *
 * This is also the single choke point every public post/article page's
 * content passes through (see usePostDetails.js), so it sanitizes the HTML
 * before doing anything else with it — the returned `html` is safe to
 * render with v-html regardless of where the raw content came from.
 */
export function withTableOfContents(html) {
  if (!html) return { html: '', headings: [] }

  const container = document.createElement('div')
  container.innerHTML = sanitizeArticleHtml(html)

  const headings = []
  const used = new Set()

  container.querySelectorAll('h2, h3').forEach((el) => {
    const text = el.textContent.trim()
    if (!text) return

    let id = slugify(text)
    let suffix = 2
    while (used.has(id)) {
      id = `${slugify(text)}-${suffix++}`
    }
    used.add(id)

    el.id = id
    headings.push({ id, text, level: Number(el.tagName.slice(1)) })
  })

  return { html: container.innerHTML, headings }
}
