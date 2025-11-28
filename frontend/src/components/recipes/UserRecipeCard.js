import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { ClockIcon, UsersIcon, StarIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function UserRecipeCard({ recipe }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleFavoriteClick = async (e) => {
    e.preventDefault(); // Prevent the card click from triggering
    if (isLoading) return;

    setIsLoading(true);
    try {
      setIsFavorite(!isFavorite);
      toast.success(isFavorite ? 'Recipe removed from favorites' : 'Recipe added to favorites');
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      toast.error('Failed to update favorites');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <img
          src={recipe.image || '/default-recipe.jpg'}
          alt={recipe.title}
          className="w-full h-48 object-cover"
        />
        <button
          onClick={handleFavoriteClick}
          disabled={isLoading}
          className={`absolute top-4 right-4 p-2 rounded-full transform transition-all duration-200 ease-in-out
            ${isFavorite 
              ? 'bg-red-500 text-white scale-110' 
              : 'bg-white/90 backdrop-blur-sm text-gray-600 hover:bg-white hover:scale-110'
            } shadow-md hover:shadow-lg ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          title={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
          ) : isFavorite ? (
            <HeartSolidIcon className="h-5 w-5" />
          ) : (
            <HeartIcon className="h-5 w-5" />
          )}
        </button>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{recipe.title}</h3>
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
          <div className="flex items-center">
            <ClockIcon className="h-4 w-4 mr-1" />
            {recipe.cook_time + recipe.prep_time} mins
          </div>
          <div className="flex items-center">
            <UsersIcon className="h-4 w-4 mr-1" />
            {recipe.servings} servings
          </div>
          <div className="flex items-center">
            <StarIcon className="h-4 w-4 mr-1" />
            {recipe.difficulty}
          </div>
        </div>
        <div className="text-sm text-gray-500 mb-4">
          Created: {new Date(recipe.created_at).toLocaleDateString()}
        </div>
        <Link
          to={`/recipes/user/${recipe.id}`}
          className="inline-block bg-accent-600 text-white px-4 py-2 rounded-lg hover:bg-accent-700 transition-colors duration-200"
        >
          View Recipe
        </Link>
      </div>
    </div>
  );
}