import { Fragment } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, SunIcon, MoonIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { logout } from '../../services/authService';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';

const navigation = [
  { name: 'Home', href: '/', protected: false },
  { name: 'Dashboard', href: '/dashboard', protected: true },
  { name: 'Add Recipe', href: '/recipes/add', protected: true },
  { name: 'Recipes', href: '/my-recipes', protected: false },
  { name: 'Collections', href: '/collections', protected: true },
  { name: 'About Us', href: '/about', protected: false },
  { name: 'Contact Us', href: '/contact', protected: false },
  {name: 'Subscriptions', href: '/subscriptions', protected: false}
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Navbar() {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();
  const { user } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleProtectedClick = (e, href) => {
    if (!user) {
      e.preventDefault();
      toast.error('Please sign in to access this feature', {
        icon: <LockClosedIcon className="h-5 w-5" />,
        duration: 2000,
      });
      setTimeout(() => navigate('/login'), 1000);
    }
  };

  const currentPath = window.location.pathname;

  return (
    <Disclosure as="nav" className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 lg:h-18 flex items-center justify-between">

              {/* Logo */}
              <div className="flex items-center">
                <Link
                  to="/"
                  className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent hover:opacity-90 transition"
                >
                  Foodies
                </Link>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center space-x-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={(e) => item.protected && handleProtectedClick(e, item.href)}
                    className={classNames(
                      currentPath === item.href
                        ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-orange-600 dark:hover:text-orange-400',
                      item.protected && !user 
                        ? 'opacity-50 cursor-not-allowed hover:bg-transparent' 
                        : '',
                      'px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative group'
                    )}
                  >
                    {item.name}
                    {item.protected && !user && (
                      <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 hidden group-hover:block bg-gray-800 dark:bg-gray-700 text-white text-xs py-1 px-2 rounded whitespace-nowrap pointer-events-none">
                        Sign in required
                      </span>
                    )}
                  </Link>
                ))}
              </div>

              {/* Right Side: Theme + User Menu */}
              <div className="flex items-center gap-3">

                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                  aria-label="Toggle theme"
                >
                  {isDarkMode ? (
                    <SunIcon className="h-5 w-5" />
                  ) : (
                    <MoonIcon className="h-5 w-5" />
                  )}
                </button>

                {/* User Menu */}
                {user ? (
                  <Menu as="div" className="relative">
                    <Menu.Button className="flex items-center gap-3 rounded-xl bg-gray-100 dark:bg-gray-800 px-4 py-2.5 hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                      <img
                        src={user.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'}
                        alt={user.username}
                        className="h-9 w-9 rounded-full object-cover ring-2 ring-white dark:ring-gray-800"
                      />
                      <span className="hidden sm:block font-medium text-gray-700 dark:text-gray-200">
                        {user.display_name || user.username}
                      </span>
                    </Menu.Button>

                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-150"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-100"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 mt-3 w-56 origin-top-right rounded-2xl bg-white dark:bg-gray-800 shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none py-2">
                        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                          <p className="text-sm font-medium text-gray-600">Signed in as</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {user.email || user.username}
                          </p>
                        </div>

                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/dashboard"
                              className={classNames(
                                active ? 'bg-gray-50 dark:bg-gray-700' : '',
                                'block px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:text-orange-600'
                              )}
                            >
                              Dashboard
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/profile"
                              className={classNames(
                                active ? 'bg-gray-50 dark:bg-gray-700' : '',
                                'block px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:text-orange-600'
                              )}
                            >
                              Profile Settings
                            </Link>
                          )}
                        </Menu.Item>

                        {user.role === 'admin' && (
                          <>
                            <Menu.Item>
                              {({ active }) => (
                                <Link
                                  to="/admin/collections"
                                  className={classNames(
                                    active ? 'bg-gray-50 dark:bg-gray-700' : '',
                                    'block px-4 py-3 text-sm text-purple-600 dark:text-purple-400 font-medium hover:text-purple-700'
                                  )}
                                >
                                  🔧 Manage Collections
                                </Link>
                              )}
                            </Menu.Item>
                          </>
                        )}

                        <div className="border-t border-gray-100 dark:border-gray-700 my-1" />

                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={handleLogout}
                              className={classNames(
                                active ? 'bg-gray-50 dark:bg-gray-700' : '',
                                'block w-full text-left px-4 py-3 text-sm text-red-600 dark:text-red-400 font-medium'
                              )}
                            >
                              Sign out
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                ) : (
                  /* Guest Menu */
                  <Menu as="div" className="relative">
                    <Menu.Button className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl transition shadow-md">
                      <span>Sign in</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </Menu.Button>

                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-150"
                      enterFrom="opacity-0 scale-95"
                      enterTo="opacity-100 scale-100"
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100 scale-100"
                      leaveTo="opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 mt-3 w-64 origin-top-right rounded-2xl bg-white dark:bg-gray-800 shadow-xl ring-1 ring-black/5 py-3">
                        <Menu.Item>
                          <Link
                            to="/login"
                            className="flex items-center gap-3 px-5 px-6 py-3 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                            </svg>
                            Sign in
                          </Link>
                        </Menu.Item>
                        <Menu.Item>
                          <Link
                            to="/register"
                            className="flex items-center gap-3 px-6 py-3 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-4.75A2.25 2.25 0 0110 9.75v4.5A2.25 2.25 0 0112.25 16.5h4.5A2.25 2.25 0 0119 14.25V10a2.25 2.25 0 00-2.25-2.25H12M9 12h6" />
                            </svg>
                            Create account
                          </Link>
                        </Menu.Item>
                        <div className="my-2 border-t border-gray-100 dark:border-gray-700" />
                        <Menu.Item>
                          <a
                            href="/auth/github"
                            className="flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                          >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                            </svg>
                            Continue with GitHub
                          </a>
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                )}

                {/* Mobile menu button */}
                <Disclosure.Button className="lg:hidden p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                  {open ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          <Disclosure.Panel className="lg:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
            <div className="px-4 pt-4 pb-6 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={classNames(
                    currentPath === item.href
                      ? 'bg-orange-100 dark:bg-orange-900/20 text-orange-600'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800',
                    'block px-4 py-3 rounded-xl text-base font-medium transition'
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}