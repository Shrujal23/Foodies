import { Fragment } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { logout } from '../../services/authService';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';

const navigation = [
  { name: 'Home', href: '/', current: true },
  { name: 'Search', href: '/search', current: false },
  { name: 'Dashboard', href: '/dashboard', current: false },
  { name: 'Add Recipe', href: '/recipes/add', current: false },
  { name: 'My Recipes', href: '/my-recipes', current: false },
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
  return (
    <Disclosure as="nav" className="bg-gradient-to-r from-accent-600 to-accent-800 shadow-lg">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="relative flex h-20 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="inline-flex items-center justify-center rounded-lg p-2 text-white hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition duration-150 ease-in-out">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center">
                  <span className="text-white text-2xl font-display font-bold tracking-tight">Foodies</span>
                </div>
                <div className="hidden sm:ml-8 sm:block">
                  <div className="flex space-x-6">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={classNames(
                          item.current ? 'bg-accent-700 text-white' : 'text-white hover:bg-accent-700',
                          'rounded-lg px-4 py-2.5 text-sm font-medium transition duration-150 ease-in-out'
                        )}
                        aria-current={item.current ? 'page' : undefined}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className="inline-flex items-center justify-center rounded-lg p-2 text-white hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition duration-150 ease-in-out mr-2"
                >
                  {isDarkMode ? (
                    <SunIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <MoonIcon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </button>
                {user ? (
                  <Menu as="div" className="relative ml-3">
                    <div>
                      <Menu.Button className="flex rounded-full ring-2 ring-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-accent-600 transition duration-150 ease-in-out">
                        <span className="sr-only">Open user menu</span>
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={user.avatar_url}
                          alt=""
                        />
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-200"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-150"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-xl bg-white py-2 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/dashboard"
                              className={classNames(
                                active ? 'bg-gray-50' : '',
                                'block px-4 py-2.5 text-sm text-gray-700 hover:text-accent-600 transition duration-150 ease-in-out'
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
                                active ? 'bg-gray-50' : '',
                                'block px-4 py-2.5 text-sm text-gray-700 hover:text-accent-600 transition duration-150 ease-in-out'
                              )}
                            >
                              Profile Settings
                            </Link>
                          )}
                        </Menu.Item>
                        <div className="border-t border-gray-100 my-1"></div>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={handleLogout}
                              className={classNames(
                                active ? 'bg-gray-50' : '',
                                'block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:text-accent-600 transition duration-150 ease-in-out'
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
                  <Menu as="div" className="relative ml-3">
                    <div>
                      <Menu.Button className="inline-flex items-center text-white bg-accent-700 hover:bg-accent-800 rounded-lg px-4 py-2.5 text-sm font-medium transition duration-150 ease-in-out shadow-sm">
                        <span>Account</span>
                        <svg className="w-4 h-4 ml-2 -mr-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-200"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-150"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-xl bg-white py-2 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/login"
                              className={classNames(
                                active ? 'bg-gray-50' : '',
                                'flex items-center px-4 py-2.5 text-sm text-gray-700 hover:text-accent-600 transition duration-150 ease-in-out'
                              )}
                            >
                              <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                              </svg>
                              Sign In
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/register"
                              className={classNames(
                                active ? 'bg-gray-50' : '',
                                'flex items-center px-4 py-2.5 text-sm text-gray-700 hover:text-accent-600 transition duration-150 ease-in-out'
                              )}
                            >
                              <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                              </svg>
                              Register
                            </Link>
                          )}
                        </Menu.Item>
                        <div className="border-t border-gray-100 my-1"></div>
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="/auth/github"
                              className={classNames(
                                active ? 'bg-gray-50' : '',
                                'flex items-center px-4 py-2.5 text-sm text-gray-700 hover:text-accent-600 transition duration-150 ease-in-out'
                              )}
                            >
                              <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                              </svg>
                              Continue with GitHub
                            </a>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                )}
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-2 px-3 pb-4 pt-2">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as={Link}
                  to={item.href}
                  className={classNames(
                    item.current ? 'bg-accent-700 text-white' : 'text-white/90 hover:bg-accent-700 hover:text-white',
                    'block rounded-lg px-4 py-3 text-base font-medium transition duration-150 ease-in-out'
                  )}
                  aria-current={item.current ? 'page' : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}