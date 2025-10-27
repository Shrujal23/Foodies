import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { login } from '../services/authService';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      toast.loading('Signing in...', {
        id: 'login',
      });
      
      // Use the auth service to log in
      await login(email, password);
      
      // Success toast and redirect
      toast.success('Welcome back! Redirecting...', {
        id: 'login',
        duration: 2000,
      });
      
      // Wait for the toast to be visible before redirecting
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please check your credentials.', {
        id: 'login',
        duration: 3000,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Toaster />
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-display font-bold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/register" className="font-medium text-accent-600 hover:text-accent-500">
              create a new account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-t-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-accent-500 focus:border-accent-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-b-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-accent-500 focus:border-accent-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-accent-600 focus:ring-accent-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link to="/forgot-password" className="font-medium text-accent-600 hover:text-accent-500">
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-accent-600 hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500 transition duration-150 ease-in-out"
            >
              Sign in
            </button>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <a
                href="/auth/google"
                className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500 transition duration-150 ease-in-out"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12 5.04c2.17 0 4.1.9 5.45 2.36l4.03-4.03C19.25 1.28 15.87 0 12 0 7.31 0 3.23 2.7 1.26 6.71l4.7 3.64C7.08 7.31 9.39 5.04 12 5.04z"
                  />
                  <path
                    fill="#34A853"
                    d="M23.54 12.27c0-.95-.09-1.87-.25-2.75H12v5.2h6.44c-.28 1.5-1.12 2.77-2.39 3.62v3.01h3.87c2.26-2.08 3.56-5.14 3.56-8.77z"
                  />
                  <path
                    fill="#4A90E2"
                    d="M12 24c3.24 0 5.95-1.07 7.93-2.91l-3.87-3.01c-1.07.72-2.44 1.15-4.06 1.15-3.12 0-5.76-2.11-6.7-4.94l-4 3.09C3.24 21.17 7.31 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.3 14.29c-.24-.72-.37-1.49-.37-2.29s.13-1.57.37-2.29V6.71l-4-3.09C.36 5.19 0 7.03 0 9s.36 3.81.96 5.38l4.34-3.37z"
                  />
                </svg>
                Continue with Google
              </a>
              
              <a
                href="/auth/github"
                className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500 transition duration-150 ease-in-out"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                Continue with GitHub
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}