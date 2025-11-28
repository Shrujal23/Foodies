import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
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
      if (!user || initialFavorite) return;
      try {
        const { isFavorite } = await checkFavoriteStatus(recipe.uri);
        setIsFavorite(isFavorite);
      } catch (error) {
        console.error('Failed to check favorite status:', error);
      }
    };
    checkFavorite();
  }, [recipe.uri, initialFavorite, user]);

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

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
        toast.success('Removed from favorites');
      } else {
        await addToFavorites(recipe);
        toast.success('Saved to favorites');
      }
      setIsFavorite(!isFavorite);
      onFavoriteToggle?.(recipe, !isFavorite);
    } catch (error) {
      toast.error('Failed to update favorites');
    } finally {
      setIsLoading(false);
    }
  };

  const calories = recipe.calories ? Math.round(recipe.calories) : null;
  const time = recipe.totalTime > 0 ? recipe.totalTime : null;

  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3">
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={recipe.image}
          alt={recipe.label}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          disabled={isLoading}
          className={`absolute top-4 right-4 p-3.5 rounded-2xl shadow-lg backdrop-blur-md transition-all duration-300 transform
            ${isFavorite 
              ? 'bg-red-500 text-white scale-110 shadow-red-500/30' 
              : 'bg-white/90 text-gray-700 hover:bg-white hover:scale-110'
            } ${isLoading ? 'opacity-70 cursor-wait' : 'hover:shadow-xl'}`}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : isFavorite ? (
            <HeartSolidIcon className="w-6 h-6" />
          ) : (
            <HeartIcon className="w-6 h-6" />
          )}
        </button>

        {/* Labels Badges */}
        <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
          {recipe.dietLabels?.slice(0, 2).map((label) => (
            <span key={label} className="px-3 py-1.5 bg-emerald-500/90 text-white text-xs font-bold rounded-full backdrop-blur-sm">
              {label}
            </span>
          ))}
          {recipe.healthLabels?.includes('Vegan') && (
            <span className="px-3 py-1.5 bg-green-600/90 text-white text-xs font-bold rounded-full backdrop-blur-sm">
              Vegan
            </span>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-7">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-300">
          {recipe.label}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((i) => (
              <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
            ))}
          </div>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            4.8 • {Math.floor(Math.random() * 80) + 30} reviews
          </span>
        </div>

        {/* Quick Info */}
        <div className="flex flex-wrap gap-4 mb-5 text-sm">
          {calories && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500" />
              <span className="font-medium text-gray-700 dark:text-gray-300">{calories} cal</span>
            </div>
          )}
          {time && (
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium text-gray-700 dark:text-gray-300">{time} min</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="font-medium text-gray-700 dark:text-gray-300">
              {recipe.ingredientLines?.length || 0} ingredients
            </span>
          </div>
        </div>

        {/* Action Button */}
        <a
          href={recipe.url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full block text-center py-4 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-bold text-lg rounded-2xl hover:from-orange-600 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          View Full Recipe
        </a>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-orange-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl" />
    </div>
  );
}