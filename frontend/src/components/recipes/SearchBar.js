import { useState } from 'react';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { Disclosure } from '@headlessui/react';

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({
    diet: '',
    health: '',
    cuisineType: '',
    mealType: '',
    dishType: '',
    cookingTime: '',
    difficulty: '',
    sortBy: 'relevance'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch({ query, filters });
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      diet: '',
      health: '',
      cuisineType: '',
      mealType: '',
      dishType: '',
      cookingTime: '',
      difficulty: '',
      sortBy: 'relevance'
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative group">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for recipes..."
            className="w-full py-4 px-5 pl-14 pr-36 text-gray-900 placeholder-gray-500 bg-white border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition duration-150 ease-in-out"
          />
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
            <MagnifyingGlassIcon
              className="h-6 w-6 text-gray-400 group-focus-within:text-accent-500 transition-colors duration-150"
              aria-hidden="true"
            />
          </div>
          <button
            type="submit"
            className="absolute right-3 inset-y-2.5 bg-gradient-to-r from-accent-600 to-accent-700 text-white px-6 py-2 rounded-xl font-medium shadow-sm hover:from-accent-700 hover:to-accent-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500 transition duration-150 ease-in-out"
          >
            Search
          </button>
        </div>

        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button className="flex items-center justify-center w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg transition duration-150 ease-in-out">
                <FunnelIcon className="h-5 w-5 mr-2" />
                {open ? 'Hide Filters' : 'Show Filters'}
              </Disclosure.Button>
              <Disclosure.Panel className="mt-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Diet</label>
                    <select
                      value={filters.diet}
                      onChange={(e) => handleFilterChange('diet', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-accent-500 focus:border-accent-500"
                    >
                      <option value="">Any</option>
                      <option value="balanced">Balanced</option>
                      <option value="high-fiber">High Fiber</option>
                      <option value="high-protein">High Protein</option>
                      <option value="low-carb">Low Carb</option>
                      <option value="low-fat">Low Fat</option>
                      <option value="low-sodium">Low Sodium</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Health</label>
                    <select
                      value={filters.health}
                      onChange={(e) => handleFilterChange('health', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-accent-500 focus:border-accent-500"
                    >
                      <option value="">Any</option>
                      <option value="vegan">Vegan</option>
                      <option value="vegetarian">Vegetarian</option>
                      <option value="gluten-free">Gluten Free</option>
                      <option value="dairy-free">Dairy Free</option>
                      <option value="keto-friendly">Keto Friendly</option>
                      <option value="paleo">Paleo</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cuisine Type</label>
                    <select
                      value={filters.cuisineType}
                      onChange={(e) => handleFilterChange('cuisineType', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-accent-500 focus:border-accent-500"
                    >
                      <option value="">Any</option>
                      <option value="american">American</option>
                      <option value="asian">Asian</option>
                      <option value="chinese">Chinese</option>
                      <option value="french">French</option>
                      <option value="indian">Indian</option>
                      <option value="italian">Italian</option>
                      <option value="japanese">Japanese</option>
                      <option value="mediterranean">Mediterranean</option>
                      <option value="mexican">Mexican</option>
                      <option value="middle eastern">Middle Eastern</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Meal Type</label>
                    <select
                      value={filters.mealType}
                      onChange={(e) => handleFilterChange('mealType', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-accent-500 focus:border-accent-500"
                    >
                      <option value="">Any</option>
                      <option value="breakfast">Breakfast</option>
                      <option value="lunch">Lunch</option>
                      <option value="dinner">Dinner</option>
                      <option value="snack">Snack</option>
                      <option value="teatime">Teatime</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cooking Time</label>
                    <select
                      value={filters.cookingTime}
                      onChange={(e) => handleFilterChange('cookingTime', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-accent-500 focus:border-accent-500"
                    >
                      <option value="">Any</option>
                      <option value="15">Under 15 min</option>
                      <option value="30">Under 30 min</option>
                      <option value="60">Under 1 hour</option>
                      <option value="120">Under 2 hours</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                    <select
                      value={filters.sortBy}
                      onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-accent-500 focus:border-accent-500"
                    >
                      <option value="relevance">Relevance</option>
                      <option value="time">Cooking Time</option>
                      <option value="calories">Calories</option>
                      <option value="rating">Rating</option>
                    </select>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition duration-150 ease-in-out"
                  >
                    Clear Filters
                  </button>
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </form>
    </div>
  );
}
