import toast from 'react-hot-toast';
import { apiFetch } from './apiClient';

// In-memory user only — JWT is NOT stored here (lives in httpOnly cookie)
let currentUser = null;
const listeners = new Set();

const USER_KEY = 'user'; // profile cache only (no token field)

const notifyListeners = () => {
  listeners.forEach((listener) => listener(currentUser));
};

export const onAuthStateChanged = (callback) => {
  listeners.add(callback);
  callback(currentUser);
  return () => listeners.delete(callback);
};

const getStorageForRemember = (remember) => {
  if (remember === true) return localStorage;
  if (remember === false) return sessionStorage;
  if (localStorage.getItem(USER_KEY)) return localStorage;
  return sessionStorage;
};

/** Remove legacy token keys from older app versions */
function purgeLegacyTokens() {
  localStorage.removeItem('token');
  sessionStorage.removeItem('token');
}

/**
 * Cache user profile for UI only. Never store JWT in localStorage/sessionStorage.
 * @param {object|null} user
 * @param {string|null} [_ignoredToken] - kept for call-site compatibility; discarded
 * @param {boolean|null} remember
 */
export const setCurrentUser = (user, _ignoredToken = null, remember = null) => {
  purgeLegacyTokens();
  currentUser = user;

  if (user) {
    const storage = getStorageForRemember(remember);
    // Never put token on the user object in storage
    const { token, access_token, password_hash, ...safeUser } = user;
    storage.setItem(USER_KEY, JSON.stringify(safeUser));
    const other = storage === localStorage ? sessionStorage : localStorage;
    other.removeItem(USER_KEY);
    other.removeItem('token');
  } else {
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(USER_KEY);
    purgeLegacyTokens();
  }

  notifyListeners();
};

export const getCurrentUser = () => {
  if (!currentUser) {
    const stored =
      sessionStorage.getItem(USER_KEY) || localStorage.getItem(USER_KEY);
    if (stored) {
      try {
        currentUser = JSON.parse(stored);
      } catch {
        currentUser = null;
      }
    }
  }
  return currentUser;
};

/**
 * @deprecated JWT is in httpOnly cookie — JS must not hold the token.
 * Kept as null-returning stub so old call sites do not break.
 */
export const getToken = () => {
  purgeLegacyTokens();
  return null;
};

export const clearClientAuth = () => {
  setCurrentUser(null);
};

export const checkAuthStatus = async () => {
  try {
    const response = await apiFetch('/auth/status');

    if (response.ok) {
      const data = await response.json();
      if (data.user) {
        setCurrentUser(data.user);
        return data.user;
      }
    }

    setCurrentUser(null);
    return null;
  } catch (error) {
    console.error('Auth status check failed');
    setCurrentUser(null);
    return null;
  }
};

export const login = async (identifier, password, rememberMe = false) => {
  const response = await apiFetch('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier, password, rememberMe }),
  });

  if (response.ok) {
    const data = await response.json();
    // Cookie set by server; we only cache the user profile
    setCurrentUser(data.user, null, rememberMe);
    return data.user;
  }

  const errorText = await response.text();
  let errorMessage = 'Login failed. Please check your email and password.';
  try {
    const error = JSON.parse(errorText);
    if (error.message) errorMessage = error.message;
    if (Array.isArray(error.errors) && error.errors.length > 0) {
      errorMessage = error.errors.map((err) => err.message).join(' ');
    }
  } catch {
    // keep default
  }
  throw new Error(errorMessage);
};

export const register = async (userData) => {
  const response = await apiFetch('/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });

  if (response.ok) {
    return await response.json();
  }

  const errorText = await response.text();
  let errorMessage = 'Registration failed. Please check your information.';
  try {
    const error = JSON.parse(errorText);
    if (error.message) errorMessage = error.message;
    if (Array.isArray(error.errors) && error.errors.length > 0) {
      errorMessage = error.errors.map((err) => err.message).join(' ');
    }
  } catch {
    // keep default
  }
  throw new Error(errorMessage);
};

export const updateProfile = async (profileData) => {
  const formData = new FormData();

  if (profileData.username !== undefined) {
    formData.append('username', profileData.username);
  }
  if (profileData.display_name !== undefined) {
    formData.append('display_name', profileData.display_name);
  }
  if (profileData.email !== undefined) {
    formData.append('email', profileData.email);
  }
  if (profileData.avatarFile) {
    formData.append('avatar', profileData.avatarFile);
  } else if (profileData.avatar_url !== undefined) {
    formData.append('avatar_url', profileData.avatar_url);
  }

  const response = await apiFetch('/users/profile', {
    method: 'PUT',
    body: formData,
  });

  if (response.ok) {
    const data = await response.json();
    if (data.user) {
      setCurrentUser(data.user);
    }
    return data.user;
  }

  const errorText = await response.text();
  let errorMessage = 'Profile update failed. Please check your input.';
  try {
    const error = JSON.parse(errorText);
    if (error.message) errorMessage = error.message;
    if (Array.isArray(error.errors) && error.errors.length > 0) {
      errorMessage = error.errors.map((err) => err.message).join(' ');
    }
  } catch {
    // keep default
  }
  throw new Error(errorMessage);
};

export const logout = async () => {
  // Always clear client state first (textbook: don't leave local session if network fails)
  clearClientAuth();

  try {
    await apiFetch('/auth/logout', { method: 'GET' });
    toast.success('Successfully logged out!', { duration: 3000 });
    return true;
  } catch (error) {
    // Cookie clear may have still happened server-side; client already cleared
    toast.success('Signed out on this device.', { duration: 2000 });
    return true;
  }
};

// Boot: restore profile cache, then verify cookie session with server
purgeLegacyTokens();
getCurrentUser();
checkAuthStatus();
