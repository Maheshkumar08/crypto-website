/**
 * Fixed-window rate limits per client IP, kept in memory (one Node process).
 * `countFailuresOnly` counts a request only if it ends with a 4xx/5xx status,
 * so successful sign-ins never lock anyone out.
 */
function limiter({ windowMinutes, limit, message, countFailuresOnly = false }) {
  const windowMs = windowMinutes * 60 * 1000;
  const hits = new Map(); // ip → { count, resetAt }

  // Drop expired windows so the map can't grow without bound.
  setInterval(() => {
    const now = Date.now();
    for (const [ip, entry] of hits) if (entry.resetAt <= now) hits.delete(ip);
  }, windowMs).unref();

  return (req, res, next) => {
    const now = Date.now();
    const ip = req.ip || "unknown";
    let entry = hits.get(ip);
    if (!entry || entry.resetAt <= now) {
      entry = { count: 0, resetAt: now + windowMs };
      hits.set(ip, entry);
    }

    if (entry.count >= limit) {
      res.set("Retry-After", String(Math.ceil((entry.resetAt - now) / 1000)));
      res.status(429).json({ error: { code: "rate-limited", message } });
      return;
    }

    if (countFailuresOnly) {
      res.on("finish", () => {
        if (res.statusCode >= 400) entry.count += 1;
      });
    } else {
      entry.count += 1;
    }
    next();
  };
}

/** Failed sign-in attempts per IP. */
export const loginLimiter = limiter({ windowMinutes: 15, limit: 10, countFailuresOnly: true, message: "Too many sign-in attempts — try again in 15 minutes." });

/** Contact form and newsletter sign-ups per IP. */
export const formLimiter = limiter({ windowMinutes: 60, limit: 10, message: "Too many submissions — please try again later." });

/** View/like counters per IP. */
export const counterLimiter = limiter({ windowMinutes: 1, limit: 60, message: "Slow down a little." });

/** Everything else under /api, a generous ceiling against abuse. */
export const apiLimiter = limiter({ windowMinutes: 1, limit: 600, message: "Too many requests — slow down a little." });
