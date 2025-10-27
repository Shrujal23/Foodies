import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import UserRecipeCard from '../components/recipes/UserRecipeCard';

const MyRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch('http://localhost:5000/api/recipes/my-recipes', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          // Ensure image URLs are absolute
          const processedData = data.map(recipe => ({
            ...recipe,
            image: recipe.image && !recipe.image.startsWith('http') 
              ? `http://localhost:5000${recipe.image}`
              : recipe.image
          }));
          setRecipes(processedData);
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch recipes');
        }
      } catch (error) {
        console.error('Error:', error);
        // If token is invalid or missing, clear it
        if (error.message.includes('authentication') || error.message.includes('token')) {
          localStorage.removeItem('token');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Recipes</h1>
        <Link
          to="/recipes/add"
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-accent-600 hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500"
        >
          Add New Recipe
        </Link>
      </div>

      {recipes.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No recipes yet</h3>
          <p className="text-gray-500 mb-6">Start sharing your favorite recipes with the community!</p>
          <Link
            to="/recipes/add"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-accent-600 hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500"
          >
            Create Your First Recipe
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <div key={recipe.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
              {recipe.image && (
                <img
                  src={recipe.image.startsWith('http') ? recipe.image : `http://localhost:5000${recipe.image}`}
                  alt={recipe.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              )}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1 group-hover:text-accent-600 transition-colors duration-200">
                  {recipe.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {recipe.description}
                </p>

                {/* Recipe stats */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{recipe.prep_time + recipe.cook_time} mins</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span>{recipe.servings} servings</span>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    recipe.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                    recipe.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {recipe.difficulty}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-xs text-gray-500">
                    Created: {new Date(recipe.created_at).toLocaleDateString()}
                  </div>
                  <Link
                    to={`/recipes/user/${recipe.id}`}
                    className="text-accent-600 hover:text-accent-700 font-medium text-sm flex items-center group-hover:bg-accent-50 px-3 py-1 rounded-full transition-colors duration-200"
                  >
                    View Recipe
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRecipes;