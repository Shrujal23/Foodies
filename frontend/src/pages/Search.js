import { useState } from 'react';
import SearchBar from '../components/recipes/SearchBar';
import RecipeCard from '../components/recipes/RecipeCard';
import { searchRecipes } from '../services/edamamService';

export default function Search() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async ({ query, filters }) => {
    if (!query.trim() && !Object.values(filters).some(Boolean)) return;

    setLoading(true);
    setError(null);
    setRecipes([]);

    try {
      const data = await searchRecipes(query.trim(), filters);

      if (data?.hits?.length > 0) {
        const foundRecipes = data.hits.map(hit => hit.recipe);
        setRecipes(foundRecipes);
      } else {
        setRecipes([]);
        setError('No recipes found — try something like "pasta", "chicken", or "vegan dessert"');
      }
    } catch (err) {
      console.error('Search failed:', err);
      setError('Oops! Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12">
      <div className="max-w-7xl mx-auto px-6">

        {/* Hero Header */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent mb-4">
            Discover Delicious Recipes
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Search millions of recipes from around the world — find your next favorite dish
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-16">
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-20 h-20 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-6" />
            <p className="text-xl text-gray-600 dark:text-gray-400">Finding delicious recipes...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-24">
            <div className="w-24 h-24 mx-auto mb-6 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-md mx-auto">{error}</p>
          </div>
        )}

        {/* Results Grid */}
        {!loading && !error && recipes.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                {recipes.length} Delicious Recipe{recipes.length !== 1 ? 's' : ''} Found
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Click any card to view full details
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {recipes.map((recipe) => (
                <div
                  key={recipe.uri}
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

        {/* Empty State */}
        {!loading && !error && recipes.length === 0 && (
          <div className="text-center py-24">
            <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-orange-100 to-pink-100 dark:from-orange-900/30 dark:to-pink-900/30 rounded-full flex items-center justify-center">
              <svg className="w-16 h-16 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
              Ready to cook something amazing?
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              Search for ingredients, cuisines, diets, or just type what you're craving!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}