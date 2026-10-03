import { useHead } from "@unhead/vue";

const SITE_NAME = "cryptolearner.us";

const SITE_URL = import.meta.env.VITE_SITE_URL || "https://cryptolearner.us";

const DEFAULT_IMAGE = `${SITE_URL}/og-default.png`;

/**
 * Site-wide fallbacks (the values index.html used to hard-code), pushed once
 * in main.js. Any page that calls useSeoMeta overrides them — unhead
 * dedupes title, canonical and each meta name/property, so a page never
 * ends up with two descriptions.
 */
export function defaultHead() {
  return {
    title:
      "CryptoLearner.us | Learn Cryptocurrency, Blockchain, Bitcoin & Web3 for Beginners",
    meta: [
      {
        name: "description",
        content:
          "Learn Cryptocurrency, Bitcoin, Blockchain, Ethereum, Web3, NFTs and DeFi through beginner-friendly guides, tutorials and educational resources. CryptoLearner.us makes crypto learning simple for everyone.",
      },
      {
        name: "keywords",
        content:
          "Cryptocurrency, Bitcoin, Blockchain, Ethereum, Web3, Learn Crypto, Crypto Tutorials, Crypto Education, Bitcoin Guide, DeFi, NFTs, Crypto News, Blockchain Technology",
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "CryptoLearner.us" },
      { property: "og:url", content: "https://www.cryptolearner.us" },
      {
        property: "og:title",
        content:
          "CryptoLearner.us | Learn Cryptocurrency, Blockchain, Bitcoin & Web3",
      },
      {
        property: "og:description",
        content:
          "Master Cryptocurrency, Bitcoin, Blockchain and Web3 with beginner-friendly tutorials, guides and educational resources.",
      },
      { property: "og:image", content: "https://www.cryptolearner.us/og-image.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:title",
        content:
          "CryptoLearner.us | Learn Cryptocurrency, Blockchain, Bitcoin & Web3",
      },
      {
        name: "twitter:description",
        content:
          "Beginner-friendly Cryptocurrency and Blockchain learning platform.",
      },
      { name: "twitter:image", content: "https://www.cryptolearner.us/og-image.jpg" },
    ],
    link: [{ rel: "canonical", href: "https://www.cryptolearner.us" }],
  };
}

/**
 * Page-level SEO via unhead: written into the server-rendered HTML of every
 * page and kept in sync in the browser on navigation.
 * `getMeta` may be a plain object or a getter that returns null while data
 * is still loading (site defaults apply).
 */
export function useSeoMeta(getMeta) {
  useHead(() => {
    const meta = typeof getMeta === "function" ? getMeta() : getMeta;

    if (!meta) return {};

    const title = meta.title ? `${meta.title} — ${SITE_NAME}` : SITE_NAME;
    const description = meta.description || "";
    const image = meta.image || DEFAULT_IMAGE;
    const url = meta.path ? `${SITE_URL}${meta.path}` : SITE_URL;
    const canonical = meta.canonical || url;
    const type = meta.type || "website";

    const tags = [
      { name: "description", content: description },
      { name: "keywords", content: meta.keywords },
      { property: "og:title", content: meta.ogTitle || title },
      { property: "og:description", content: meta.ogDescription || description },
      { property: "og:type", content: type },
      { property: "og:url", content: url },
      { property: "og:image", content: image },
      { property: "og:site_name", content: SITE_NAME },
      { property: "article:published_time", content: meta.publishedTime },
      { property: "article:modified_time", content: meta.modifiedTime },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: meta.twitterTitle || meta.ogTitle || title },
      { name: "twitter:description", content: meta.twitterDescription || meta.ogDescription || description },
      { name: "twitter:image", content: image },
    ];

    return {
      title,
      // An empty content="" is worse than no tag at all.
      meta: tags.filter((t) => t.content),
      link: [{ rel: "canonical", href: canonical }],
      script: [
        {
          key: "seo-jsonld",
          type: "application/ld+json",
          // Escaped so article text can never close the script tag.
          innerHTML: JSON.stringify(meta.jsonLd || pageJsonLd(meta, url, description)).replace(/</g, "\\u003c"),
        },
      ],
    };
  });
}

/**
 * JSON-LD for pages that don't provide their own (articles, blog posts and
 * listings do): the page as a WebPage — or the site as a WebSite on the home
 * page — plus the publisher and a breadcrumb trail.
 */
function pageJsonLd(meta, url, description) {
  const organization = {
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.svg`,
  };

  if (!meta.path || meta.path === "/") {
    return {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebSite",
          "@id": `${SITE_URL}/#website`,
          url: SITE_URL,
          name: SITE_NAME,
          description: description || undefined,
          publisher: { "@id": `${SITE_URL}/#organization` },
        },
        organization,
      ],
    };
  }

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: meta.title || SITE_NAME,
        description: description || undefined,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
      organization,
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: meta.title || SITE_NAME },
        ],
      },
    ],
  };
}

export { SITE_NAME, SITE_URL };
