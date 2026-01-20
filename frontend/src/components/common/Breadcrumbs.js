import { Link, useLocation } from 'react-router-dom';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';

/**
 * Breadcrumbs component for navigation context
 * Automatically generates breadcrumbs from current URL
 * @param {array} customBreadcrumbs - Override with custom breadcrumb items: [{ label, path }]
 * @param {string} className - Additional CSS classes
 */
export default function Breadcrumbs({ customBreadcrumbs = null, className = '' }) {
  const location = useLocation();

  // Generate breadcrumbs from path
  const generateBreadcrumbs = () => {
    if (customBreadcrumbs) {
      return customBreadcrumbs;
    }

    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs = [{ label: 'Home', path: '/' }];

    let currentPath = '';
    pathSegments.forEach((segment) => {
      currentPath += `/${segment}`;
      const label = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      breadcrumbs.push({ label, path: currentPath });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs.length <= 1) {
    return null; // Don't show breadcrumbs on home page
  }

  return (
    <nav className={`flex items-center gap-2 text-sm ${className}`}>
      {breadcrumbs.map((breadcrumb, index) => (
        <div key={breadcrumb.path} className="flex items-center gap-2">
          {/* Breadcrumb Link */}
          {index === 0 ? (
            <Link
              to={breadcrumb.path}
              className="p-1 text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
              title="Home"
            >
              <HomeIcon className="w-5 h-5" />
            </Link>
          ) : index === breadcrumbs.length - 1 ? (
            <span className="text-gray-900 dark:text-white font-semibold">
              {breadcrumb.label}
            </span>
          ) : (
            <Link
              to={breadcrumb.path}
              className="text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
            >
              {breadcrumb.label}
            </Link>
          )}

          {/* Separator */}
          {index < breadcrumbs.length - 1 && (
            <ChevronRightIcon className="w-4 h-4 text-gray-400 dark:text-gray-600" />
          )}
        </div>
      ))}
    </nav>
  );
}
