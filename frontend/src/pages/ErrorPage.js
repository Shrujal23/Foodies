import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeftIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  HomeIcon,
  LockClosedIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

const ERROR_VARIANTS = {
  403: {
    icon: LockClosedIcon,
    eyebrow: 'Private space',
    title: 'You cannot open this page.',
    description: 'This part of Foodies is reserved for a different account. If you think you should be here, check which account you are using.',
    primaryLabel: 'Go to your dashboard',
    primaryTo: '/dashboard',
    secondaryLabel: 'Go home',
    iconClass: 'text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-300 dark:bg-amber-950/30 dark:border-amber-900/60',
  },
  404: {
    icon: MagnifyingGlassIcon,
    eyebrow: 'A missing recipe',
    title: 'We could not find that page.',
    description: 'The link may be old, or the page may have moved. There is still plenty worth cooking around here.',
    primaryLabel: 'Browse recipes',
    primaryTo: '/recipes',
    secondaryLabel: 'Go home',
    iconClass: 'text-orange-700 bg-orange-50 border-orange-200 dark:text-orange-300 dark:bg-orange-950/30 dark:border-orange-900/60',
  },
  500: {
    icon: ExclamationTriangleIcon,
    eyebrow: 'Kitchen hiccup',
    title: 'Something went wrong on our side.',
    description: 'Your account and recipes should be safe. Try again in a moment, or head back to a page that is ready for you.',
    primaryLabel: 'Try again',
    iconClass: 'text-red-700 bg-red-50 border-red-200 dark:text-red-300 dark:bg-red-950/30 dark:border-red-900/60',
  },
  503: {
    icon: ArrowPathIcon,
    eyebrow: 'Taking a short break',
    title: 'Foodies is temporarily unavailable.',
    description: 'We are having trouble reaching the kitchen right now. Please try again shortly.',
    primaryLabel: 'Try again',
    iconClass: 'text-blue-700 bg-blue-50 border-blue-200 dark:text-blue-300 dark:bg-blue-950/30 dark:border-blue-900/60',
  },
};

export default function ErrorPage({ status = 500, onRetry }) {
  const navigate = useNavigate();
  const variant = ERROR_VARIANTS[status] || ERROR_VARIANTS[500];
  const Icon = variant.icon;

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
      return;
    }

    window.location.reload();
  };

  return (
    <main className="flex min-h-[65vh] items-center justify-center bg-[#fffaf7] px-4 py-16 dark:bg-gray-950 sm:px-6">
      <div className="w-full max-w-2xl text-center">
        <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-2xl border bg-white shadow-sm dark:bg-gray-900">
          <Icon className={`h-8 w-8 ${variant.iconClass.split(' ').filter((name) => name.startsWith('text-')).join(' ')}`} />
        </div>

        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-700 dark:text-orange-300">
          {variant.eyebrow}
        </p>
        <p className="mt-4 text-7xl font-bold tracking-tight text-[#eadbd1] dark:text-gray-800 sm:text-8xl">
          {status}
        </p>
        <h1 className="mt-2 text-3xl font-bold leading-tight text-[#35221a] dark:text-white sm:text-4xl">
          {variant.title}
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-[#7f665a] dark:text-gray-400">
          {variant.description}
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          {variant.primaryTo ? (
            <Link
              to={variant.primaryTo}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-400/50"
            >
              {variant.primaryLabel}
            </Link>
          ) : (
            <button
              type="button"
              onClick={handleRetry}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-400/50"
            >
              <ArrowPathIcon className="h-5 w-5" />
              {variant.primaryLabel}
            </button>
          )}

          {variant.secondaryLabel ? (
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#ddc9bc] bg-white px-5 py-3 text-sm font-semibold text-[#765648] transition hover:border-orange-400 hover:text-orange-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
            >
              <HomeIcon className="h-5 w-5" />
              {variant.secondaryLabel}
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#ddc9bc] bg-white px-5 py-3 text-sm font-semibold text-[#765648] transition hover:border-orange-400 hover:text-orange-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              Go back
            </button>
          )}
        </div>
      </div>
    </main>
  );
}

export function NotFoundPage() {
  return <ErrorPage status={404} />;
}

export function AccessDeniedPage() {
  return <ErrorPage status={403} />;
}

export function ServerErrorPage({ onRetry }) {
  return <ErrorPage status={500} onRetry={onRetry} />;
}

export function ServiceUnavailablePage({ onRetry }) {
  return <ErrorPage status={503} onRetry={onRetry} />;
}
