import { useState } from 'react';
import RecipeCardEnhanced from '../components/recipes/RecipeCardEnhanced';
import EmptyState from '../components/common/EmptyState';
import SkeletonLoader from '../components/common/SkeletonLoader';
import FilterPills from '../components/common/FilterPills';
import Breadcrumbs from '../components/common/Breadcrumbs';
import SearchBar from '../components/recipes/SearchBar';
import { searchRecipes } from '../services/recipeService';
import toast from 'react-hot-toast';

export default function Search() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchStats, setSearchStats] = useState({ userRecipes: 0, edamamRecipes: 0 });
  const [activeFilters, setActiveFilters] = useState({});

  const handleSearch = async ({ query, filters = {} }) => {
    if (!query?.trim() && Object.keys(filters).length === 0) return;

    setActiveFilters(filters);
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
        setError("No recipes found. Try different keywords or filters.");
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
    
    // Re-search with updated filters
    handleSearch({ 
      query: document.querySelector('input[placeholder*="Search"]')?.value || '', 
      filters: newFilters 
    });
  };

  const handleClearAllFilters = () => {
    setActiveFilters({});
    setRecipes([]);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-rose-50 dark:from-gray-950 dark:via-gray-900 pb-20">
      <div className="max-w-7xl mx-auto px-6">

        {/* Breadcrumbs */}
        <Breadcrumbs />

        {/* Header */}
        <div className="text-center mt-12 mb-16">
          <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white mb-6">
            Discover <span className="bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">Desi Flavors</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Search authentic Indian recipes and global favorites from our community and beyond
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-12">
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Active Filters */}
        {Object.keys(activeFilters).length > 0 && (
          <div className="mb-10">
            <FilterPills 
              filters={activeFilters}
              onRemoveFilter={handleRemoveFilter}
              onClearAll={handleClearAllFilters}
            />
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="py-20">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-3 text-orange-600">
                <div className="w-6 h-6 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-lg font-medium">Finding delicious recipes...</span>
              </div>
            </div>
            <SkeletonLoader type="card" count={8} />
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <EmptyState
            icon="🔍"
            title="No Recipes Found"
            description={error}
            actions={[
              { label: 'Clear Filters', onClick: handleClearAllFilters, primary: true },
              { label: 'Browse All Recipes', to: '/my-recipes' }
            ]}
          />
        )}

        {/* Results */}
        {!loading && !error && recipes.length > 0 && (
          <>
            <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {recipes.length} Recipes Found
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {searchStats.userRecipes > 0 && `${searchStats.userRecipes} from Community • `}
                  {searchStats.edamamRecipes > 0 && `${searchStats.edamamRecipes} from Global`}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {recipes.map((recipe) => (
                <RecipeCardEnhanced
                  key={recipe._id || recipe.uri || recipe.id}
                  recipe={recipe}
                  onSave={(rec, saved) => {
                    // You can add toast or state update here if needed
                    console.log(saved ? 'Saved:' : 'Removed:', rec.title);
                  }}
                />
              ))}
            </div>
          </>
        )}

        {/* Initial Empty State */}
        {!loading && !error && recipes.length === 0 && Object.keys(activeFilters).length === 0 && (
          <EmptyState
            icon="🍛"
            title="What are you craving today?"
            description="Search for Butter Chicken, Biryani, Paneer Tikka, or any dish you love"
            actions={[
              { label: 'Popular Recipes', to: '/' },
              { label: 'Browse Community', to: '/my-recipes', primary: true }
            ]}
          />
        )}
      </div>
    </div>
  );
}