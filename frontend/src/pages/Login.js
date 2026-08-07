import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { login } from '../services/authService';
import {
  validateIdentifier,
  validatePasswordLogin,
  sanitizeIdentifier,
  IDENTIFIER_MAX,
  PASSWORD_MAX,
} from '../utils/authValidation';

const inputBase =
  'w-full px-4 py-3 rounded-xl border bg-[#fffdfb] dark:bg-gray-800 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition text-gray-900 dark:text-white';
const inputOk = 'border-[#f0d8c7] dark:border-gray-700';
const inputErr = 'border-red-400 dark:border-red-500 ring-1 ring-red-300 dark:ring-red-800';

export default function Login() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({ identifier: null, password: null });
  const [submitting, setSubmitting] = useState(false);

  const clearFieldError = (field) => {
    setErrors((prev) => (prev[field] ? { ...prev, [field]: null } : prev));
  };

  const runValidation = () => {
    const next = {
      identifier: validateIdentifier(identifier),
      password: validatePasswordLogin(password),
    };
    setErrors(next);
    return !next.identifier && !next.password;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    if (!runValidation()) {
      toast.error('Please fix the errors before signing in', { duration: 2500 });
      return;
    }

    setSubmitting(true);
    toast.loading('Signing you in...', { id: 'login' });

    try {
      const cleanId = sanitizeIdentifier(identifier);
      const lookup = cleanId.includes('@') ? cleanId.toLowerCase() : cleanId;
      await login(lookup, password, rememberMe);
      toast.success('Welcome back!', { id: 'login' });
      navigate('/');
    } catch (error) {
      // Keep message generic when server says so; still show server validation text
      toast.error(error.message || 'Invalid username/email or password', {
        id: 'login',
        duration: 3000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />

      <div className="min-h-screen flex items-center justify-center bg-[#fffaf7] dark:bg-gray-950 px-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent">
              Foodies
            </h1>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-lg">
              Good to see you again.
            </p>
          </div>

          <div className="bg-white/90 dark:bg-gray-900 rounded-2xl shadow-[0_20px_50px_rgba(53,34,26,0.12)] border border-[#f4ddce] dark:border-gray-800 p-8">
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              <div>
                <label
                  htmlFor="login-identifier"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Email or username
                </label>
                <input
                  id="login-identifier"
                  name="identifier"
                  type="text"
                  autoComplete="username"
                  inputMode="email"
                  maxLength={IDENTIFIER_MAX}
                  value={identifier}
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    clearFieldError('identifier');
                  }}
                  onBlur={() =>
                    setErrors((prev) => ({
                      ...prev,
                      identifier: validateIdentifier(identifier),
                    }))
                  }
                  disabled={submitting}
                  aria-invalid={!!errors.identifier}
                  aria-describedby={errors.identifier ? 'login-identifier-error' : undefined}
                  className={`${inputBase} ${errors.identifier ? inputErr : inputOk}`}
                  placeholder="you@example.com or chef_name"
                />
                {errors.identifier && (
                  <p id="login-identifier-error" className="mt-1.5 text-xs text-red-600 dark:text-red-400" role="alert">
                    {errors.identifier}
                  </p>
                )}
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label
                    htmlFor="login-password"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-orange-600 hover:text-orange-500 font-medium transition"
                  >
                    Forgot?
                  </Link>
                </div>
                <input
                  id="login-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  maxLength={PASSWORD_MAX}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    clearFieldError('password');
                  }}
                  onBlur={() =>
                    setErrors((prev) => ({
                      ...prev,
                      password: validatePasswordLogin(password),
                    }))
                  }
                  disabled={submitting}
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? 'login-password-error' : undefined}
                  className={`${inputBase} ${errors.password ? inputErr : inputOk}`}
                  placeholder="Your password"
                />
                {errors.password && (
                  <p id="login-password-error" className="mt-1.5 text-xs text-red-600 dark:text-red-400" role="alert">
                    {errors.password}
                  </p>
                )}
              </div>

              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={submitting}
                  className="w-4 h-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500 dark:border-gray-600 dark:bg-gray-800"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Remember me on this device
                </label>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-pink-700 transform hover:scale-[1.02] transition-all duration-200 shadow-[0_10px_25px_rgba(239,102,73,0.25)] disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
              >
                {submitting ? 'Signing in…' : 'Sign In'}
              </button>
            </form>

            <div className="my-8 flex items-center">
              <div className="flex-1 border-t border-gray-300 dark:border-gray-700" />
              <span className="px-4 text-sm text-gray-500">or</span>
              <div className="flex-1 border-t border-gray-300 dark:border-gray-700" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <a
                href="/auth/google"
                className="flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="#EA4335" d="M12 5.04c2.9 0 1.8.3 2.5.9l1.9-1.9C15.3 2.6 13.7 2 12 2 7.3 2 3.2 5.2 1.3 9.7l2.4 1.8C4.5 8.1 8 5.5 12 5.5c1.7 0 3.2.6 4.4 1.6z" />
                  <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.4H12v4.5h6.4c-.3 1.5-1.1 2.8-2.3 3.6v2.9h3.7c2.2-2 3.5-5 3.5-8.5z" />
                  <path fill="#34A853" d="M5.8 14.5c-.2-.6-.3-1.3-.3-2s.1-1.4.3-2V7.7L2.3 5.9C.8 8.8.1 11.1.1 13.5s.7 4.7 2.2 6.6l3.5-2.6z" />
                  <path fill="#FBBC05" d="M12 23.5c3.2 0 5.9-1.1 7.9-3l-3.7-2.9c-1 .7-2.3 1.1-3.9 1.1-3 0-5.5-2-6.4-4.7l-3.4 2.6C3.8 20.6 7.6 23.5 12 23.5z" />
                </svg>
                <span className="text-sm font-medium">Google</span>
              </a>

              <a
                href="/auth/github"
                className="flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                <span className="text-sm font-medium">GitHub</span>
              </a>
            </div>

            <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
              Don&apos;t have an account?{' '}
              <Link
                to="/register"
                className="font-semibold text-orange-600 hover:text-orange-500 transition"
              >
                Sign up free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
