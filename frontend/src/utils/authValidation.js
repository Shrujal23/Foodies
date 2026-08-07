/**
 * Shared auth validation (client-side).
 * Server-side rules in backend/middleware/validation.js must stay in sync.
 */

export const USERNAME_MIN = 3;
export const USERNAME_MAX = 30;
export const PASSWORD_MIN = 8;
export const PASSWORD_MAX = 128;
export const IDENTIFIER_MAX = 254;
export const EMAIL_MAX = 254;

const EMAIL_RE =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

const USERNAME_RE = /^[a-zA-Z0-9_-]+$/;

const SPECIAL_RE = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/;

export function getPasswordChecks(password = '') {
  return {
    length: password.length >= PASSWORD_MIN && password.length <= PASSWORD_MAX,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: SPECIAL_RE.test(password),
  };
}

export function isPasswordStrong(password) {
  const c = getPasswordChecks(password);
  return c.length && c.lowercase && c.uppercase && c.number && c.special;
}

export function validateUsername(username) {
  const value = (username || '').trim();
  if (!value) return 'Username is required';
  if (value.length < USERNAME_MIN || value.length > USERNAME_MAX) {
    return `Username must be ${USERNAME_MIN}–${USERNAME_MAX} characters`;
  }
  if (!USERNAME_RE.test(value)) {
    return 'Username can only use letters, numbers, underscores, and hyphens';
  }
  if (/^[_-]+$/.test(value)) {
    return 'Username must include at least one letter or number';
  }
  return null;
}

export function validateEmail(email) {
  const value = (email || '').trim().toLowerCase();
  if (!value) return 'Email is required';
  if (value.length > EMAIL_MAX) return 'Email is too long';
  if (!EMAIL_RE.test(value)) return 'Enter a valid email address';
  return null;
}

/** Login identifier: email or username */
export function validateIdentifier(identifier) {
  const value = (identifier || '').trim();
  if (!value) return 'Email or username is required';
  if (value.length > IDENTIFIER_MAX) return 'Email or username is too long';
  if (value.includes('@')) {
    return validateEmail(value);
  }
  if (value.length < USERNAME_MIN) {
    return `Username must be at least ${USERNAME_MIN} characters`;
  }
  if (!USERNAME_RE.test(value)) {
    return 'Username can only use letters, numbers, underscores, and hyphens';
  }
  return null;
}

export function validatePasswordLogin(password) {
  if (!password) return 'Password is required';
  if (password.length > PASSWORD_MAX) return 'Password is too long';
  return null;
}

export function validatePasswordRegister(password) {
  if (!password) return 'Password is required';
  if (password.length < PASSWORD_MIN) {
    return `Password must be at least ${PASSWORD_MIN} characters`;
  }
  if (password.length > PASSWORD_MAX) {
    return `Password must be at most ${PASSWORD_MAX} characters`;
  }
  if (!isPasswordStrong(password)) {
    return 'Password needs uppercase, lowercase, a number, and a special character';
  }
  return null;
}

export function validateConfirmPassword(password, confirm) {
  if (!confirm) return 'Please confirm your password';
  if (password !== confirm) return 'Passwords do not match';
  return null;
}

export function sanitizeIdentifier(identifier) {
  return (identifier || '').trim();
}

export function sanitizeUsername(username) {
  return (username || '').trim();
}

export function sanitizeEmail(email) {
  return (email || '').trim().toLowerCase();
}
