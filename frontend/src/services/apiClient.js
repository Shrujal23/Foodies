/**
 * API fetch wrapper — always sends credentials so the browser
 * includes the httpOnly auth cookie. Never reads/writes JWT in JS storage.
 */
import { API_BASE_URL } from '../config';

/**
 * @param {string} path - Absolute URL or path under API_BASE_URL (e.g. '/auth/login')
 * @param {RequestInit} [options]
 */
export async function apiFetch(path, options = {}) {
  const url = path.startsWith('http')
    ? path
    : `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;

  const headers = { ...(options.headers || {}) };

  // Strip any accidental Authorization header that might carry a leaked token
  // Cookie is the sole browser credential.
  if (headers.Authorization || headers.authorization) {
    delete headers.Authorization;
    delete headers.authorization;
  }

  return fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });
}
