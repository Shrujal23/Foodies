// src/components/admin/RecipeTable.js
import { useState } from 'react';
import { 
  ChevronUpIcon, 
  ChevronDownIcon,
  EyeIcon,
  HeartIcon,
  StarIcon,
  CalendarIcon,
  TagIcon,
  TrendingUpIcon
} from '@heroicons/react/24/outline';

const recipes = [
  {
    id: 1,
    name: 'Classic Margherita Pizza',
    category: 'Italian',
    views: 1234,
    favorites: 89,
    rating: 4.8,
    date: '2023-09-15',
  },
  {
    id: 2,
    name: 'Chicken Tikka Masala',
    category: 'Indian',
    views: 987,
    favorites: 76,
    rating: 4.9,
    date: '2023-09-14',
  },
  {
    id: 3,
    name: 'Caesar Salad Supreme',
    category: 'Salads',
    views: 756,
    favorites: 45,
    rating: 4.5,
    date: '2023-09-13',
  },
  {
    id: 4,
    name: 'Triple Chocolate Cake',
    category: 'Desserts',
    views: 2345,
    favorites: 167,
    rating: 4.9,
    date: '2023-09-12',
  },
  {
    id: 5,
    name: 'Rainbow Sushi Roll',
    category: 'Japanese',
    views: 876,
    favorites: 67,
    rating: 4.7,
    date: '2023-09-11',
  },
];

export default function RecipeTable() {
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedRecipes = [...recipes].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (sortDirection === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    }
    return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
  });

  const SortIndicator = ({ field }) => {
    if (sortField !== field) return <div className="w-4 h-4" />;
    
    return (
      <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
        sortDirection === 'asc' 
          ? 'bg-gradient-to-br from-orange-500 to-pink-600 text-white shadow-lg shadow-orange-500/50' 
          : 'bg-gradient-to-br from-pink-600 to-orange-500 text-white shadow-lg shadow-pink-500/50'
      }`}>
        {sortDirection === 'asc' ? (
          <ChevronUpIcon className="w-4 h-4" />
        ) : (
          <ChevronDownIcon className="w-4 h-4" />
        )}
      </div>
    );
  };

  const getIcon = (field) => {
    switch (field) {
      case 'name': return null;
      case 'category': return <TagIcon className="w-5 h-5" />;
      case 'views': return <EyeIcon className="w-5 h-5" />;
      case 'favorites': return <HeartIcon className="w-5 h-5" />;
      case 'rating': return <StarIcon className="w-5 h-5" />;
      case 'date': return <CalendarIcon className="w-5 h-5" />;
      default: return null;
    }
  };

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20">
      {/* Header */}
      <div className="px-8 py-6 bg-gradient-to-r from-orange-500/10 to-pink-600/10 border-b border-gray-200/50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <TrendingUpIcon className="w-8 h-8 text-orange-600" />
              Your Recipe Performance
            </h3>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              Track views, favorites, and ratings across all your creations
            </p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-gray-900 dark:text-white">{recipes.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Recipes</div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-200 dark:border-gray-700">
              {[
                { field: 'name', label: 'Recipe Name' },
                { field: 'category', label: 'Category' },
                { field: 'views', label: 'Views' },
                { field: 'favorites', label: 'Favorites' },
                { field: 'rating', label: 'Rating' },
                { field: 'date', label: 'Added' },
              ].map(({ field, label }) => (
                <th
                  key={field}
                  onClick={() => handleSort(field)}
                  className="px-8 py-6 text-left cursor-pointer group hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    {getIcon(field) && (
                      <div className={`p-3 rounded-xl transition-all duration-300 group-hover:scale-110 ${
                        sortField === field 
                          ? 'bg-gradient-to-br from-orange-500 to-pink-600 text-white shadow-lg' 
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                      }`}>
                        {getIcon(field)}
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        {label}
                      </div>
                    </div>
                    <SortIndicator field={field} />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {sortedRecipes.map((recipe, index) => (
              <tr
                key={recipe.id}
                className="hover:bg-gradient-to-r hover:from-orange-50/50 hover:to-pink-50/50 dark:hover:from-orange-900/20 dark:hover:to-pink-900/20 transition-all duration-500 group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <td className="px-8 py-8">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-pink-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                      {recipe.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition">
                        {recipe.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Recipe #{recipe.id}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-8">
                  <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg">
                    <TagIcon className="w-4 h-4" />
                    {recipe.category}
                  </span>
                </td>
                <td className="px-8 py-8">
                  <div className="flex items-center gap-3">
                    <EyeIcon className="w-6 h-6 text-blue-600" />
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {recipe.views.toLocaleString()}
                    </span>
                  </div>
                </td>
                <td className="px-8 py-8">
                  <div className="flex items-center gap-3">
                    <HeartIcon className="w-6 h-6 text-rose-600" />
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {recipe.favorites}
                    </span>
                  </div>
                </td>
                <td className="px-8 py-8">
                  <div className="flex items-center gap-3">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`w-6 h-6 ${
                            i < Math.floor(recipe.rating)
                              ? 'text-yellow-500'
                              : i < recipe.rating
                              ? 'text-yellow-500'
                              : 'text-gray-300 dark:text-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {recipe.rating}
                    </span>
                  </div>
                </td>
                <td className="px-8 py-8">
                  <div className="flex items-center gap-3">
                    <CalendarIcon className="w-6 h-6 text-emerald-600" />
                    <span className="text-lg font-medium text-gray-700 dark:text-gray-300">
                      {new Date(recipe.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Summary */}
      <div className="px-8 py-6 bg-gradient-to-r from-orange-500/5 to-pink-600/5 border-t border-gray-200/50">
        <div className="flex items-center justify-between text-sm">
          <div className="text-gray-600 dark:text-gray-400">
            Showing all {recipes.length} recipes • Sorted by{' '}
            <span className="font-bold text-orange-600">
              {sortField === 'date' ? 'Date Added' : sortField.charAt(0).toUpperCase() + sortField.slice(1)}
            </span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-gradient-to-br from-orange-500 to-pink-600 rounded-full" />
              <span className="font-medium">Active Sort</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}