import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { API_BASE_URL, ASSET_BASE_URL } from '../config';
import RecipeCardEnhanced from '../components/recipes/RecipeCardEnhanced';
import toast from 'react-hot-toast';

const MyRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCuisine, setFilterCuisine] = useState('all');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [cuisines, setCuisines] = useState([]);

  const fetchRecipes = useCallback(async () => {
    try {
      setLoading(true);

      let url = `${API_BASE_URL}/recipes/user-recipes`;

      if (searchQuery.trim()) {
        const params = new URLSearchParams({
          query: searchQuery.trim(),
          limit: '50',
          source: 'all'
        });
        url = `${API_BASE_URL}/recipes/search?${params}`;
      }

      const res = await fetch(url);
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      
      let recipeList = [];

      if (data.success && data.data) {
        recipeList = Array.isArray(data.data) ? data.data : 
                    (Array.isArray(data.data.recipes) ? data.data.recipes : []);
      } else if (Array.isArray(data)) {
        recipeList = data;
      } else if (data.recipes && Array.isArray(data.recipes)) {
        recipeList = data.recipes;
      }

      processRecipes(recipeList);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      toast.error('Failed to load recipes. Please try again.');
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  const processRecipes = (recipeList) => {
    if (!Array.isArray(recipeList)) {
      console.warn('recipeList is not an array:', recipeList);
      setRecipes([]);
      return;
    }

    const processed = recipeList
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
        rating: recipe.rating || 4.2,
        created_at: recipe.created_at || recipe.createdAt,
      }));

    setRecipes(processed);

    const cuisineSet = new Set();
    processed.forEach(r => {
      if (r.cuisine) cuisineSet.add(r.cuisine.toLowerCase());
    });

    setCuisines(Array.from(cuisineSet).sort());
  };

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  const processedRecipes = useMemo(() => {
    let result = [...recipes];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(recipe =>
        recipe.title?.toLowerCase().includes(q) ||
        recipe.description?.toLowerCase().includes(q)
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

    if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    } else if (sortBy === 'rating') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === 'title') {
      result.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    }

    return result;
  }, [recipes, searchQuery, filterCuisine, filterDifficulty, sortBy]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500">Loading your recipes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
            My Recipes
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Discover and manage your collection
          </p>
        </div>

        <div className="mb-8">
          <div className="relative max-w-xl">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by recipe name, ingredients, or cuisine..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 border border-gray-300 dark:border-gray-600 rounded-2xl dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>

        <div className="mb-10 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Cuisine</label>
            <select
              value={filterCuisine}
              onChange={(e) => setFilterCuisine(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-2xl dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
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
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-2xl dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">All Levels</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-2xl dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="newest">Newest First</option>
              <option value="rating">Top Rated</option>
              <option value="title">A to Z</option>
            </select>
          </div>
        </div>

        <div className="mb-8 flex justify-between items-center">
          <p className="text-gray-600 dark:text-gray-400">
            Showing <span className="font-semibold text-gray-900 dark:text-white">{processedRecipes.length}</span> recipes
          </p>

          {(searchQuery || filterCuisine !== 'all' || filterDifficulty !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterCuisine('all');
                setFilterDifficulty('all');
              }}
              className="text-orange-600 hover:text-orange-700 font-medium text-sm"
            >
              Clear all filters
            </button>
          )}
        </div>

        {processedRecipes.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-6xl mb-6">😕</p>
            <p className="text-2xl text-gray-600 dark:text-gray-400">No recipes found</p>
            <p className="text-gray-500 mt-3">Try adjusting your search or filters</p>
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

export default MyRecipes;