import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import toast, { Toaster } from 'react-hot-toast';
import { register } from '../services/authService';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [agreed, setAgreed] = useState(false);

  const passwordChecks = useMemo(() => {
    const password = formData.password;
    return {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      symbol: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
    };
  }, [formData.password]);

  const passwordStrength = useMemo(() => {
    return Object.values(passwordChecks).filter(Boolean).length;
  }, [passwordChecks]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match', { duration: 1000 });
      return;
    }

    if (passwordStrength < 4) {
      toast.error('Password does not meet the security requirements', { duration: 1000 });
      return;
    }

    if (!agreed) {
      toast.error('Please agree to the Terms and Privacy Policy', { duration: 1000 });
      return;
    }

    toast.loading('Creating your account...', { id: 'register' });

    try {
      await register({
        username: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      toast.success('Account created successfully!', { id: 'register' });
      setTimeout(() => navigate('/login'), 1500);
    } catch (error) {
      toast.error(error.message || 'Something went wrong. Try again.', { id: 'register', duration: 1000 });
    }
  };

  return (
    <>
      <Toaster position="top-center" />

      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 py-12">
        <div className="max-w-md w-full">

          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent">
              Foodies
            </h1>
            <p className="mt-3 text-xl text-gray-700 dark:text-gray-300 font-medium">
              Create an account
            </p>
            <p className="mt-1 text-gray-500 dark:text-gray-400">
              Save, share, and review your favorite dishes.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                  placeholder="Jamie Oliver"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email address
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                  placeholder="At least 8 characters"
                />
                <div className="mt-4 space-y-2 text-xs text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    {passwordChecks.length ? (
                      <CheckCircleIcon className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <XCircleIcon className="w-4 h-4 text-red-500" />
                    )}
                    <span>Password is at least 8 characters</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {passwordChecks.lowercase ? (
                      <CheckCircleIcon className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <XCircleIcon className="w-4 h-4 text-red-500" />
                    )}
                    <span>Contains lowercase letter</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {passwordChecks.uppercase ? (
                      <CheckCircleIcon className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <XCircleIcon className="w-4 h-4 text-red-500" />
                    )}
                    <span>Contains uppercase letter</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {passwordChecks.number ? (
                      <CheckCircleIcon className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <XCircleIcon className="w-4 h-4 text-red-500" />
                    )}
                    <span>Contains number</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {passwordChecks.symbol ? (
                      <CheckCircleIcon className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <XCircleIcon className="w-4 h-4 text-red-500" />
                    )}
                    <span>Contains symbol</span>
                  </div>
                </div>
                <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
                  <div className={`h-full rounded-full transition-all ${
                    passwordStrength >= 5 ? 'bg-emerald-500 w-full' :
                    passwordStrength === 4 ? 'bg-lime-500 w-4/5' :
                    passwordStrength === 3 ? 'bg-amber-500 w-3/5' :
                    passwordStrength === 2 ? 'bg-orange-500 w-2/5' :
                    passwordStrength === 1 ? 'bg-red-500 w-1/5' :
                    'bg-red-500 w-0'
                  }`} />
                </div>
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Password strength: {['Very Weak','Weak','Fair','Good','Strong'][Math.max(0, passwordStrength - 1)]}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Confirm password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                  placeholder="Type again to confirm"
                />
              </div>

          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                aria-required="true"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500 dark:border-gray-600 dark:bg-gray-800"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="terms" className="font-medium text-gray-700 dark:text-gray-300">
                I agree to the{' '}
                <Link to="/terms" className="text-orange-600 hover:text-orange-500 hover:underline">Terms</Link>
                {' '}and{' '}
                <Link to="/privacy" className="text-orange-600 hover:text-orange-500 hover:underline">Privacy Policy</Link>
              </label>
              {!agreed && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">You must agree before creating an account.</p>
              )}
            </div>
          </div>

              <button
                type="submit"
                disabled={!agreed}
                className={`w-full py-3.5 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg ${agreed ? 'bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 transform hover:scale-[1.02]' : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed opacity-70'}`}
              >
                Create Account
              </button>
            </form>

            <div className="my-8 flex items-center">
              <div className="flex-1 border-t border-gray-300 dark:border-gray-700"></div>
              <span className="px-4 text-sm text-gray-500">or</span>
              <div className="flex-1 border-t border-gray-300 dark:border-gray-700"></div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <a
                href="/auth/google"
                className="flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5.04c2.9 0 1.8.3 2.5.9l1.9-1.9C15.3 2.6 13.7 2 12 2 7.3 2 3.2 5.2 1.3 9.7l2.4 1.8C4.5 8.1 8 5.5 12 5.5c1.7 0 3.2.6 4.4 1.6z"/>
                  <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.4H12v4.5h6.4c-.3 1.5-1.1 2.8-2.3 3.6v2.9h3.7c2.2-2 3.5-5 3.5-8.5z"/>
                  <path fill="#34A853" d="M5.8 14.5c-.2-.6-.3-1.3-.3-2s.1-1.4.3-2V7.7L2.3 5.9C.8 8.8.1 11.1.1 13.5s.7 4.7 2.2 6.6l3.5-2.6z"/>
                  <path fill="#FBBC05" d="M12 23.5c3.2 0 5.9-1.1 7.9-3l-3.7-2.9c-1 .7-2.3 1.1-3.9 1.1-3 0-5.5-2-6.4-4.7l-3.4 2.6C3.8 20.6 7.6 23.5 12 23.5z"/>
                </svg>
                <span className="text-sm font-medium">Google</span>
              </a>

              <a
                href="/auth/github"
                className="flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <span className="text-sm font-medium">GitHub</span>
              </a>
            </div>

            <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-semibold text-orange-600 hover:text-orange-500 transition"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}