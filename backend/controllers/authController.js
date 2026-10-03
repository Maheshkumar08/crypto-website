import * as auth from "../services/authService.js";
import { badRequest } from "../utils/httpError.js";

function sendSession(res, { user, accessToken, refreshToken }) {
  res.cookie(auth.REFRESH_COOKIE, refreshToken, auth.refreshCookieOptions());
  res.set("Cache-Control", "no-store").json({ user, accessToken });
}

/** POST /api/auth/login { email, password } */
export async function login(req, res) {
  const { email, password } = req.body || {};
  if (!email || !password) throw badRequest("Enter your email and password.");
  sendSession(res, await auth.login(email, password));
}

/**
 * POST /api/auth/refresh — new access token from the refresh cookie
 * (rotated). No cookie simply means "not signed in": 204, not an error.
 */
export async function refresh(req, res) {
  const token = req.cookies?.[auth.REFRESH_COOKIE];
  if (!token) {
    res.status(204).set("Cache-Control", "no-store").end();
    return;
  }
  try {
    sendSession(res, await auth.refresh(token));
  } catch (err) {
    const { maxAge, ...cookie } = auth.refreshCookieOptions();
    res.clearCookie(auth.REFRESH_COOKIE, cookie);
    throw err;
  }
}

/** POST /api/auth/logout — revokes the refresh token and clears the cookie. */
export async function logout(req, res) {
  await auth.logout(req.cookies?.[auth.REFRESH_COOKIE]);
  const { maxAge, ...cookie } = auth.refreshCookieOptions();
  res.clearCookie(auth.REFRESH_COOKIE, cookie);
  res.status(204).end();
}

/** GET /api/auth/me */
export async function me(req, res) {
  res.set("Cache-Control", "no-store").json({ user: await auth.getUser(req.user.id) });
}
