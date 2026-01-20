import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { API_BASE_URL, ASSET_BASE_URL } from '../config';
import RecipeCardEnhanced from '../components/recipes/RecipeCardEnhanced';
import toast from 'react-hot-toast';

const MyRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCuisine, setFilterCuisine] = useState('all');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [cuisines, setCuisines] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);

  useEffect(() => {
    fetchAllRecipes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        fetchAllRecipes();
      }
    }, 500);
    
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    applyFiltersAndSort();
  }, [recipes, searchQuery, filterCuisine, filterDifficulty, sortBy]);

  const fetchAllRecipes = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching recipes - Search query:', searchQuery);
      
      // If search query exists, use the backend search endpoint
      if (searchQuery.trim()) {
        try {
          const params = new URLSearchParams({
            query: searchQuery,
            page: 1,
            limit: 50,
            source: 'all'
          });
          
          console.log('🔍 Searching:', `${API_BASE_URL}/recipes/search?${params}`);
          const res = await fetch(`${API_BASE_URL}/recipes/search?${params}`);
          
          if (res.ok) {
            const response = await res.json();
            console.log('✅ Search response:', response);
            
            // Handle both formats: direct data object or wrapped in 'data' property
            const responseData = response.data || response;
            const userRecipes = Array.isArray(responseData.userRecipes) ? responseData.userRecipes : [];
            const edamamRecipes = Array.isArray(responseData.edamamRecipes) ? responseData.edamamRecipes : [];
            const allRecipes = [...userRecipes, ...edamamRecipes];
            
            console.log('📊 User recipes:', userRecipes.length, 'Edamam recipes:', edamamRecipes.length);
            
            if (allRecipes.length > 0) {
              processRecipes(allRecipes);
              return;
            }
          } else {
            console.warn('⚠️ Search returned status:', res.status);
          }
        } catch (searchError) {
          console.error('❌ Search error:', searchError);
        }
      }
      
      // Load default: user recipes + popular from Edamam
      try {
        console.log('📥 Loading user recipes...');
        const userRes = await fetch(`${API_BASE_URL}/recipes/user-recipes`);
        const userData = userRes.ok ? await userRes.json() : [];
        console.log('👤 User recipes loaded:', Array.isArray(userData) ? userData.length : 0);
        
        // If we have user recipes, show them
        if (Array.isArray(userData) && userData.length > 0) {
          console.log('✅ Using user recipes');
          processRecipes(userData);
          return;
        }
        
        // If no user recipes, try to get popular recipes
        try {
          console.log('🌟 Loading popular recipes...');
          const apiRes = await fetch(`${API_BASE_URL}/recipes/search?query=popular&limit=20&source=all`);
          
          if (apiRes.ok) {
            const response = await apiRes.json();
            console.log('✅ Popular response:', response);
            
            // Handle both formats: direct data object or wrapped in 'data' property
            const responseData = response.data || response;
            const userRecipes = Array.isArray(responseData.userRecipes) ? responseData.userRecipes : [];
            const edamamRecipes = Array.isArray(responseData.edamamRecipes) ? responseData.edamamRecipes : [];
            const allRecipes = [...userRecipes, ...edamamRecipes];
            
            console.log('📊 Popular recipes found - User:', userRecipes.length, 'Edamam:', edamamRecipes.length);
            
            if (allRecipes.length > 0) {
              console.log('✅ Using popular recipes');
              processRecipes(allRecipes);
            } else {
              // No recipes found at all
              console.warn('⚠️ No recipes available from any source');
              setRecipes([]);
              setFilteredRecipes([]);
              setCuisines([]);
              toast.error('No recipes available at the moment');
            }
          } else {
            throw new Error(`API returned status ${apiRes.status}`);
          }
        } catch (apiError) {
          console.error('❌ Popular recipes fetch error:', apiError);
          // Show user recipes if we have them, even if popular search fails
          if (userData.length > 0) {
            console.log('✅ Using user recipes as fallback');
            processRecipes(userData);
          } else {
            setRecipes([]);
            setFilteredRecipes([]);
            setCuisines([]);
            toast.error('Failed to load recipes. Please try again.');
          }
        }
      } catch (error) {
        console.error('❌ Failed to fetch recipes:', error);
        toast.error('Failed to load recipes. Please try again.');
        setRecipes([]);
        setFilteredRecipes([]);
        setCuisines([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const processRecipes = (recipeList) => {
    const processed = (Array.isArray(recipeList) ? recipeList : [])
      .filter(recipe => recipe && recipe.title) // Filter out invalid recipes
      .map(recipe => {
        // Handle both user recipes and Edamam API recipes
        const isUserRecipe = recipe._id || (!recipe.uri && recipe.id);
        
        return {
          ...recipe,
          id: recipe._id || recipe.id || recipe.uri || Math.random().toString(36).substr(2, 9),
          source: isUserRecipe ? 'user' : 'api',
          image: recipe.image && !recipe.image.startsWith('http')
            ? `${ASSET_BASE_URL}${recipe.image}`
            : recipe.image || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800&q=80',
          title: recipe.title || recipe.label || 'Unknown Recipe',
          prepTime: recipe.prepTime || recipe.totalTime,
          cuisine: recipe.cuisine || recipe.cuisineType?.[0] || recipe.cuisineType || 'international',
          difficulty: recipe.difficulty || 'Medium',
          rating: recipe.rating || 0,
          description: recipe.description || recipe.source || recipe.label || '',
        };
      });

    setRecipes(processed);

    // Extract unique cuisines - handle both string and array cuisines
    const cuisineSet = new Set();
    processed.forEach(r => {
      const cuisine = r.cuisine;
      if (cuisine) {
        if (Array.isArray(cuisine)) {
          cuisine.forEach(c => cuisineSet.add(c.toLowerCase()));
        } else if (typeof cuisine === 'string') {
          cuisineSet.add(cuisine.toLowerCase());
        }
      }
    });

    const uniqueCuisines = Array.from(cuisineSet).sort();
    console.log('Unique cuisines found:', uniqueCuisines);
    setCuisines(uniqueCuisines);

    // Load saved recipes from localStorage
    const saved = JSON.parse(localStorage.getItem('savedRecipes') || '[]');
    setSavedRecipes(saved);
  };

  const applyFiltersAndSort = () => {
    let filtered = recipes.filter(recipe => {
      // Search filter
      const matchesSearch = 
        !searchQuery || 
        recipe.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.ingredientLines?.some(ing => ing.toLowerCase?.().includes(searchQuery.toLowerCase()));

      // Cuisine filter
      const matchesCuisine = 
        filterCuisine === 'all' || 
        (recipe.cuisine?.toLowerCase?.() === filterCuisine.toLowerCase()) ||
        (Array.isArray(recipe.cuisineType) && recipe.cuisineType.some(c => c.toLowerCase() === filterCuisine.toLowerCase()));

      // Difficulty filter
      const matchesDifficulty = 
        filterDifficulty === 'all' || 
        recipe.difficulty?.toLowerCase() === filterDifficulty.toLowerCase();

      return matchesSearch && matchesCuisine && matchesDifficulty;
    });

    // Sort
    if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    } else if (sortBy === 'rating') {
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === 'title') {
      filtered.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    }

    setFilteredRecipes(filtered);
  };

  const handleSaveRecipe = (recipe) => {
    const recipeId = recipe.id;
    const isSaved = savedRecipes.includes(recipeId);
    
    const updated = isSaved
      ? savedRecipes.filter(id => id !== recipeId)
      : [...savedRecipes, recipeId];
    
    setSavedRecipes(updated);
    localStorage.setItem('savedRecipes', JSON.stringify(updated));
    toast.success(isSaved ? 'Removed from saved' : 'Added to saved');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Recipes
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Explore {filteredRecipes.length} amazing recipes from our community and trusted sources
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search recipes, ingredients, cuisines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>

        {/* Filters & Sort */}
        <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Cuisine Filter */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
              Cuisine
            </label>
            <select
              value={filterCuisine}
              onChange={(e) => setFilterCuisine(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">All Cuisines</option>
              {cuisines.map(cuisine => (
                <option key={cuisine} value={cuisine}>
                  {cuisine.charAt(0).toUpperCase() + cuisine.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty Filter */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
              Difficulty
            </label>
            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">All Levels</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          {/* Sort */}
          <div className="sm:col-span-2 lg:col-span-2">
            <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="newest">Newest First</option>
              <option value="rating">Top Rated</option>
              <option value="title">Alphabetical</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-gray-600 dark:text-gray-400">
            Showing <span className="font-semibold">{filteredRecipes.length}</span> recipes
          </p>
          {(searchQuery || filterCuisine !== 'all' || filterDifficulty !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterCuisine('all');
                setFilterDifficulty('all');
              }}
              className="text-orange-500 hover:text-orange-600 text-sm font-semibold"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Recipes Grid */}
        {filteredRecipes.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-600 dark:text-gray-400 text-lg">No recipes found. Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRecipes.map(recipe => (
              <RecipeCardEnhanced
                key={recipe.id}
                recipe={recipe}
                onSave={() => handleSaveRecipe(recipe)}
                isSaved={savedRecipes.includes(recipe.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRecipes;