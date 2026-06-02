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
  { name: 'Subscriptions', href: '/subscriptions', protected: false }
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
    <Disclosure as="nav" className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              {/* Logo */}
              <Link
                to="/"
                className="text-2xl font-bold logo-glow"
              >
                Foodies
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center space-x-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={(e) => item.protected && handleProtectedClick(e, item.href)}
                    className={classNames(
                      currentPath === item.href
                        ? 'bg-orange-100 dark:bg-orange-900/20 text-orange-600'
                        : 'text-gray-700 dark:text-gray-300 hover:text-orange-600',
                      item.protected && !user ? 'opacity-50 cursor-not-allowed' : '',
                      'px-3 py-2 rounded text-sm font-medium transition'
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* Right Side */}
              <div className="flex items-center gap-2">
                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
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
                    <Menu.Button className="flex items-center gap-2 rounded px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                      <img
                        src={user.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'}
                        alt={user.username}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                      <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-200">
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
                      <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded bg-white dark:bg-gray-800 shadow ring-1 ring-black/5 py-1 focus:outline-none">
                        <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                          <p className="text-xs font-medium text-gray-600">Signed in as</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {user.email || user.username}
                          </p>
                        </div>

                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/dashboard"
                              className={classNames(
                                active ? 'bg-gray-50 dark:bg-gray-700' : '',
                                'block px-4 py-2 text-sm text-gray-700 dark:text-gray-300'
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
                                'block px-4 py-2 text-sm text-gray-700 dark:text-gray-300'
                              )}
                            >
                              Profile
                            </Link>
                          )}
                        </Menu.Item>

                        {user.role === 'admin' && (
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                to="/admin/collections"
                                className={classNames(
                                  active ? 'bg-gray-50 dark:bg-gray-700' : '',
                                  'block px-4 py-2 text-sm text-purple-600 dark:text-purple-400 font-medium'
                                )}
                              >
                                Manage Collections
                              </Link>
                            )}
                          </Menu.Item>
                        )}

                        <div className="border-t border-gray-100 dark:border-gray-700 my-1" />

                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={handleLogout}
                              className={classNames(
                                active ? 'bg-gray-50 dark:bg-gray-700' : '',
                                'block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400'
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
                  <Menu as="div" className="relative">
                    <Menu.Button className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded transition">
                      Sign in
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
                      <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded bg-white dark:bg-gray-800 shadow ring-1 ring-black/5 py-1">
                        <Menu.Item>
                          <Link
                            to="/login"
                            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                          >
                            Sign in
                          </Link>
                        </Menu.Item>
                        <Menu.Item>
                          <Link
                            to="/register"
                            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                          >
                            Create account
                          </Link>
                        </Menu.Item>
                        <div className="border-t border-gray-100 dark:border-gray-700" />
                        <Menu.Item>
                          <a
                            href="/auth/github"
                            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                          >
                            GitHub
                          </a>
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                )}

                {/* Mobile menu button */}
                <Disclosure.Button className="lg:hidden p-2 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                  {open ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          <Disclosure.Panel className="lg:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
            <div className="px-4 pt-2 pb-4 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={(e) => item.protected && handleProtectedClick(e, item.href)}
                  className={classNames(
                    currentPath === item.href
                      ? 'bg-orange-100 dark:bg-orange-900/20 text-orange-600'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800',
                    'block px-4 py-2 rounded text-sm font-medium transition'
                  )}
                >
                  {item.name}
                </Link>
              ))}
              {!user && (
                <>
                  <Link
                    to="/login"
                    className="block px-4 py-2 rounded text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/register"
                    className="block px-4 py-2 rounded text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    Create account
                  </Link>
                </>
              )}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
