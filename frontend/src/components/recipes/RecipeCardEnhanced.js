import React, { useState, useEffect, useCallback } from 'react';
import { BookmarkIcon as BookmarkOutline } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolid } from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';
import { API_BASE_URL, ASSET_BASE_URL } from '../../config';

const RecipeCardEnhanced = ({ recipe, onSave, isSaved = false }) => {
  const [rating, setRating] = useState(4.2);
  const [reviewCount, setReviewCount] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(isSaved);

  const fetchRating = useCallback(async () => {
    try {
      const recipeId = recipe._id || recipe.id;
      if (!recipeId) return;

      const res = await fetch(`${API_BASE_URL}/recipes/${recipeId}/rating-breakdown`);
      
      if (res.ok) {
        const stats = await res.json();
        let totalRatings = 0;
        let totalScore = 0;

        for (let i = 1; i <= 5; i++) {
          const count = parseInt(stats[i]) || 0;
          totalRatings += count;
          totalScore += i * count;
        }

        const avg = totalRatings > 0 ? (totalScore / totalRatings).toFixed(1) : 4.2;
        setRating(parseFloat(avg));
        setReviewCount(totalRatings);
      }
    } catch (error) {
      console.error('Failed to fetch rating:', error);
      // Silent fallback - keep default rating
    }
  }, [recipe]);

  useEffect(() => {
    fetchRating();
  }, [fetchRating]);

  const handleBookmarkClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const newState = !isBookmarked;
    setIsBookmarked(newState);
    onSave?.(recipe, newState);
  };

  const imageUrl = recipe.image 
    ? (recipe.image.startsWith('http') ? recipe.image : `${ASSET_BASE_URL}${recipe.image}`)
    : 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800&q=80';

  const recipeLink = recipe.source === 'user' || recipe._id
    ? `/recipes/user/${recipe._id || recipe.id}`
    : `/recipes/${recipe.uri ? recipe.uri.split('#')[1] : recipe.id}`;

  return (
    <div className="group bg-white dark:bg-gray-800 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden h-full flex flex-col">
      <div className="relative h-56 overflow-hidden">
        <Link to={recipeLink} className="block w-full h-full">
          <img
            src={imageUrl}
            alt={recipe.title || recipe.label}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        </Link>

        {recipe.difficulty && (
          <div className="absolute top-4 left-4 px-3 py-1 text-xs font-bold rounded-2xl bg-white/90 dark:bg-gray-900/90 backdrop-blur">
            {recipe.difficulty}
          </div>
        )}

        <button
          onClick={handleBookmarkClick}
          className="absolute top-4 right-4 p-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur rounded-2xl shadow-lg hover:scale-110 transition-all z-10"
        >
          {isBookmarked ? (
            <BookmarkSolid className="w-6 h-6 text-orange-500" />
          ) : (
            <BookmarkOutline className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          )}
        </button>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <Link to={recipeLink} className="flex-1">
          <h3 className="font-bold text-xl text-gray-900 dark:text-white line-clamp-2 mb-3 group-hover:text-orange-600 transition">
            {recipe.title || recipe.label}
          </h3>
        </Link>

        {recipe.username && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            By {recipe.display_name || recipe.username}
          </p>
        )}

        <div className="flex flex-wrap gap-3 text-sm mb-6">
          {(recipe.prepTime || recipe.prep_time) && (
            <span className="bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-3 py-1 rounded-xl">
               {recipe.prepTime || recipe.prep_time} min
            </span>
          )}
          {recipe.cuisine && (
            <span className="bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 px-3 py-1 rounded-xl">
               {recipe.cuisine}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-1 text-yellow-500">
             <span className="font-semibold">{rating}</span>
            {reviewCount > 0 && <span className="text-xs text-gray-500">({reviewCount})</span>}
          </div>

          <Link to={recipeLink} className="text-orange-600 hover:text-orange-700 font-medium text-sm">
            View Recipe →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RecipeCardEnhanced;