/**
 * Skeleton loader component that mimics the layout of content while it's loading
 * @param {string} type - Type: 'card', 'profileCard', 'line', 'paragraph'
 * @param {number} count - How many skeleton items to render
 * @param {string} className - Additional CSS classes
 */
export default function SkeletonLoader({ type = 'card', count = 3, className = '' }) {
  const baseClass = 'bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse';

  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className={`${className} bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-lg`}>
            {/* Image placeholder */}
            <div className={`${baseClass} w-full h-64`} />
            
            {/* Content placeholders */}
            <div className="p-6 space-y-4">
              <div className={`${baseClass} h-6 w-3/4`} />
              <div className={`${baseClass} h-4 w-full`} />
              <div className={`${baseClass} h-4 w-5/6`} />
              
              {/* Stats row */}
              <div className="flex gap-4 pt-4">
                <div className={`${baseClass} h-5 w-20`} />
                <div className={`${baseClass} h-5 w-20`} />
                <div className={`${baseClass} h-5 w-20`} />
              </div>
            </div>
          </div>
        );

      case 'profileCard':
        return (
          <div className={`${className} bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg space-y-4`}>
            <div className="flex items-center gap-4">
              <div className={`${baseClass} w-16 h-16 rounded-full`} />
              <div className="flex-1">
                <div className={`${baseClass} h-5 w-1/2 mb-2`} />
                <div className={`${baseClass} h-4 w-3/4`} />
              </div>
            </div>
            <div className={`${baseClass} h-4 w-full`} />
            <div className={`${baseClass} h-4 w-5/6`} />
          </div>
        );

      case 'line':
        return (
          <div className={`${baseClass} h-4 w-full ${className}`} />
        );

      case 'paragraph':
        return (
          <div className={`space-y-2 ${className}`}>
            <div className={`${baseClass} h-4 w-full`} />
            <div className={`${baseClass} h-4 w-full`} />
            <div className={`${baseClass} h-4 w-5/6`} />
          </div>
        );

      default:
        return <div className={`${baseClass} h-10 w-full`} />;
    }
  };

  return (
    <div className="space-y-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>
          {renderSkeleton()}
        </div>
      ))}
    </div>
  );
}
