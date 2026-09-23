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
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async ({ query, filters = {} }) => {
    if (!query?.trim() && Object.keys(filters).length === 0) return;

    setActiveFilters(filters);
    setLastQuery(query);
    setHasSearched(true);
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
    setHasSearched(false);
  };

  const handleSuggestionClick = (suggestion) => {
    handleSearch({ query: suggestion, filters: activeFilters });
  };

  return (
    <div className="min-h-screen bg-[#fffaf7] pb-20 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Breadcrumbs />

        <div className="mb-8 border-b border-[#eadbd1] pb-8 dark:border-gray-800 sm:pb-10">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-orange-700 dark:text-orange-300">
            Find something good
          </p>
          <h1 className="max-w-3xl text-4xl font-bold leading-tight text-[#35221a] dark:text-white sm:text-5xl">
            What are you in the mood to cook?
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-[#7f665a] dark:text-gray-400 sm:text-lg">
            Search by dish, ingredient, or simply describe the kind of meal you want.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="mr-1 text-sm text-[#8f7568] dark:text-gray-500">Try</span>
            {suggestedQueries.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => handleSuggestionClick(suggestion)}
                className="rounded-full border border-[#e7d4c7] bg-white px-3 py-1.5 text-sm font-medium text-[#765648] transition hover:border-orange-400 hover:bg-orange-50 hover:text-orange-800 focus:outline-none focus:ring-2 focus:ring-orange-400/40 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-orange-600 dark:hover:bg-orange-950/30 dark:hover:text-orange-300"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8 border-b border-[#eadbd1] pb-8 dark:border-gray-800 sm:pb-10">
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
          <div className="border border-[#eadbd1] bg-white p-6 dark:border-gray-800 dark:bg-gray-900 sm:p-8">
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
            <div className="mb-8 flex flex-col gap-3 border-b border-[#eadbd1] pb-5 dark:border-gray-800 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {recipes.length} {recipes.length === 1 ? 'recipe' : 'recipes'}
                  </h2>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {lastQuery ? `Showing results for “${lastQuery}”` : 'Explore ideas from our community and global recipes'}
                  </p>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 dark:text-gray-400">
                  {searchStats.userRecipes > 0 && (
                    <span className="font-medium text-orange-700 dark:text-orange-300">
                      {searchStats.userRecipes} community recipes
                    </span>
                  )}
                  {searchStats.edamamRecipes > 0 && (
                    <span className="font-medium text-pink-700 dark:text-pink-300">
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

        {!loading && !error && !hasSearched && (
          <div className="grid gap-8 border-b border-[#eadbd1] pb-12 dark:border-gray-800 md:grid-cols-[1.1fr_0.9fr] md:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-orange-700 dark:text-orange-300">
                A little inspiration
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-[#35221a] dark:text-white sm:text-3xl">
                Start with what you already have.
              </h2>
              <p className="mt-3 max-w-xl text-base leading-relaxed text-[#7f665a] dark:text-gray-400">
                A half-empty fridge is still a starting point. Search for an ingredient, a craving, or a familiar dish and we&apos;ll take it from there.
              </p>
            </div>
            <div className="border-l-2 border-orange-200 pl-5 dark:border-orange-800/70">
              <p className="text-sm font-medium text-[#765648] dark:text-gray-300">Good searches sound like:</p>
              <ul className="mt-3 space-y-2 text-sm text-[#8f7568] dark:text-gray-500">
                <li>&ldquo;something warm with lentils&rdquo;</li>
                <li>&ldquo;crispy potatoes for two&rdquo;</li>
                <li>&ldquo;an easy Sunday breakfast&rdquo;</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}