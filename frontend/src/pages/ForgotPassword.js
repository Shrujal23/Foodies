// src/pages/ForgotPassword.js
import React, { useState } from 'react';
import { ArrowLeftIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(''); // '', 'sending', 'success', 'error'

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;

    setStatus('sending');
    
    // Simulate API call
    setTimeout(() => {
      setStatus('success');
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-rose-50 dark:from-gray-950 dark:to-black flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">

        {/* Back to Login */}
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-pink-400 mb-8 transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Back to Login
        </Link>

        <div className="glass-card-hover p-10 rounded-3xl shadow-2xl">

          {status === 'success' ? (
            <div className="text-center py-10">
              <CheckCircleIcon className="w-20 h-20 mx-auto mb-6 text-emerald-500" />
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Check Your Email
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                We’ve sent a password reset link to
              </p>
              <p className="text-xl font-semibold text-orange-600 dark:text-pink-400 mt-2">
                {email}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-6">
                Didn’t receive it? Check spam or try again.
              </p>
            </div>
          ) : (
            <>
              <div className="text-center mb-10">
                <h1 className="text-4xl font-bold text-gradient mb-4">
                  Forgot Password?
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  No worries! Just enter your email and we’ll send you a reset link.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="form-input"
                    placeholder="you@example.com"
                    disabled={status === 'sending'}
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'sending' || !email}
                  className="btn-primary w-full py-5 text-xl font-bold"
                >
                  {status === 'sending' ? 'Sending Link...' : 'Send Reset Link'}
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Remember your password?{' '}
                  <Link
                    to="/login"
                    className="font-semibold text-orange-600 dark:text-pink-400 hover:underline"
                  >
                    Log in here
                  </Link>
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer Note */}
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-10">
          © 2025 Your Recipe App • Made with love in India
        </p>
      </div>
    </div>
  );
}