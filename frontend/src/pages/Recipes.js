import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { API_BASE_URL, ASSET_BASE_URL } from '../config';
import RecipeCardEnhanced from '../components/recipes/RecipeCardEnhanced';
import toast from 'react-hot-toast';

const mealTypeOptions = [
  { value: 'all', label: 'All Meals' },
  { value: 'breakfast', label: 'Breakfast' },
  { value: 'brunch', label: 'Brunch' },
  { value: 'lunch', label: 'Lunch' },
  { value: 'high-tea', label: 'High Tea' },
  { value: 'dinner', label: 'Dinner' },
  { value: 'dessert', label: 'Dessert' },
  { value: 'snack', label: 'Snack' },
  { value: 'festival', label: 'Festival Special' },
];

const dishTypeOptions = [
  { value: 'all', label: 'All Dishes' },
  { value: 'Main Course', label: 'Main Course' },
  { value: 'Rice Bowl', label: 'Rice Bowl' },
  { value: 'Pulao', label: 'Pulao' },
  { value: 'Biryani', label: 'Biryani' },
  { value: 'Curry', label: 'Curry' },
  { value: 'Dal', label: 'Dal' },
  { value: 'Sabzi', label: 'Sabzi' },
  { value: 'Paratha', label: 'Paratha' },
  { value: 'Snacks', label: 'Snacks' },
  { value: 'Chaat', label: 'Chaat' },
  { value: 'Dessert', label: 'Dessert' },
  { value: 'Soup', label: 'Soup' },
  { value: 'Salad', label: 'Salad' },
  { value: 'Side Dish', label: 'Side Dish' },
];

const quickBrowseOptions = [
  { value: 'breakfast', label: 'Breakfast' },
  { value: 'lunch', label: 'Lunch' },
  { value: 'dinner', label: 'Dinner' },
  { value: 'dessert', label: 'Something sweet' },
];

const getCachedRecipes = () => {
  try {
    const cached = sessionStorage.getItem('foodiesRecipes');
    return cached ? JSON.parse(cached) : [];
  } catch {
    return [];
  }
};

