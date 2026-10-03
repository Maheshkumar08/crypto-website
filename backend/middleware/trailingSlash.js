/**
 * /about/ → 301 /about. Canonical URLs (and the sitemap) have no trailing
 * slash; serving both would split one page across two URLs. Leading
 * slashes are collapsed so "//evil.example/" can't become a
 * protocol-relative redirect to another site.
 */
export function trailingSlash(req, res, next) {
  if (req.path.length > 1 && req.path.endsWith("/") && !req.path.startsWith("/api/")) {
    const query = req.originalUrl.slice(req.originalUrl.indexOf("?") === -1 ? req.originalUrl.length : req.originalUrl.indexOf("?"));
    res.redirect(301, `/${req.path.replace(/^\/+|\/+$/g, "")}${query}`);
    return;
  }
  next();
}
