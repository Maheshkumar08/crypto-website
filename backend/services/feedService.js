import { config } from "../config/env.js";
import { listPublishedForRender } from "./articleService.js";
import { listPublishedPagesForRender } from "./pageService.js";
import { getStaticPaths } from "./ssr/renderService.js";
import { escapeXml, slugify } from "../utils/text.js";

/**
 * /sitemap.xml and /rss.xml, built per request from MongoDB (lists are
 * cached briefly and cleared on every publish), so new posts appear at once.
 */

const GUIDE_SECTIONS = new Set(["getting-started", "safety", "coins", "exchanges", "taxes", "glossary"]);

function toDate(value) {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function urlEntry(urlPath, lastmod) {
  const date = toDate(lastmod);
  return ["  <url>", `    <loc>${escapeXml(config.siteUrl + urlPath)}</loc>`, date ? `    <lastmod>${date.toISOString().slice(0, 10)}</lastmod>` : null, "  </url>"]
    .filter(Boolean)
    .join("\n");
}

export async function buildSitemap() {
  const [articles, blogs, pages, staticPaths] = await Promise.all([
    listPublishedForRender("articles"),
    listPublishedForRender("blogs"),
    listPublishedPagesForRender(),
    getStaticPaths(),
  ]);
  const posts = [...articles, ...blogs].filter((p) => p.slug);

  const categories = new Set(posts.filter((p) => p.category).map((p) => slugify(p.category)));
  const tags = new Set(posts.flatMap((p) => p.tags || []).map((t) => slugify(t)));

  const articlePath = (a) => (GUIDE_SECTIONS.has(a.guideSection) ? `/${a.guideSection}/${a.slug}` : `/articles/${a.slug}`);

  const urls = [
    ...[...staticPaths].sort().map((p) => urlEntry(p)),
    ...articles.filter((a) => a.slug).map((a) => urlEntry(articlePath(a), a.updatedAt || a.createdAt)),
    ...blogs.filter((b) => b.slug).map((b) => urlEntry(`/blog/${b.slug}`, b.updatedAt || b.createdAt)),
    ...pages.filter((p) => p.slug).map((p) => urlEntry(`/${p.slug}`, p.updatedAt || p.createdAt)),
    ...[...categories].filter(Boolean).map((c) => urlEntry(`/category/${c}`)),
    ...[...tags].filter(Boolean).map((t) => urlEntry(`/tag/${t}`)),
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`;
}

/** Blog feed, newest first. */
export async function buildRss() {
  const posts = (await listPublishedForRender("blogs"))
    .filter((p) => p.slug)
    .sort((a, b) => (toDate(b.createdAt) || 0) - (toDate(a.createdAt) || 0));

  const items = posts
    .map((p) => {
      const link = escapeXml(`${config.siteUrl}/blog/${p.slug}`);
      const date = toDate(p.createdAt) || new Date();
      return `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${link}</link>
      <guid>${link}</guid>
      <description>${escapeXml(p.description)}</description>
      <pubDate>${date.toUTCString()}</pubDate>
    </item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>cryptolearner.us Blog</title>
    <link>${config.siteUrl}/blog</link>
    <description>Plain-language lessons and updates on blockchain, wallets, and digital assets.</description>
${items}
  </channel>
</rss>
`;
}