const Recipes = () => {
  const [recipes, setRecipes] = useState(getCachedRecipes);
  const [loading, setLoading] = useState(() => getCachedRecipes().length === 0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCuisine, setFilterCuisine] = useState('all');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [filterMealType, setFilterMealType] = useState('all');
  const [filterDishType, setFilterDishType] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [cuisines, setCuisines] = useState([]);

  const processRecipes = useCallback((recipeList) => {
    if (!Array.isArray(recipeList)) {
      console.warn('recipeList is not an array:', recipeList);
      return [];
    }

    return recipeList
      .filter(recipe => recipe && (recipe.title || recipe.label))
      .map(recipe => ({
        ...recipe,
        id: recipe._id || recipe.id || recipe.uri || `recipe-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        source: recipe._id || recipe.id ? 'user' : 'api',
        image: recipe.image && !recipe.image.startsWith('http') 
          ? `${ASSET_BASE_URL}${recipe.image}` 
          : recipe.image || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800&q=80',
        title: recipe.title || recipe.label || 'Untitled Recipe',
        prepTime: recipe.prepTime || recipe.prep_time || recipe.totalTime,
        cookTime: recipe.cookTime || recipe.cook_time,
        cuisine: recipe.cuisine || (Array.isArray(recipe.cuisineType) ? recipe.cuisineType[0] : 'international'),
        difficulty: recipe.difficulty || 'Medium',
        mealType: recipe.mealType || recipe.meal_type || '',
        dishType: recipe.dishType || recipe.dish_type || '',
        rating: recipe.avg_rating || recipe.rating || null, // Use real avg_rating from backend
        created_at: recipe.created_at || recipe.createdAt,
      }));
  }, []);

  const fetchRecipes = useCallback(async () => {
    try {
      const allRecipesRes = await fetch(`${API_BASE_URL}/recipes`);

      if (!allRecipesRes.ok) {
        throw new Error(`HTTP error! status: ${allRecipesRes.status} for all recipes`);
      }
      
      const allRecipesData = await allRecipesRes.json();

      const allProcessed = processRecipes(allRecipesData);
      setRecipes(allProcessed);
      sessionStorage.setItem('foodiesRecipes', JSON.stringify(allProcessed));

      const cuisineSet = new Set();
      allProcessed.forEach(r => {
        if (r.cuisine) cuisineSet.add(r.cuisine.toLowerCase());
      });
      setCuisines(Array.from(cuisineSet).sort());

    } catch (error) {
      console.error('Error fetching recipes:', error);
      toast.error('Failed to load recipes. Please try again.');
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  }, [processRecipes]);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  const activeFilterCount = [filterCuisine, filterDifficulty, filterMealType, filterDishType, sortBy]
    .filter(value => value && value !== 'all' && value !== 'newest').length;

  const clearFilters = () => {
    setSearchQuery('');
    setFilterCuisine('all');
    setFilterDifficulty('all');
    setFilterMealType('all');
    setFilterDishType('all');
    setSortBy('newest');
  };

  const processedRecipes = useMemo(() => {
    let result = [...recipes];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(recipe =>
        recipe.title?.toLowerCase().includes(q) ||
        recipe.description?.toLowerCase().includes(q) ||
        recipe.cuisine?.toLowerCase().includes(q) ||
        recipe.mealType?.toLowerCase().includes(q) ||
        recipe.dishType?.toLowerCase().includes(q)
      );
    }

    if (filterCuisine !== 'all') {
      result = result.filter(recipe => 
        recipe.cuisine?.toLowerCase() === filterCuisine.toLowerCase()
      );
    }

    if (filterDifficulty !== 'all') {
      result = result.filter(recipe => 
        recipe.difficulty?.toLowerCase() === filterDifficulty.toLowerCase()
      );
    }

    if (filterMealType !== 'all') {
      result = result.filter(recipe => 
        recipe.mealType?.toLowerCase() === filterMealType.toLowerCase()
      );
    }

    if (filterDishType !== 'all') {
      result = result.filter(recipe => 
        recipe.dishType?.toLowerCase() === filterDishType.toLowerCase()
      );
    }

    if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    } else if (sortBy === 'rating') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === 'title') {
      result.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    }

    return result;
  }, [recipes, searchQuery, filterCuisine, filterDifficulty, filterMealType, filterDishType, sortBy]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500">Loading recipes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffaf7] py-8 dark:bg-gray-950 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="mb-8 border-b border-[#eadbd1] pb-8 dark:border-gray-800 sm:mb-10 sm:pb-10">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-orange-700 dark:text-orange-300">
            From the Foodies kitchen
          </p>
          <h1 className="max-w-3xl text-4xl font-bold leading-tight text-[#35221a] dark:text-white sm:text-5xl">
            Recipes worth making again.
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-[#7f665a] dark:text-gray-400 sm:text-lg">
            Browse dishes shared by our community, or follow your appetite and see where it takes you.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="mr-1 text-sm text-[#8f7568] dark:text-gray-500">I&apos;m looking for</span>
            {quickBrowseOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setFilterMealType(option.value)}
                className={`rounded-full border px-3 py-1.5 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-orange-400/40 ${
                  filterMealType === option.value
                    ? 'border-orange-600 bg-orange-600 text-white'
                    : 'border-[#e7d4c7] bg-white text-[#765648] hover:border-orange-400 hover:bg-orange-50 hover:text-orange-800 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-orange-600 dark:hover:bg-orange-950/30 dark:hover:text-orange-300'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="group relative flex-1">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              aria-label="Search community recipes"
              placeholder="Search by dish, cuisine, or meal type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-[#ddc9bc] bg-white py-3.5 pl-12 pr-4 text-gray-900 shadow-[0_8px_24px_rgba(53,34,26,0.06)] transition placeholder:text-[#a58d80] hover:border-[#cdb2a3] focus:border-orange-400 focus:outline-none focus:ring-4 focus:ring-orange-400/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowFilters(prev => !prev)}
              className="flex items-center gap-2 rounded-xl border border-[#ddc9bc] bg-white px-4 py-3 text-sm font-semibold text-[#765648] shadow-sm transition hover:border-orange-400 hover:text-orange-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
            >
              <FunnelIcon className="h-5 w-5" />
              Filters
              {activeFilterCount > 0 && (
                <span className="rounded-full bg-orange-500 px-2 py-0.5 text-xs font-bold text-white">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {(searchQuery || filterCuisine !== 'all' || filterDifficulty !== 'all' || filterMealType !== 'all' || filterDishType !== 'all' || sortBy !== 'newest') && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-sm font-semibold text-orange-600 hover:text-orange-700"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {showFilters && (
          <div className="mb-8 border-y border-[#eadbd1] bg-white/60 px-1 py-6 dark:border-gray-800 dark:bg-gray-900/40 sm:px-2">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Cuisine</label>
                <select
                  value={filterCuisine}
                  onChange={(e) => setFilterCuisine(e.target.value)}
                  className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="all">All Cuisines</option>
                  {cuisines.map(cuisine => (
                    <option key={cuisine} value={cuisine}>
                      {cuisine.charAt(0).toUpperCase() + cuisine.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Difficulty</label>
                <select
                  value={filterDifficulty}
                  onChange={(e) => setFilterDifficulty(e.target.value)}
                  className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="all">All Levels</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Meal Type</label>
                <select
                  value={filterMealType}
                  onChange={(e) => setFilterMealType(e.target.value)}
                  className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="all">All Meals</option>
                  {mealTypeOptions.filter(option => option.value !== 'all').map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Dish Type</label>
                <select
                  value={filterDishType}
                  onChange={(e) => setFilterDishType(e.target.value)}
                  className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="all">All Dishes</option>
                  {dishTypeOptions.filter(option => option.value !== 'all').map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="newest">Newest First</option>
                  <option value="rating">Top Rated</option>
                  <option value="title">A to Z</option>
                </select>
              </div>
            </div>
          </div>
        )}

        <div className="mb-8 flex flex-col gap-3 border-b border-[#eadbd1] pb-5 dark:border-gray-800 sm:flex-row sm:items-end sm:justify-between">
          <p className="text-sm text-[#8f7568] dark:text-gray-400">
            Showing <span className="font-semibold text-[#35221a] dark:text-white">{processedRecipes.length}</span> of {recipes.length} recipes
          </p>

          {(searchQuery || filterCuisine !== 'all' || filterDifficulty !== 'all' || filterMealType !== 'all' || filterDishType !== 'all' || sortBy !== 'newest') && (
            <button
              onClick={clearFilters}
              className="text-orange-600 hover:text-orange-700 font-medium text-sm"
            >
              Clear all filters
            </button>
          )}
        </div>

        {processedRecipes.length === 0 ? (
          <div className="border border-[#eadbd1] bg-white px-6 py-16 text-center dark:border-gray-800 dark:bg-gray-900">
            <p className="text-3xl" aria-hidden="true">🍽️</p>
            <p className="mt-5 text-2xl font-semibold text-[#35221a] dark:text-white">Nothing matches this search yet.</p>
            <p className="mx-auto mt-3 max-w-md text-[#8f7568] dark:text-gray-400">Try a broader ingredient, or clear a filter and see what the community has been cooking.</p>
            <button
              type="button"
              onClick={clearFilters}
              className="mt-6 rounded-lg bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:ring-offset-2"
            >
              Show all recipes
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {processedRecipes.map(recipe => (
              <RecipeCardEnhanced
                key={recipe.id}
                recipe={recipe}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Recipes;