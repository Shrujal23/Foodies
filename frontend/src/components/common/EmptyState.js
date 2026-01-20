import { Link } from 'react-router-dom';

/**
 * Reusable EmptyState component for when there's no data
 * @param {string} icon - Icon emoji or icon component
 * @param {string} title - Main heading
 * @param {string} description - Subtext describing the empty state
 * @param {array} actions - Array of action objects: { label, to, onClick, primary }
 * @param {string} className - Additional CSS classes
 */
export default function EmptyState({ 
  icon = '📭', 
  title = 'Nothing here yet', 
  description = 'Start exploring to fill this space',
  actions = [],
  className = ''
}) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-6 ${className}`}>
      {/* Icon */}
      <div className="text-7xl mb-6 opacity-80 animate-bounce">
        {icon}
      </div>

      {/* Title */}
      <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-3 text-center">
        {title}
      </h3>

      {/* Description */}
      <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md text-center mb-10">
        {description}
      </p>

      {/* Action Buttons */}
      {actions.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-4">
          {actions.map((action, idx) => {
            const btnClass = `px-8 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${
              action.primary 
                ? 'bg-gradient-to-r from-orange-500 to-pink-600 text-white shadow-lg hover:shadow-xl' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
            }`;

            if (action.to) {
              return (
                <Link key={idx} to={action.to} className={btnClass}>
                  {action.label}
                </Link>
              );
            }

            return (
              <button 
                key={idx} 
                onClick={action.onClick} 
                className={btnClass}
              >
                {action.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
