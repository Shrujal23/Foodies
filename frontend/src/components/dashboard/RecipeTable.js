import { useState } from 'react';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

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
    name: 'Caesar Salad',
    category: 'Salads',
    views: 756,
    favorites: 45,
    rating: 4.5,
    date: '2023-09-13',
  },
  {
    id: 4,
    name: 'Chocolate Cake',
    category: 'Desserts',
    views: 2345,
    favorites: 167,
    rating: 4.9,
    date: '2023-09-12',
  },
  {
    id: 5,
    name: 'Sushi Roll',
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
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedRecipes = [...recipes].sort((a, b) => {
    if (sortDirection === 'asc') {
      return a[sortField] < b[sortField] ? -1 : 1;
    }
    return a[sortField] > b[sortField] ? -1 : 1;
  });

  const SortIcon = ({ field }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? (
      <ChevronUpIcon className="w-4 h-4" />
    ) : (
      <ChevronDownIcon className="w-4 h-4" />
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Your Recipes</h3>
        <p className="mt-1 text-sm text-gray-500">
          A list of all your recipes and their performance metrics.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center space-x-1">
                  <span>Recipe Name</span>
                  <SortIcon field="name" />
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('category')}
              >
                <div className="flex items-center space-x-1">
                  <span>Category</span>
                  <SortIcon field="category" />
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('views')}
              >
                <div className="flex items-center space-x-1">
                  <span>Views</span>
                  <SortIcon field="views" />
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('favorites')}
              >
                <div className="flex items-center space-x-1">
                  <span>Favorites</span>
                  <SortIcon field="favorites" />
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('rating')}
              >
                <div className="flex items-center space-x-1">
                  <span>Rating</span>
                  <SortIcon field="rating" />
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('date')}
              >
                <div className="flex items-center space-x-1">
                  <span>Date Added</span>
                  <SortIcon field="date" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedRecipes.map((recipe) => (
              <tr key={recipe.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{recipe.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{recipe.category}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{recipe.views}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{recipe.favorites}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{recipe.rating}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(recipe.date).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}