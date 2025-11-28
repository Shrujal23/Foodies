// src/components/dashboard/DashboardStats.js
import {
  BookOpenIcon,
  EyeIcon,
  HeartIcon,
  UserGroupIcon,
  StarIcon,
} from '@heroicons/react/24/outline';

const DashboardStats = ({ stats }) => {
  // Fallback data if no props passed (great for preview)
  const defaultStats = [
    { name: 'Total Recipes', value: '12', change: '+2 this week', type: 'positive' },
    { name: 'Recipe Views', value: '2.4k', change: '+20% this month', type: 'positive' },
    { name: 'Favorites', value: '48', change: '+12 this week', type: 'positive' },
    { name: 'Profile Views', value: '156', change: '+10% this month', type: 'positive' },
    { name: 'Average Rating', value: '4.8', change: '92 reviews', type: 'neutral' },
  ];

  const statsData = stats || defaultStats;

  const icons = {
    'Total Recipes': BookOpenIcon,
    'Recipe Views': EyeIcon,
    'Favorites': HeartIcon,
    'Profile Views': UserGroupIcon,
    'Average Rating': StarIcon,
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-12">
      {statsData.map((stat, index) => {
        const Icon = icons[stat.name];

        return (
          <div
            key={stat.name}
            className="group relative bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-3"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Animated gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-400/10 via-pink-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Main content */}
            <div className="relative p-8 flex items-center space-x-6">
              {/* Icon with gradient circle */}
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  <Icon className="w-8 h-8 text-white" aria-hidden="true" />
                </div>
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider truncate">
                  {stat.name}
                </p>

                <div className="mt-2 flex items-baseline">
                  <p className="text-4xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>

                <p
                  className={`mt-2 text-sm font-medium transition-colors duration-300 ${
                    stat.type === 'positive'
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {stat.change}
                </p>
              </div>
            </div>

            {/* Shine effect */}
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            
            {/* Subtle border glow */}
            <div className="absolute inset-0 rounded-3xl ring-1 ring-transparent group-hover:ring-orange-500/20 transition-all duration-500" />
          </div>
        );
      })}
    </div>
  );
};

export default DashboardStats;