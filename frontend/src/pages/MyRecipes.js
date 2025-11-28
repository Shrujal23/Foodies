import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE_URL, ASSET_BASE_URL } from '../config';

const MyRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/recipes/user-recipes`);
        if (!response.ok) throw new Error('Failed to load');

        const data = await response.json();
        const processed = data.map(recipe => ({
          ...recipe,
          image: recipe.image && !recipe.image.startsWith('http')
            ? `${ASSET_BASE_URL}${recipe.image}`
            : recipe.image || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        }));
        setRecipes(processed);
      } catch (err) {
        console.error('Failed to fetch recipes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              My Recipes
            </h1>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
              {recipes.length} {recipes.length === 1 ? 'recipe' : 'recipes'} in your collection
            </p>
          </div>

          <Link
            to="/recipes/add"
            className="inline-flex items-center gap-3 px-6 py-3.5 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-pink-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            Add New Recipe
          </Link>
        </div>

        {/* Empty State */}
        {recipes.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-8xl mb-6">Cooking Pot</div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-3">
              No recipes yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-8">
              Your culinary journey starts here. Share your first recipe with the community!
            </p>
            <Link
              to="/recipes/add"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-pink-700 transform hover:scale-105 transition-all shadow-lg"
            >
              Create Your First Recipe
            </Link>
          </div>
        ) : (
          /* Recipe Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {recipes.map((recipe) => (
              <div
                key={recipe.id}
                className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                <Link to={`/recipes/user/${recipe.id}`}>
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Difficulty Badge */}
                    <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-lg
                      bg-green-500" 
                      style={{
                        backgroundColor:
                          recipe.difficulty === 'Easy' ? '#10b981' :
                          recipe.difficulty === 'Medium' ? '#f59e0b' :
                          '#ef4444'
                      }}
                    >
                      {recipe.difficulty}
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                      {recipe.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-4">
                      {recipe.description || 'A delicious homemade creation'}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1.5">
                        Clock
                        <span className="font-medium">
                          {recipe.prep_time + recipe.cook_time} mins
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        Users
                        <span className="font-medium">{recipe.servings} servings</span>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-5 flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {new Date(recipe.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                      <span className="text-orange-600 font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                        View Recipe
                        Right Arrow
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRecipes;