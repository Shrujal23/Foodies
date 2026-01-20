import { useEffect } from 'react';
import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import {
  ArrowRightIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline';

/**
 * AuthWarningModal - Beautiful warning modal for unauthenticated users
 * Shows when they try to access protected content
 */
export default function AuthWarningModal({ isOpen, onClose, onSignIn }) {
  // Auto-redirect after 3 seconds if user doesn't interact
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      onSignIn?.();
    }, 5000);

    return () => clearTimeout(timer);
  }, [isOpen, onSignIn]);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-8 text-left align-middle shadow-2xl transition-all">
                
                {/* Icon */}
                <div className="flex justify-center mb-6">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-orange-100 dark:bg-orange-900/30">
                      <LockClosedIcon className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                    </div>
                  </div>
                </div>

                {/* Title */}
                <Dialog.Title
                  as="h3"
                  className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-3"
                >
                  Sign In Required
                </Dialog.Title>

                {/* Description */}
                <p className="text-center text-gray-600 dark:text-gray-300 mb-2">
                  This feature is exclusively available to our registered members.
                </p>

                <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-8">
                  Sign in to your account to access this page and start sharing your recipes!
                </p>

                {/* Redirect Timer */}
                <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg px-4 py-3 mb-8">
                  <p className="text-sm text-orange-800 dark:text-orange-200 text-center">
                    <span className="font-semibold">Auto-redirecting</span> to sign in page...
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={onSignIn}
                    className="w-full inline-flex justify-center items-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-pink-600 text-white font-semibold py-3 px-4 hover:from-orange-600 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <ArrowRightIcon className="h-5 w-5" />
                    Sign In Now
                  </button>

                  <button
                    onClick={onClose}
                    className="w-full rounded-lg border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold py-3 px-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
                  >
                    Go Back
                  </button>
                </div>

                {/* Help Text */}
                <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-6">
                  Don't have an account?{' '}
                  <a
                    href="/register"
                    className="text-orange-600 dark:text-orange-400 font-semibold hover:underline"
                  >
                    Create one now
                  </a>
                </p>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
