import { useState } from 'react';
import SearchBar from '../components/recipes/SearchBar';
import RecipeCard from '../components/recipes/RecipeCard';
import { searchRecipes } from '../services/edamamService';

export default function Search() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async ({ query, filters }) => {
    setLoading(true);
    setError(null);
    try {
      console.log('Searching for:', query, 'with filters:', filters);
      const data = await searchRecipes(query, filters);
      console.log('Search results:', data);
      if (data && data.recipes) {
        setRecipes(data.recipes);
      } else {
        setError('No recipes found');
        setRecipes([]);
      }
    } catch (err) {
      console.error('Search error:', err);
      setError(err.message || 'Failed to search recipes');
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <SearchBar onSearch={handleSearch} />
      
      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        </div>
      )}

      {error && (
        <div className="text-center py-12">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {!loading && !error && recipes.length > 0 && (
        <div className="mt-8 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.uri}
              recipe={recipe}
              onFavoriteToggle={(recipe, isFavorite) => {
                // You can add additional handling here if needed
                console.log(`Recipe ${recipe.label} ${isFavorite ? 'added to' : 'removed from'} favorites`);
              }}
            />
          ))}
        </div>
      )}

      {!loading && !error && recipes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Start searching for recipes!</p>
        </div>
      )}
    </div>
  );
}