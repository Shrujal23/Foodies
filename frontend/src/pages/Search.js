import { useState } from 'react';
import SearchBar from '../components/recipes/SearchBar';
import RecipeCard from '../components/recipes/RecipeCard';
import EmptyState from '../components/common/EmptyState';
import SkeletonLoader from '../components/common/SkeletonLoader';
import FilterPills from '../components/common/FilterPills';
import Breadcrumbs from '../components/common/Breadcrumbs';
import { searchRecipes } from '../services/recipeService';
import toastConfig from '../utils/toastConfig';

export default function Search() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchStats, setSearchStats] = useState({ userRecipes: 0, edamamRecipes: 0 });
  const [filters, setFilters] = useState({});

  const handleSearch = async ({ query, filters: searchFilters }) => {
    if (!query.trim() && !Object.values(searchFilters).some(Boolean)) return;

    setFilters(searchFilters);
    setLoading(true);
    setError(null);
    setRecipes([]);
    setSearchStats({ userRecipes: 0, edamamRecipes: 0 });

    try {
      // Pass all filters to the search function
      const data = await searchRecipes(query.trim(), searchFilters);

      if (data?.hits?.length > 0) {
        // Separate user recipes from edamam recipes for stats
        const userRecipes = data.hits.filter(hit => hit.recipe.source === 'user');
        const edamamRecipes = data.hits.filter(hit => hit.recipe.source !== 'user');
        
        setSearchStats({
          userRecipes: userRecipes.length,
          edamamRecipes: edamamRecipes.length
        });

        const foundRecipes = data.hits.map(hit => hit.recipe);
        setRecipes(foundRecipes);
        toastConfig.success(`Found ${foundRecipes.length} recipes!`);
      } else {
        setRecipes([]);
        setError('No recipes found — try adjusting your filters or search term');
      }
    } catch (err) {
      console.error('Search failed:', err);
      setError('Oops! Something went wrong. Please try again.');
      toastConfig.error('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFilter = (filterKey) => {
    const newFilters = { ...filters, [filterKey]: '' };
    setFilters(newFilters);
    // Automatically search with updated filters if user already searched
    if (recipes.length > 0) {
      handleSearch({ query: '', filters: newFilters });
    }
  };

  const handleClearAllFilters = () => {
    setFilters({});
    setRecipes([]);
    setSearchStats({ userRecipes: 0, edamamRecipes: 0 });
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12">
      <div className="max-w-7xl mx-auto px-6">

        {/* Breadcrumbs */}
        <div className="mb-8">
          <Breadcrumbs />
        </div>

        {/* Hero Header */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent mb-4">
            Discover Delicious Recipes
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Search millions of recipes from around the world + community recipes — find your next favorite dish
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-12">
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Active Filters Pills */}
        {Object.values(filters).some(Boolean) && (
          <div className="mb-10">
            <FilterPills 
              filters={filters}
              onRemoveFilter={handleRemoveFilter}
              onClearAll={handleClearAllFilters}
            />
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="py-24">
            <p className="text-center text-lg text-gray-600 dark:text-gray-400 mb-8">
              🔍 Finding delicious recipes...
            </p>
            <SkeletonLoader type="card" count={4} />
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <EmptyState
            icon="⚠️"
            title="No Recipes Found"
            description={error}
            actions={[
              { label: 'Clear Filters', onClick: handleClearAllFilters, primary: true },
              { label: 'Try New Search', onClick: handleClearAllFilters }
            ]}
          />
        )}

        {/* Results Grid */}
        {!loading && !error && recipes.length > 0 && (
          <>
            <div className="flex flex-col gap-6 mb-10">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {recipes.length} Delicious Recipe{recipes.length !== 1 ? 's' : ''} Found
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
                  Click any card to view full details
                </p>
              </div>

              {/* Search Stats */}
              <div className="flex flex-wrap gap-4">
                {searchStats.userRecipes > 0 && (
                  <div className="px-4 py-2 bg-gradient-to-r from-orange-100 to-pink-100 dark:from-orange-900/30 dark:to-pink-900/30 rounded-full border border-orange-300 dark:border-orange-700/50">
                    <span className="text-sm font-semibold text-orange-900 dark:text-orange-300">
                      👥 {searchStats.userRecipes} Community Recipe{searchStats.userRecipes !== 1 ? 's' : ''}
                    </span>
                  </div>
                )}
                {searchStats.edamamRecipes > 0 && (
                  <div className="px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-full border border-blue-300 dark:border-blue-700/50">
                    <span className="text-sm font-semibold text-blue-900 dark:text-blue-300">
                      🌍 {searchStats.edamamRecipes} Global Recipe{searchStats.edamamRecipes !== 1 ? 's' : ''}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {recipes.map((recipe) => (
                <div
                  key={recipe.uri || recipe.id}
                  className="transform transition-all duration-500 hover:scale-105"
                >
                  <RecipeCard
                    recipe={recipe}
                    onFavoriteToggle={(recipe, isFavorite) => {
                      // Optional: trigger re-render or toast here if needed
                    }}
                  />
                </div>
              ))}
            </div>
          </>
        )}

        {/* Empty State - No Search Started */}
        {!loading && !error && recipes.length === 0 && Object.values(filters).every(v => !v) && (
          <EmptyState
            icon="🔍"
            title="Ready to cook something amazing?"
            description="Search for ingredients, cuisines, diets, or just type what you're craving!"
            actions={[
              { label: 'Browse Home', to: '/' },
              { label: 'View Recipes', to: '/my-recipes', primary: true }
            ]}
          />
        )}
      </div>
    </div>
  );
}