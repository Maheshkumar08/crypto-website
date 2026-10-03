import DOMPurify from 'dompurify'

// Only these hosts may ever render as an <iframe> — an arbitrary third-party
// iframe is itself the risk (clickjacking, credential phishing), not just
// its attributes, so anything else is dropped outright rather than
// sanitized down to a "safer" subset. Covers the Tiptap Youtube extension
// plus the admin's "Embed" toolbar button, which is documented as
// supporting CodePen/Figma/Loom.
const ALLOWED_IFRAME_HOSTS = [
  'www.youtube.com',
  'www.youtube-nocookie.com',
  'player.vimeo.com',
  'codepen.io',
  'www.figma.com',
  'www.loom.com',
]

let hooksRegistered = false

function registerHooks() {
  if (hooksRegistered) return
  hooksRegistered = true

  DOMPurify.addHook('uponSanitizeElement', (node, data) => {
    if (data.tagName !== 'iframe') return
    let host = ''
    try {
      host = new URL(node.getAttribute('src') || '', window.location.origin).hostname
    } catch {
      host = ''
    }
    if (!ALLOWED_IFRAME_HOSTS.includes(host)) node.remove()
  })

  // DOMPurify allows `data:image/...` URIs on <img src> by default (for
  // legitimate inline base64 images), but `data:image/svg+xml` specifically
  // is a well-known XSS vector — an SVG can carry <script>/onload just like
  // HTML. Every image in this app's content comes from Cloudinary as a real
  // URL, so there's no legitimate use case here to preserve; block it.
  DOMPurify.addHook('uponSanitizeAttribute', (node, data) => {
    if (data.attrName === 'src' && /^data:image\/svg\+xml/i.test(data.attrValue)) {
      data.keepAttr = false
    }
  })
}

// DOMPurify's default tag/attribute allowlist already covers everything a
// WordPress-style article needs (p, headings, lists, tables, blockquote,
// pre/code, img, figure, div, span, video…) and already strips <script>,
// `on*` handlers, and `javascript:`/`data:` URIs — so this only needs to
// widen the default slightly for the one thing it doesn't allow at all:
// video-embed iframes, which the host-allowlist hook above keeps safe.
const CONFIG = {
  ADD_TAGS: ['iframe'],
  ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'loading', 'target'],
}

/**
 * The single sanitization choke point for any post/article HTML rendered
 * with v-html. Content comes from the trusted Tiptap admin editor today,
 * but this runs unconditionally — output should never trust its input,
 * whether that's hand-edited database content, a future import, or a bug
 * somewhere upstream.
 */
export function sanitizeArticleHtml(html) {
  if (!html) return ''
  registerHooks()
  return DOMPurify.sanitize(html, CONFIG)
}
