import { XMarkIcon } from '@heroicons/react/24/outline';

/**
 * FilterPills component - shows active filters as removable pills
 * @param {object} filters - Object with filter names and values
 * @param {function} onRemoveFilter - Callback to remove a filter
 * @param {function} onClearAll - Callback to clear all filters
 * @param {string} className - Additional CSS classes
 */
export default function FilterPills({ 
  filters = {}, 
  onRemoveFilter, 
  onClearAll, 
  className = '' 
}) {
  // Get all active filters (non-empty, non-'all' values)
  const activeFilters = Object.entries(filters)
    .filter(([_, value]) => value && value !== 'all')
    .map(([key, value]) => ({
      key,
      label: formatFilterLabel(key, value),
      value
    }));

  if (activeFilters.length === 0) {
    return null;
  }

  const formatFilterLabel = (key, value) => {
    const labels = {
      diet: `Diet: ${value}`,
      health: `Health: ${value}`,
      cuisineType: `Cuisine: ${value}`,
      mealType: `Meal: ${value}`,
      cookingTime: `Time: ${value} min`,
      sortBy: `Sort: ${value}`
    };
    return labels[key] || value;
  };

  return (
    <div className={`flex flex-wrap gap-3 items-center ${className}`}>
      {/* Filter Pills */}
      {activeFilters.map(({ key, label }) => (
        <div
          key={key}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-100 to-pink-100 dark:from-orange-900/40 dark:to-pink-900/40 text-orange-700 dark:text-orange-300 rounded-full border border-orange-300 dark:border-orange-700/50 shadow-sm hover:shadow-md transition-shadow"
        >
          <span className="text-sm font-medium">{label}</span>
          <button
            onClick={() => onRemoveFilter?.(key)}
            className="p-0.5 hover:bg-orange-200 dark:hover:bg-orange-900/60 rounded-full transition-colors"
            title="Remove filter"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
      ))}

      {/* Clear All Button */}
      {activeFilters.length > 0 && onClearAll && (
        <button
          onClick={onClearAll}
          className="text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 px-2 py-1 transition-colors"
        >
          Clear all
        </button>
      )}
    </div>
  );
}
