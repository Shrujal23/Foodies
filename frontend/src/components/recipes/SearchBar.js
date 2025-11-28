// src/components/recipes/SearchBar.js
import { useState } from 'react';
import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Disclosure, Transition } from '@headlessui/react';

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({
    diet: '',
    health: '',
    cuisineType: '',
    mealType: '',
    cookingTime: '',
    sortBy: 'relevance',
  });

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  const handleSubmit = (e) => {
    e.preventDefault();
    const hasQuery = query.trim();
    const hasFilters = activeFilterCount > 0;

    if (hasQuery || hasFilters) {
      onSearch({ query: query.trim(), filters });
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      diet: '',
      health: '',
      cuisineType: '',
      mealType: '',
      cookingTime: '',
      sortBy: 'relevance',
    });
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-6">
      <form onSubmit={handleSubmit}>
        {/* SINGLE DISCLOSURE – THIS IS THE KEY */}
        <Disclosure as="div">
          {({ open }) => (
            <>
              {/* ====================== SEARCH BAR ====================== */}
              <div className="relative group">
                {/* Gradient glow background */}
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-pink-500 rounded-3xl blur-xl opacity-20 group-focus-within:opacity-40 transition-opacity duration-500" />

                <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search millions of delicious recipes..."
                    className="w-full py-6 pl-16 pr-48 text-xl text-gray-900 dark:text-white placeholder-gray-500 bg-transparent focus:outline-none"
                  />

                  {/* Search Icon */}
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="w-8 h-8 text-orange-500" />
                  </div>

                  {/* Right-side buttons */}
                  <div className="absolute inset-y-0 right-0 flex items-center gap-3 pr-6">
                    {/* FILTER BUTTON – CONTROLS THE PANEL BELOW */}
                    <Disclosure.Button
                      className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 shadow-md ${
                        open || activeFilterCount > 0
                          ? 'bg-gradient-to-r from-orange-500 to-pink-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      <FunnelIcon className="w-5 h-5" />
                      Filters
                      {activeFilterCount > 0 && (
                        <span className="ml-2 px-2 py-0.5 bg-white/30 rounded-full text-xs font-bold">
                          {activeFilterCount}
                        </span>
                      )}
                    </Disclosure.Button>

                    {/* SEARCH BUTTON */}
                    <button
                      type="submit"
                      className="px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-bold text-lg rounded-2xl hover:from-orange-600 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-xl"
                    >
                      Search
                    </button>
                  </div>
                </div>
              </div>

              {/* ====================== FILTERS PANEL ====================== */}
              <Transition
                show={open}
                enter="transition duration-300 ease-out"
                enterFrom="opacity-0 -translate-y-4"
                enterTo="opacity-100 translate-y-0"
                leave="transition duration-200 ease-in"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 -translate-y-4"
              >
                <Disclosure.Panel className="mt-8 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {/* Diet */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                        Diet
                      </label>
                      <select
                        value={filters.diet}
                        onChange={(e) => handleFilterChange('diet', e.target.value)}
                        className="w-full px-5 py-4 rounded-2xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition"
                      >
                        <option value="">Any Diet</option>
                        <option value="balanced">Balanced</option>
                        <option value="high-fiber">High-Fiber</option>
                        <option value="high-protein">High-Protein</option>
                        <option value="low-carb">Low-Carb</option>
                        <option value="low-fat">Low-Fat</option>
                        <option value="low-sodium">Low-Sodium</option>
                      </select>
                    </div>

                    {/* Health */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                        Health
                      </label>
                      <select
                        value={filters.health}
                        onChange={(e) => handleFilterChange('health', e.target.value)}
                        className="w-full px-5 py-4 rounded-2xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition"
                      >
                        <option value="">Any Health</option>
                        <option value="vegan">Vegan</option>
                        <option value="vegetarian">Vegetarian</option>
                        <option value="gluten-free">Gluten-Free</option>
                        <option value="dairy-free">Dairy-Free</option>
                        <option value="keto-friendly">Keto</option>
                        <option value="paleo">Paleo</option>
                      </select>
                    </div>

                    {/* Cuisine Type */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                        Cuisine
                      </label>
                      <select
                        value={filters.cuisineType}
                        onChange={(e) => handleFilterChange('cuisineType', e.target.value)}
                        className="w-full px-5 py-4 rounded-2xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition"
                      >
                        <option value="">Any Cuisine</option>
                        <option value="american">American</option>
                        <option value="asian">Asian</option>
                        <option value="chinese">Chinese</option>
                        <option value="french">French</option>
                        <option value="indian">Indian</option>
                        <option value="italian">Italian</option>
                        <option value="japanese">Japanese</option>
                        <option value="mexican">Mexican</option>
                      </select>
                    </div>

                    {/* Meal Type */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                        Meal Type
                      </label>
                      <select
                        value={filters.mealType}
                        onChange={(e) => handleFilterChange('mealType', e.target.value)}
                        className="w-full px-5 py-4 rounded-2xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition"
                      >
                        <option value="">Any Meal</option>
                        <option value="breakfast">Breakfast</option>
                        <option value="lunch">Lunch</option>
                        <option value="dinner">Dinner</option>
                        <option value="snack">Snack</option>
                      </select>
                    </div>

                    {/* Cooking Time */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                        Max Cooking Time
                      </label>
                      <select
                        value={filters.cookingTime}
                        onChange={(e) => handleFilterChange('cookingTime', e.target.value)}
                        className="w-full px-5 py-4 rounded-2xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition"
                      >
                        <option value="">Any Time</option>
                        <option value="15">Under 15 min</option>
                        <option value="30">Under 30 min</option>
                        <option value="60">Under 1 hour</option>
                        <option value="120">Under 2 hours</option>
                      </select>
                    </div>

                    {/* Sort By */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                        Sort By
                      </label>
                      <select
                        value={filters.sortBy}
                        onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                        className="w-full px-5 py-4 rounded-2xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition"
                      >
                        <option value="relevance">Relevance</option>
                        <option value="time">Fastest First</option>
                        <option value="calories">Lowest Calories</option>
                        <option value="rating">Highest Rated</option>
                      </select>
                    </div>
                  </div>

                  {/* Clear Filters */}
                  <div className="mt-8 flex justify-end">
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="flex items-center gap-2 px-6 py-3 text-red-600 hover:text-red-700 font-medium hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition"
                    >
                      <XMarkIcon className="w-5 h-5" />
                      Clear All Filters
                    </button>
                  </div>
                </Disclosure.Panel>
              </Transition>
            </>
          )}
        </Disclosure>
      </form>
    </div>
  );
}