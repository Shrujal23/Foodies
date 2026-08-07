import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE_URL, ASSET_BASE_URL } from '../../config';
import SaveButton from './SaveButton';

const RecipeCardEnhanced = ({ recipe }) => {
  const [rating, setRating] = useState(recipe.rating || 4.2);
  const [reviewCount, setReviewCount] = useState(recipe.reviewCount || 0);

  const fetchRating = useCallback(async () => {
    if (recipe.reviewCount !== undefined || recipe.source === 'edamam') return;

    try {
      const recipeId = recipe._id || recipe.id;
      if (!recipeId || String(recipeId).includes('http') || String(recipeId).includes('#')) {
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
    }
  }, [recipe]);

  useEffect(() => {
    fetchRating();
  }, [fetchRating]);

  const imageUrl = recipe.image 
    ? (recipe.image.startsWith('http') ? recipe.image : `${ASSET_BASE_URL}${recipe.image}`)
    : 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800&q=80';

  const isUserRecipe = recipe.source === 'user' || recipe._id && !String(recipe._id).startsWith('recipe_');
  const externalRecipeUrl = recipe.url || recipe.sourceUrl || recipe.recipeUrl;
  const isExternalRecipe = Boolean(externalRecipeUrl) && recipe.source === 'edamam';
  const recipeLink = isUserRecipe
    ? `/recipes/user/${recipe._id || recipe.id}`
    : `/recipes/${recipe._id || recipe.id}`;

  const renderRecipeLink = (children, className = '', extraProps = {}) => {
    if (isExternalRecipe) {
      return (
        <a
          href={externalRecipeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={className}
          {...extraProps}
        >
          {children}
        </a>
      );
    }

    return (
      <Link to={recipeLink} state={{ recipe }} className={className} {...extraProps}>
        {children}
      </Link>
    );
  };

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-[#f4ddce] bg-[#fffdfb]/95 shadow-[0_12px_32px_rgba(53,34,26,0.08)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_18px_44px_rgba(53,34,26,0.14)] dark:border-gray-700 dark:bg-gray-800/90">
      <div className="relative h-52 overflow-hidden sm:h-56">
        {renderRecipeLink(
          <img
            src={imageUrl}
            alt={recipe.title || recipe.label}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />,
          'block w-full h-full'
        )}

        {recipe.difficulty && (
          <div className="absolute left-4 top-4 rounded-full border border-[#f0d8c7] bg-[#fff7f0]/95 px-3 py-1 text-xs font-semibold text-[#9a532d] shadow-sm backdrop-blur dark:border-gray-700 dark:bg-gray-900/90 dark:text-orange-300">
            {recipe.difficulty}
          </div>
        )}

        <div className="absolute top-3 right-3 z-10">
          <SaveButton recipe={recipe} />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        {renderRecipeLink(
          <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-gray-900 transition group-hover:text-orange-600 dark:text-white sm:text-xl">
            {recipe.title || recipe.label}
          </h3>,
          'flex-1'
        )}

        {recipe.username && (
          <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
            By {recipe.display_name || recipe.username}
          </p>
        )}

        <div className="mb-4 flex flex-wrap gap-2 text-sm">
          {(recipe.prepTime || recipe.prep_time) && (
            <span className="rounded-full border border-[#f7d7c2] bg-[#fff0e8] px-3 py-1 text-[#b6542e] dark:border-orange-700/50 dark:bg-orange-900/40 dark:text-orange-300">
               {recipe.prepTime || recipe.prep_time} min
            </span>
          )}
          {recipe.cuisine && (
            <span className="rounded-full border border-[#f6c8d7] bg-[#ffe8ee] px-3 py-1 text-[#b53b63] dark:border-rose-700/50 dark:bg-rose-900/40 dark:text-rose-300">
               {recipe.cuisine}
            </span>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-[#f4ddce] pt-4 dark:border-gray-700">
          <div className="flex items-center gap-1 text-amber-500">
            <span className="font-semibold">{rating}</span>
            {reviewCount > 0 && <span className="text-xs text-gray-500">({reviewCount})</span>}
          </div>

          {renderRecipeLink(
            <span className="text-sm font-medium text-orange-600 transition hover:text-orange-700">
              View Recipe →
            </span>,
            'text-sm font-medium text-orange-600 transition hover:text-orange-700'
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeCardEnhanced;