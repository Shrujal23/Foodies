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
    dishType: ''
  });

  const activeFilterCount = Object.entries(filters).filter(([key, value]) => {
    if (key === 'sortBy' && value === 'relevance') return false;
    return Boolean(value);
  }).length;

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
      dishType: ''
    });
  };

  return (
    <div className="mx-auto w-full max-w-5xl">
      <form onSubmit={handleSubmit}>
        <Disclosure as="div">
          {({ open }) => (
            <>
              <div className="relative">
                <div className="group rounded-2xl border border-[#ddc9bc] bg-white p-2 shadow-[0_8px_24px_rgba(53,34,26,0.07)] transition hover:border-[#cdb2a3] focus-within:border-orange-400 focus-within:ring-4 focus-within:ring-orange-400/10 dark:border-gray-700 dark:bg-gray-900">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                      <div className="flex min-h-[48px] flex-1 items-center gap-3 rounded-xl px-3 transition dark:bg-gray-900/70">
                        <MagnifyingGlassIcon className="h-6 w-6 shrink-0 text-orange-500 sm:h-7 sm:w-7" />
                        <input
                          type="text"
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                          placeholder="Search recipes, ingredients, cuisines..."
                          aria-label="Search recipes"
                          className="w-full bg-transparent text-base text-gray-900 placeholder-gray-500 focus:outline-none dark:text-white sm:text-lg"
                        />
                      </div>

                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <Disclosure.Button
                          className={`flex min-h-[46px] items-center justify-center gap-2 rounded-2xl px-4 py-3 font-semibold transition-all duration-300 ${
                            open || activeFilterCount > 0
                              ? 'bg-orange-600 text-white shadow-sm'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                          }`}
                        >
                          <FunnelIcon className="h-5 w-5" />
                          Filters
                          {activeFilterCount > 0 && (
                            <span className="rounded-full bg-white/30 px-2 py-0.5 text-xs font-bold">
                              {activeFilterCount}
                            </span>
                          )}
                        </Disclosure.Button>

                        <button
                          type="submit"
                          className="min-h-[46px] whitespace-nowrap rounded-xl bg-orange-600 px-5 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:ring-offset-2"
                        >
                          Search
                        </button>
                      </div>
                    </div>
                </div>
              </div>

              <Transition
                show={open}
                enter="transition duration-300 ease-out"
                enterFrom="opacity-0 -translate-y-4"
                enterTo="opacity-100 translate-y-0"
                leave="transition duration-200 ease-in"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 -translate-y-4"
              >
                <Disclosure.Panel className="mt-4 rounded-[1.2rem] border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-8">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                    <div>
                      <label className="mb-3 block text-sm font-bold text-gray-700 dark:text-gray-300">
                        Diet
                      </label>
                      <select
                        value={filters.diet}
                        onChange={(e) => handleFilterChange('diet', e.target.value)}
                        className="w-full rounded-2xl border border-gray-300 bg-gray-50 px-5 py-4 text-gray-900 transition focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
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

                    <div>
                      <label className="mb-3 block text-sm font-bold text-gray-700 dark:text-gray-300">
                        Health
                      </label>
                      <select
                        value={filters.health}
                        onChange={(e) => handleFilterChange('health', e.target.value)}
                        className="w-full rounded-2xl border border-gray-300 bg-gray-50 px-5 py-4 text-gray-900 transition focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
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

                    <div>
                      <label className="mb-3 block text-sm font-bold text-gray-700 dark:text-gray-300">
                        Cuisine
                      </label>
                      <select
                        value={filters.cuisineType}
                        onChange={(e) => handleFilterChange('cuisineType', e.target.value)}
                        className="w-full rounded-2xl border border-gray-300 bg-gray-50 px-5 py-4 text-gray-900 transition focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
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

                    <div>
                      <label className="mb-3 block text-sm font-bold text-gray-700 dark:text-gray-300">
                        Meal Type
                      </label>
                      <select
                        value={filters.mealType}
                        onChange={(e) => handleFilterChange('mealType', e.target.value)}
                        className="w-full rounded-2xl border border-gray-300 bg-gray-50 px-5 py-4 text-gray-900 transition focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                      >
                        <option value="">Any Meal</option>
                        <option value="breakfast">Breakfast</option>
                        <option value="brunch">Brunch</option>
                        <option value="lunch">Lunch</option>
                        <option value="high-tea">High Tea</option>
                        <option value="dinner">Dinner</option>
                        <option value="dessert">Dessert</option>
                        <option value="snack">Snack</option>
                        <option value="festival">Festival Special</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-3 block text-sm font-bold text-gray-700 dark:text-gray-300">
                        Dish Type
                      </label>
                      <select
                        value={filters.dishType}
                        onChange={(e) => handleFilterChange('dishType', e.target.value)}
                        className="w-full rounded-2xl border border-gray-300 bg-gray-50 px-5 py-4 text-gray-900 transition focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                      >
                        <option value="">Any Dish</option>
                        <option value="Main Course">Main Course</option>
                        <option value="Rice Bowl">Rice Bowl</option>
                        <option value="Pulao">Pulao</option>
                        <option value="Biryani">Biryani</option>
                        <option value="Curry">Curry</option>
                        <option value="Dal">Dal</option>
                        <option value="Sabzi">Sabzi</option>
                        <option value="Paratha">Paratha</option>
                        <option value="Snacks">Snacks</option>
                        <option value="Chaat">Chaat</option>
                        <option value="Dessert">Dessert</option>
                        <option value="Soup">Soup</option>
                        <option value="Salad">Salad</option>
                        <option value="Side Dish">Side Dish</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end">
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="flex items-center gap-2 rounded-xl px-6 py-3 font-medium text-red-600 transition hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/20"
                    >
                      <XMarkIcon className="h-5 w-5" />
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