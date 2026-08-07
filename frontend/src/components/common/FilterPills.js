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

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      {activeFilters.map(({ key, label }) => (
        <div
          key={key}
          className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-2 text-sm font-medium text-orange-700 dark:border-orange-800/60 dark:bg-orange-900/20 dark:text-orange-300"
        >
          <span>{label}</span>
          <button
            onClick={() => onRemoveFilter?.(key)}
            className="rounded-full p-0.5 transition-colors hover:bg-orange-100 dark:hover:bg-orange-900/60"
            title="Remove filter"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
      ))}

      {activeFilters.length > 0 && onClearAll && (
        <button
          onClick={onClearAll}
          className="rounded-full px-2 py-1 text-sm font-semibold text-gray-600 transition-colors hover:text-orange-600 dark:text-gray-400 dark:hover:text-orange-400"
        >
          Clear all
        </button>
      )}
    </div>
  );
}
