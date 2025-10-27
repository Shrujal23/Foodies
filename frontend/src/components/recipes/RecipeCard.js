import { HeartIcon, StarIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon, StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import { useState, useEffect } from 'react';
import { checkFavoriteStatus, addToFavorites, removeFromFavorites } from '../../services/recipeService';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function RecipeCard({ recipe, initialFavorite = false, onFavoriteToggle }) {
  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkFavorite = async () => {
      if (!user) return;
      
      try {
        const { isFavorite } = await checkFavoriteStatus(recipe.uri);
        setIsFavorite(isFavorite);
      } catch (error) {
        console.error('Failed to check favorite status:', error);
      }
    };

    if (!initialFavorite) {
      checkFavorite();
    }
  }, [recipe.uri, initialFavorite, user]);

  const handleFavoriteClick = async () => {
    if (isLoading) return;
    
    if (!user) {
      toast.error('Please log in to save recipes');
      navigate('/login');
      return;
    }
    
    setIsLoading(true);
    try {
      if (isFavorite) {
        await removeFromFavorites(recipe.uri);
        toast.success('Recipe removed from favorites');
      } else {
        await addToFavorites(recipe);
        toast.success('Recipe added to favorites');
      }
      setIsFavorite(!isFavorite);
      if (onFavoriteToggle) {
        onFavoriteToggle(recipe, !isFavorite);
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      toast.error('Failed to update favorites');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl">
      <div className="relative group">
        <img 
          src={recipe.image} 
          alt={recipe.label}
          className="w-full h-56 object-cover"
        />
        <button
          onClick={handleFavoriteClick}
          disabled={isLoading}
          className={`absolute top-4 right-4 p-2 rounded-full transform transition-all duration-200 ease-in-out
            ${isFavorite 
              ? 'bg-red-500 text-white scale-110' 
              : 'bg-white/90 backdrop-blur-sm text-gray-600 hover:bg-white hover:scale-110'
            } shadow-md group-hover:shadow-lg ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
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
      <div className="p-5">
        <h3 className="text-xl font-display font-semibold text-gray-900 mb-3 line-clamp-2">{recipe.label}</h3>

        {/* Rating Section */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <StarSolidIcon
                key={star}
                className="h-4 w-4 text-yellow-400"
              />
            ))}
            <span className="ml-2 text-sm text-gray-600">
              4.5 ({Math.floor(Math.random() * 100) + 20} reviews)
            </span>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-3 flex items-center gap-3">
          {recipe.calories && (
            <span className="flex items-center">
              <span className="w-2 h-2 rounded-full bg-accent-500 mr-2"></span>
              {Math.round(recipe.calories)} calories
            </span>
          )}
          {recipe.totalTime && (
            <span className="flex items-center">
              <span className="w-2 h-2 rounded-full bg-accent-500 mr-2"></span>
              {recipe.totalTime} min
            </span>
          )}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {recipe.dietLabels?.map((label) => (
            <span
              key={label}
              className="px-2.5 py-1 text-xs font-medium bg-emerald-50 text-emerald-700 rounded-full ring-1 ring-emerald-600/10"
            >
              {label}
            </span>
          ))}
          {recipe.healthLabels?.slice(0, 3).map((label) => (
            <span
              key={label}
              className="px-2.5 py-1 text-xs font-medium bg-sky-50 text-sky-700 rounded-full ring-1 ring-sky-600/10"
            >
              {label}
            </span>
          ))}
        </div>
        <div className="flex justify-between items-center border-t border-gray-100 pt-4">
          <span className="text-sm text-gray-600 flex items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-2"></span>
            {recipe.ingredientLines?.length} ingredients
          </span>
          <a
            href={recipe.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-accent-600 hover:text-accent-700 bg-accent-50 rounded-lg transition duration-150 ease-in-out hover:bg-accent-100"
          >
            View Recipe
            <span className="ml-1.5">→</span>
          </a>
        </div>
      </div>
    </div>
  );
}