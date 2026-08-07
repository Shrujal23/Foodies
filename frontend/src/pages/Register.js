import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import toast, { Toaster } from 'react-hot-toast';
import { register } from '../services/authService';
import {
  getPasswordChecks,
  isPasswordStrong,
  validateUsername,
  validateEmail,
  validatePasswordRegister,
  validateConfirmPassword,
  sanitizeUsername,
  sanitizeEmail,
  USERNAME_MAX,
  EMAIL_MAX,
  PASSWORD_MAX,
  PASSWORD_MIN,
} from '../utils/authValidation';

const inputBase =
  'w-full px-4 py-3 rounded-xl border bg-[#fffdfb] dark:bg-gray-800 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition text-gray-900 dark:text-white';
const inputOk = 'border-[#f0d8c7] dark:border-gray-700';
const inputErr = 'border-red-400 dark:border-red-500 ring-1 ring-red-300 dark:ring-red-800';

const STRENGTH_LABELS = ['Very weak', 'Weak', 'Fair', 'Good', 'Strong'];

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const passwordChecks = useMemo(
    () => getPasswordChecks(formData.password),
    [formData.password]
  );

  const passwordStrength = useMemo(
    () => Object.values(passwordChecks).filter(Boolean).length,
    [passwordChecks]
  );

  const passwordsMatch =
    formData.password && formData.confirmPassword
      ? formData.password === formData.confirmPassword
      : false;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => (prev[name] ? { ...prev, [name]: null } : prev));
  };

  const validateField = (name, value, all = formData) => {
    switch (name) {
      case 'username':
        return validateUsername(value);
      case 'email':
        return validateEmail(value);
      case 'password':
        return validatePasswordRegister(value);
      case 'confirmPassword':
        return validateConfirmPassword(all.password, value);
      default:
        return null;
    }
  };

  const runFullValidation = () => {
    const next = {
      username: validateUsername(formData.username),
      email: validateEmail(formData.email),
      password: validatePasswordRegister(formData.password),
      confirmPassword: validateConfirmPassword(
        formData.password,
        formData.confirmPassword
      ),
      agreed: agreed ? null : 'You must accept the Terms and Privacy Policy',
    };
    setErrors(next);
    return Object.values(next).every((v) => !v);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    if (!runFullValidation()) {
      toast.error('Please fix the highlighted fields', { duration: 2500 });
      return;
    }

    if (!isPasswordStrong(formData.password)) {
      toast.error('Password does not meet security requirements', { duration: 2500 });
      return;
    }

    setSubmitting(true);
    toast.loading('Creating your account...', { id: 'register' });

    try {
      await register({
        username: sanitizeUsername(formData.username),
        email: sanitizeEmail(formData.email),
        password: formData.password,
      });

      toast.success('Account created. Please sign in.', { id: 'register' });
      navigate('/login');
    } catch (error) {
      toast.error(error.message || 'Registration failed. Try again.', {
        id: 'register',
        duration: 3500,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const requirementRow = (ok, label) => (
    <div className="flex items-center gap-2">
      {ok ? (
        <CheckCircleIcon className="w-4 h-4 text-emerald-500 shrink-0" />
      ) : (
        <XCircleIcon className="w-4 h-4 text-red-500 shrink-0" />
      )}
      <span className={ok ? 'text-emerald-700 dark:text-emerald-400' : ''}>{label}</span>
    </div>
  );

  return (
    <>
      <Toaster position="top-center" />

      <div className="min-h-screen flex items-center justify-center bg-[#fffaf7] dark:bg-gray-950 px-4 py-12">
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

          <div className="bg-white/90 dark:bg-gray-900 rounded-2xl shadow-[0_20px_50px_rgba(53,34,26,0.12)] border border-[#f4ddce] dark:border-gray-800 p-8">
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div>
                <label
                  htmlFor="reg-username"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Username
                </label>
                <input
                  id="reg-username"
                  type="text"
                  name="username"
                  autoComplete="username"
                  maxLength={USERNAME_MAX}
                  value={formData.username}
                  onChange={handleChange}
                  onBlur={(e) =>
                    setErrors((prev) => ({
                      ...prev,
                      username: validateField('username', e.target.value),
                    }))
                  }
                  disabled={submitting}
                  aria-invalid={!!errors.username}
                  className={`${inputBase} ${errors.username ? inputErr : inputOk}`}
                  placeholder="chef_jamie"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  3–30 characters. Letters, numbers, _ and - only.
                </p>
                {errors.username && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400" role="alert">
                    {errors.username}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="reg-email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Email address
                </label>
                <input
                  id="reg-email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  maxLength={EMAIL_MAX}
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={(e) =>
                    setErrors((prev) => ({
                      ...prev,
                      email: validateField('email', e.target.value),
                    }))
                  }
                  disabled={submitting}
                  aria-invalid={!!errors.email}
                  className={`${inputBase} ${errors.email ? inputErr : inputOk}`}
                  placeholder="you@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400" role="alert">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="reg-password"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Password
                </label>
                <input
                  id="reg-password"
                  type="password"
                  name="password"
                  autoComplete="new-password"
                  maxLength={PASSWORD_MAX}
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={(e) =>
                    setErrors((prev) => ({
                      ...prev,
                      password: validateField('password', e.target.value),
                    }))
                  }
                  disabled={submitting}
                  aria-invalid={!!errors.password}
                  className={`${inputBase} ${errors.password ? inputErr : inputOk}`}
                  placeholder={`At least ${PASSWORD_MIN} characters`}
                />

                <div className="mt-3 space-y-1.5 text-xs text-gray-600 dark:text-gray-400">
                  {requirementRow(passwordChecks.length, `At least ${PASSWORD_MIN} characters (max ${PASSWORD_MAX})`)}
                  {requirementRow(passwordChecks.lowercase, 'Lowercase letter')}
                  {requirementRow(passwordChecks.uppercase, 'Uppercase letter')}
                  {requirementRow(passwordChecks.number, 'Number')}
                  {requirementRow(passwordChecks.special, 'Special character (!@#$%…)')}
                </div>

                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
                  <div
                    className={`h-full rounded-full transition-all ${
                      passwordStrength >= 5
                        ? 'bg-emerald-500 w-full'
                        : passwordStrength === 4
                          ? 'bg-lime-500 w-4/5'
                          : passwordStrength === 3
                            ? 'bg-amber-500 w-3/5'
                            : passwordStrength === 2
                              ? 'bg-orange-500 w-2/5'
                              : passwordStrength === 1
                                ? 'bg-red-500 w-1/5'
                                : 'bg-red-500 w-0'
                    }`}
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Strength:{' '}
                  {passwordStrength === 0
                    ? '—'
                    : STRENGTH_LABELS[Math.min(passwordStrength, 5) - 1]}
                </p>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400" role="alert">
                    {errors.password}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="reg-confirm"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Confirm password
                </label>
                <input
                  id="reg-confirm"
                  type="password"
                  name="confirmPassword"
                  autoComplete="new-password"
                  maxLength={PASSWORD_MAX}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={(e) =>
                    setErrors((prev) => ({
                      ...prev,
                      confirmPassword: validateField(
                        'confirmPassword',
                        e.target.value,
                        formData
                      ),
                    }))
                  }
                  disabled={submitting}
                  aria-invalid={!!errors.confirmPassword}
                  className={`${inputBase} ${errors.confirmPassword ? inputErr : inputOk}`}
                  placeholder="Type password again"
                />
                {formData.confirmPassword && (
                  <div className="mt-2 flex items-center gap-2 text-sm">
                    {passwordsMatch ? (
                      <>
                        <CheckCircleIcon className="w-4 h-4 text-emerald-500" />
                        <span className="text-emerald-600 dark:text-emerald-400">
                          Passwords match
                        </span>
                      </>
                    ) : (
                      <>
                        <XCircleIcon className="w-4 h-4 text-red-500" />
                        <span className="text-red-600 dark:text-red-400">
                          Passwords do not match
                        </span>
                      </>
                    )}
                  </div>
                )}
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400" role="alert">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => {
                      setAgreed(e.target.checked);
                      setErrors((prev) => ({ ...prev, agreed: null }));
                    }}
                    disabled={submitting}
                    className="w-4 h-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500 dark:border-gray-600 dark:bg-gray-800"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="font-medium text-gray-700 dark:text-gray-300">
                    I agree to the{' '}
                    <Link
                      to="/terms"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-600 hover:text-orange-500 hover:underline"
                    >
                      Terms
                    </Link>{' '}
                    and{' '}
                    <Link
                      to="/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-600 hover:text-orange-500 hover:underline"
                    >
                      Privacy Policy
                    </Link>
                  </label>
                  {errors.agreed && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400" role="alert">
                      {errors.agreed}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting || !agreed || !isPasswordStrong(formData.password) || !passwordsMatch}
                className={`w-full py-3.5 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg ${
                  !submitting && agreed && isPasswordStrong(formData.password) && passwordsMatch
                    ? 'bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 transform hover:scale-[1.02]'
                    : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed opacity-70'
                }`}
              >
                {submitting ? 'Creating account…' : 'Create Account'}
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
                className="flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 hover:bg-gray-50 transition"
              >
                <span className="text-sm font-medium">Google</span>
              </a>
              <a
                href="/auth/github"
                className="flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 hover:bg-gray-50 transition"
              >
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
