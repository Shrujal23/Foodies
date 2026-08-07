import { useState } from 'react';
import RecipeCardEnhanced from '../components/recipes/RecipeCardEnhanced';
import EmptyState from '../components/common/EmptyState';
import LoadingPlaceholder from '../components/common/LoadingPlaceholder';
import FilterPills from '../components/common/FilterPills';
import Breadcrumbs from '../components/common/Breadcrumbs';
import SearchBar from '../components/recipes/SearchBar';
import { searchRecipes } from '../services/recipeService';
import toast from 'react-hot-toast';

const suggestedQueries = ['Quick dinner', 'Vegetarian', 'Dessert', 'Healthy breakfast', 'Indian curry'];

export default function Search() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchStats, setSearchStats] = useState({ userRecipes: 0, edamamRecipes: 0 });
  const [activeFilters, setActiveFilters] = useState({});
  const [lastQuery, setLastQuery] = useState('');

  const handleSearch = async ({ query, filters = {} }) => {
    if (!query?.trim() && Object.keys(filters).length === 0) return;

    setActiveFilters(filters);
    setLastQuery(query);
    setLoading(true);
    setError(null);
    setRecipes([]);

    try {
      const data = await searchRecipes(query.trim(), filters);

      const userRecipes = data?.userRecipes || [];
      const edamamRecipes = data?.edamamRecipes || [];
      const allRecipes = [...userRecipes, ...edamamRecipes];

      setSearchStats({
        userRecipes: userRecipes.length,
        edamamRecipes: edamamRecipes.length
      });

      setRecipes(allRecipes);

      if (allRecipes.length === 0) {
        setError('No recipes found. Try different keywords or filters.');
      } else {
        toast.success(`Found ${allRecipes.length} recipes!`);
      }
    } catch (err) {
      console.error('Search failed:', err);
      setError('Something went wrong. Please try again.');
      toast.error('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFilter = (key) => {
    const newFilters = { ...activeFilters };
    delete newFilters[key];
    setActiveFilters(newFilters);

    handleSearch({
      query: lastQuery,
      filters: newFilters
    });
  };

  const handleClearAllFilters = () => {
    setActiveFilters({});
    setRecipes([]);
    setError(null);
    setLastQuery('');
  };

  const handleSuggestionClick = (suggestion) => {
    handleSearch({ query: suggestion, filters: activeFilters });
  };

  return (
    <div className="min-h-screen bg-[#fffaf7] pb-20 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Breadcrumbs />

        <div className="mb-8 overflow-hidden rounded-[1.75rem] border border-orange-100/70 bg-gradient-to-br from-white via-orange-50/70 to-pink-50/80 p-6 shadow-[0_20px_60px_rgba(249,115,22,0.08)] backdrop-blur dark:border-gray-800 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="mb-3 inline-flex items-center rounded-full border border-orange-200 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-orange-600 shadow-sm dark:border-orange-800/70 dark:bg-gray-800/80 dark:text-orange-300">
                Search recipes
              </p>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
                Discover your next favorite dish
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400 sm:text-base">
                Search authentic Indian recipes and global favorites from our community and beyond.
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {suggestedQueries.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => handleSuggestionClick(suggestion)}
                className="rounded-full border border-orange-200 bg-white/80 px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-orange-300 hover:text-orange-700 dark:border-gray-700 dark:bg-gray-800/70 dark:text-gray-300 dark:hover:border-orange-600 dark:hover:text-orange-300"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8 rounded-[1.4rem] border border-orange-100/70 bg-white/90 p-3 shadow-[0_18px_50px_rgba(53,34,26,0.07)] backdrop-blur dark:border-gray-800 dark:bg-gray-900/90 sm:p-4">
          <SearchBar onSearch={handleSearch} />
        </div>

        {Object.keys(activeFilters).length > 0 && (
          <div className="mb-8 rounded-[1rem] border border-orange-100/70 bg-white/80 px-4 py-4 shadow-sm dark:border-gray-800 dark:bg-gray-900/70 sm:px-5">
            <FilterPills
              filters={activeFilters}
              onRemoveFilter={handleRemoveFilter}
              onClearAll={handleClearAllFilters}
            />
          </div>
        )}

        {loading && (
          <div className="rounded-[1.25rem] border border-orange-100/70 bg-white/90 p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900/90 sm:p-8">
            <div className="mb-8 text-center">
              <div className="inline-flex items-center gap-3 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-orange-600 dark:border-orange-800/60 dark:bg-orange-900/20 dark:text-orange-300">
                <div className="h-5 w-5 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
                <span className="text-sm font-semibold sm:text-base">Finding delicious recipes...</span>
              </div>
            </div>
            <LoadingPlaceholder variant="recipe" count={8} />
          </div>
        )}

        {error && !loading && (
          <div className="rounded-[1.25rem] border border-orange-100/70 bg-white/90 p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900/90 sm:p-8">
            <EmptyState
              icon="🔍"
              title="No Recipes Found"
              description={error}
              actions={[
                { label: 'Clear Filters', onClick: handleClearAllFilters, primary: true },
                { label: 'Browse All Recipes', to: '/recipes' }
              ]}
            />
          </div>
        )}

        {!loading && !error && recipes.length > 0 && (
          <>
            <div className="mb-8 rounded-[1rem] border border-orange-100/70 bg-white/80 px-5 py-4 shadow-sm dark:border-gray-800 dark:bg-gray-900/70 sm:px-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {recipes.length} recipes found
                  </h2>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {lastQuery ? `Showing results for “${lastQuery}”` : 'Explore ideas from our community and global recipes'}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 text-sm text-gray-600 dark:text-gray-400">
                  {searchStats.userRecipes > 0 && (
                    <span className="rounded-full bg-orange-50 px-3 py-1 font-medium text-orange-700 dark:bg-orange-900/20 dark:text-orange-300">
                      {searchStats.userRecipes} community recipes
                    </span>
                  )}
                  {searchStats.edamamRecipes > 0 && (
                    <span className="rounded-full bg-pink-50 px-3 py-1 font-medium text-pink-700 dark:bg-pink-900/20 dark:text-pink-300">
                      {searchStats.edamamRecipes} global recipes
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {recipes.map((recipe) => (
                <RecipeCardEnhanced
                  key={recipe._id || recipe.uri || recipe.id}
                  recipe={recipe}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}