import {
  BookOpenIcon,
  EyeIcon,
  HeartIcon,
  UserGroupIcon,
  StarIcon
} from '@heroicons/react/24/outline';

const stats = [
  { name: 'Total Recipes', value: '12', icon: BookOpenIcon, change: '+2 this week' },
  { name: 'Recipe Views', value: '2.4k', icon: EyeIcon, change: '+20% this month' },
  { name: 'Favorites', value: '48', icon: HeartIcon, change: '+12 this week' },
  { name: 'Profile Views', value: '156', icon: UserGroupIcon, change: '+10% this month' },
  { name: 'Average Rating', value: '4.8', icon: StarIcon, change: '92 reviews' },
];

export default function DashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
      {stats.map((stat) => (
        <div
          key={stat.name}
          className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <stat.icon className="h-6 w-6 text-accent-600" aria-hidden="true" />
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-500">{stat.name}</div>
              <div className="mt-1">
                <div className="text-2xl font-semibold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.change}</div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}