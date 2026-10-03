import { verifyAccessToken } from "../services/authService.js";
import { forbidden, unauthorized } from "../utils/httpError.js";

/**
 * Reads `Authorization: Bearer <token>` on every API request. Routes that
 * are public still see req.user, e.g. to include drafts for an editor.
 */
export function authenticate(req, _res, next) {
  const header = req.get("authorization") || "";
  req.user = header.startsWith("Bearer ") ? verifyAccessToken(header.slice(7)) : null;
  next();
}

export function requireAuth(req, _res, next) {
  next(req.user ? undefined : unauthorized());
}

/** requireRole("admin") — admins can do everything, editors write content. */
export function requireRole(...roles) {
  return (req, _res, next) => {
    if (!req.user) return next(unauthorized());
    next(roles.includes(req.user.role) || req.user.role === "admin" ? undefined : forbidden());
  };
}

export const isStaff = (req) => !!req.user;
