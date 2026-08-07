/**
 * JWT delivery helpers — textbook cookie approach.
 *
 * Why httpOnly cookie (not localStorage)?
 * - XSS cannot read document.cookie for httpOnly cookies
 * - Token is never exposed to JavaScript
 * - Browser sends it automatically on same-site / credentialed requests
 *
 * Still accept Authorization: Bearer for tools/Swagger during transition.
 */

const COOKIE_NAME = 'access_token';

function isProduction() {
  return process.env.NODE_ENV === 'production';
}

/** Cookie flags for JWT */
function cookieOptions(rememberMe = false) {
  const maxAge = rememberMe
    ? 7 * 24 * 60 * 60 * 1000 // 7 days
    : 24 * 60 * 60 * 1000; // 24 hours

  // Cross-site deploy (Vercel frontend → different API host): SameSite=None + Secure
  // Localhost: SameSite=Lax, Secure=false so http://localhost works
  const crossSite = process.env.COOKIE_SAMESITE === 'none' || isProduction();

  return {
    httpOnly: true, // JS cannot read this cookie (XSS mitigation)
    secure: process.env.COOKIE_SECURE === 'true' || isProduction(),
    sameSite: crossSite ? 'none' : 'lax',
    maxAge,
    path: '/',
  };
}

function setAuthCookie(res, token, rememberMe = false) {
  res.cookie(COOKIE_NAME, token, cookieOptions(rememberMe));
}

function clearAuthCookie(res) {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: isProduction(),
    sameSite: isProduction() ? 'none' : 'lax',
    path: '/',
  });
}

/**
 * Read JWT from Authorization header OR httpOnly cookie.
 * Priority: Bearer header first (API tools), then cookie (browser).
 */
function extractToken(req) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const bearer = authHeader.slice(7).trim();
    if (bearer) return bearer;
  }

  if (req.cookies && req.cookies[COOKIE_NAME]) {
    return req.cookies[COOKIE_NAME];
  }

  return null;
}

module.exports = {
  COOKIE_NAME,
  setAuthCookie,
  clearAuthCookie,
  extractToken,
  cookieOptions,
};
