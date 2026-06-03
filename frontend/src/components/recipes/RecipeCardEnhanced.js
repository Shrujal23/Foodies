import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE_URL, ASSET_BASE_URL } from '../../config';
import SaveButton from './SaveButton';

const RecipeCardEnhanced = ({ recipe }) => {
  const [rating, setRating] = useState(recipe.rating || 4.2);
  const [reviewCount, setReviewCount] = useState(recipe.reviewCount || 0);

  const fetchRating = useCallback(async () => {
    // Skip fetching if the backend already provided the review count
    if (recipe.reviewCount !== undefined) return;

    try {
      const recipeId = recipe._id || recipe.id;
      
      // Skip fetching for external Edamam recipes to prevent the N+1 query problem 
      // (Edamam recipes don't have local DB reviews anyway)
      if (!recipeId || recipe.uri || String(recipeId).includes('http') || String(recipeId).includes('#')) {
        return;
      }

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

  const imageUrl = recipe.image 
    ? (recipe.image.startsWith('http') ? recipe.image : `${ASSET_BASE_URL}${recipe.image}`)
    : 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800&q=80';

  const recipeLink = recipe.source === 'user' || recipe._id
    ? `/recipes/user/${recipe._id || recipe.id}`
    : `/recipes/${recipe.uri ? recipe.uri.split('#')[1] : recipe.id}`;

  return (
    <div className="group bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 overflow-hidden h-full flex flex-col">
      <div className="relative h-56 overflow-hidden">
        <Link to={recipeLink} className="block w-full h-full">
          <img
            src={imageUrl}
            alt={recipe.title || recipe.label}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>

        {recipe.difficulty && (
          <div className="absolute top-4 left-4 px-3 py-1 text-xs font-bold rounded-lg bg-white/90 dark:bg-gray-900/90 backdrop-blur">
            {recipe.difficulty}
          </div>
        )}

        <div className="absolute top-3 right-3 z-10">
          <SaveButton recipe={recipe} />
        </div>
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

        <div className="flex flex-wrap gap-2 text-sm mb-4">
          {(recipe.prepTime || recipe.prep_time) && (
            <span className="bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 px-3 py-1 rounded">
               {recipe.prepTime || recipe.prep_time} min
            </span>
          )}
          {recipe.cuisine && (
            <span className="bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 px-3 py-1 rounded">
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