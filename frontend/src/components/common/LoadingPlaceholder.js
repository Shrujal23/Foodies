import { useEffect, useState } from 'react';

/**
 * LoadingPlaceholder - Premium card-shaped skeleton loader
 * Perfect for showing loading states that exactly match card dimensions
 * 
 * Features:
 * - Multiple card presets (recipe, profile, compact)
 * - Animated pulse effects
 * - Matches actual content layout
 * - Dark mode support
 * - Accessibility ready
 * 
 * @param {string} variant - Type of card: 'recipe' | 'profile' | 'compact'
 * @param {number} count - Number of cards to show
 * @param {string} className - Additional CSS classes
 */
export default function LoadingPlaceholder({ 
  variant = 'recipe', 
  count = 6, 
  className = '' 
}) {
  const [isVisible, setIsVisible] = useState(false);

  // Stagger animation for entrance
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const renderRecipeCard = (index) => (
    <div
      key={index}
      className={`bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-lg transform transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      style={{ transitionDelay: `${index * 50}ms` }}
    >
      {/* Image Skeleton */}
      <div className="relative h-64 bg-gradient-to-r from-gray-200 to-gray-100 dark:from-gray-700 dark:to-gray-600 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent dark:via-white/5 animate-shimmer" />
      </div>

      {/* Content Skeleton */}
      <div className="p-6 space-y-4">
        {/* Title */}
        <div className="space-y-2">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4 animate-pulse" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-5/6 animate-pulse" />
        </div>

        {/* Description lines */}
        <div className="space-y-2 pt-2">
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-lg w-full animate-pulse" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-lg w-4/5 animate-pulse" />
        </div>

        {/* Footer stats */}
        <div className="flex justify-between pt-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-16 animate-pulse" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-20 animate-pulse" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-14 animate-pulse" />
        </div>
      </div>
    </div>
  );

  const renderProfileCard = (index) => (
    <div
      key={index}
      className={`bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg transform transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      style={{ transitionDelay: `${index * 50}ms` }}
    >
      {/* Avatar */}
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-gray-200 to-gray-100 dark:from-gray-700 dark:to-gray-600 animate-pulse" />
        <div className="flex-1">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4 mb-2 animate-pulse" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/2 animate-pulse" />
        </div>
      </div>

      {/* Bio */}
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-lg w-full animate-pulse" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-lg w-4/5 animate-pulse" />
      </div>
    </div>
  );

  const renderCompactCard = (index) => (
    <div
      key={index}
      className={`bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md transform transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      }`}
      style={{ transitionDelay: `${index * 30}ms` }}
    >
      <div className="flex gap-3">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-gray-200 to-gray-100 dark:from-gray-700 dark:to-gray-600 flex-shrink-0 animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-2/3 animate-pulse" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-lg w-full animate-pulse" />
        </div>
      </div>
    </div>
  );

  const renderCard = (index) => {
    switch (variant) {
      case 'profile':
        return renderProfileCard(index);
      case 'compact':
        return renderCompactCard(index);
      case 'recipe':
      default:
        return renderRecipeCard(index);
    }
  };

  return (
    <div className={`grid ${
      variant === 'compact' 
        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4' 
        : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
    } ${className}`}>
      {Array.from({ length: count }).map((_, i) => renderCard(i))}
    </div>
  );
}

/**
 * Custom CSS required (add to your Tailwind config):
 * 
 * @keyframes shimmer {
 *   0% { transform: translateX(-100%); }
 *   100% { transform: translateX(100%); }
 * }
 * 
 * In tailwind.config.js:
 * animation: {
 *   shimmer: 'shimmer 2s infinite',
 * }
 */
