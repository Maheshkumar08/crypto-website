import { SITE_NAME, SITE_URL } from './useSeoMeta'

const LOGO_URL = `${SITE_URL}/favicon.svg`

export function organizationSchema() {
  return {
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: LOGO_URL,
  }
}

export function authorSchema(name) {
  return {
    '@type': 'Person',
    name: name || `${SITE_NAME} Team`,
  }
}

export function breadcrumbSchema(items) {
  // items: [{ label, path }] — path omitted for the final (current) crumb
  const trail = [{ label: 'Home', path: '/' }, ...items]
  return {
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      item: item.path ? `${SITE_URL}${item.path}` : undefined,
    })),
  }
}

/**
 * Full JSON-LD graph for a blog/article detail page: Article + author +
 * publisher (Organization) + BreadcrumbList in one `@graph`, so a single
 * <script type="application/ld+json"> covers everything crawlers look for.
 */
export function articlePageSchema({ post, url, path, kind = 'BlogPosting', breadcrumbItems }) {
  const articleNode = {
    '@type': kind,
    '@id': `${url}#article`,
    headline: post.seoTitle || post.title,
    description: post.seoDescription || post.description,
    image: post.ogImage || post.coverImage ? [post.ogImage || post.coverImage] : undefined,
    datePublished: toIso(post.createdAt),
    dateModified: toIso(post.updatedAt || post.createdAt),
    author: authorSchema(post.author),
    publisher: { '@id': `${SITE_URL}/#organization` },
    mainEntityOfPage: url,
    keywords: post.tags?.length ? post.tags.join(', ') : undefined,
  }

  const faqNode =
    post.faqs?.length > 0
      ? {
          '@type': 'FAQPage',
          '@id': `${url}#faq`,
          mainEntity: post.faqs.map((f) => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: { '@type': 'Answer', text: f.answer },
          })),
        }
      : null

  return {
    '@context': 'https://schema.org',
    '@graph': [articleNode, organizationSchema(), breadcrumbSchema(breadcrumbItems), faqNode, ...customSchemaNodes(post.schema)].filter(Boolean),
  }
}

// A post's optional extra JSON-LD (the "schema" field): one node, a list of
// nodes, or a full {"@graph": [...]} document.
function customSchemaNodes(schema) {
  if (!schema || typeof schema !== 'object') return []
  const nodes = Array.isArray(schema) ? schema : Array.isArray(schema['@graph']) ? schema['@graph'] : [schema]
  return nodes
    .filter((node) => node && typeof node === 'object' && node['@type'])
    .map(({ '@context': _context, ...node }) => node)
}

function toIso(date) {
  if (!date) return undefined
  const d = date instanceof Date ? date : new Date(date)
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString()
}
