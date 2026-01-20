import React, { useState, useEffect, useCallback } from 'react';
import { BookmarkIcon as BookmarkOutlineIcon } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../../config';

const RecipeCardEnhanced = ({ recipe, onSave, isSaved, onBookmarkChange }) => {
  const [rating, setRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const fetchRating = useCallback(async () => {
    try {
      const recipeId = recipe._id || recipe.id;
      const res = await fetch(`${API_BASE_URL}/recipes/${recipeId}/rating-breakdown`);
      if (res.ok) {
        const stats = await res.json();
        let totalRatings = 0;
        let totalScore = 0;
        for (let i = 1; i <= 5; i++) {
          totalScore += i * stats[i];
          totalRatings += stats[i];
        }
        const avg = totalRatings > 0 ? (totalScore / totalRatings).toFixed(1) : 0;
        setRating(parseFloat(avg));
        setReviewCount(totalRatings);
      }
    } catch (error) {
      console.error('Failed to fetch rating:', error);
    }
  }, [recipe]);

  useEffect(() => {
    if (recipe.id || recipe._id) {
      fetchRating();
    }
  }, [recipe, fetchRating]);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'medium': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      case 'hard': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
    }
  };

  const imageUrl = recipe.image || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800&q=80';
  const recipeLink = `/recipes/user/${recipe.id || recipe._id}`;

  return (
    <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-2xl transition overflow-hidden h-full flex flex-col">
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden bg-gray-200 dark:bg-gray-700">
        <Link to={recipeLink} className="block w-full h-full">
          <img
            src={imageUrl}
            alt={recipe.title}
            className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
          />
        </Link>
        
        {/* Difficulty Badge */}
        {recipe.difficulty && (
          <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(recipe.difficulty)}`}>
            {recipe.difficulty.charAt(0).toUpperCase() + recipe.difficulty.slice(1)}
          </div>
        )}

        {/* Rating Badge */}
        {rating > 0 && (
          <div className="absolute top-3 right-3 bg-orange-500 text-white px-3 py-1 rounded-lg text-sm font-semibold flex items-center gap-1 shadow-lg">
            ⭐ {rating}
            {reviewCount > 0 && (
              <span className="text-xs opacity-90">({reviewCount})</span>
            )}
          </div>
        )}

        {/* Bookmark Button - Bottom Left */}
        <div className="absolute bottom-3 left-3 z-30">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsBookmarked(!isBookmarked);
              onBookmarkChange?.(recipe, !isBookmarked);
            }}
            className="p-2 rounded-full bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 shadow-lg hover:shadow-xl transition transform hover:scale-110"
            aria-label="Bookmark recipe"
          >
            {isBookmarked ? (
              <BookmarkSolidIcon className="w-5 h-5 text-blue-500" />
            ) : (
              <BookmarkOutlineIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Title */}
        <Link to={recipeLink} className="mb-2">
          <h3 className="font-bold text-gray-900 dark:text-white line-clamp-2 hover:text-orange-500 transition">
            {recipe.title}
          </h3>
        </Link>

        {recipe.username && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
            👨‍🍳 By {recipe.display_name || recipe.username}
          </p>
        )}

        {/* Quick Info Badges */}
        <div className="flex flex-wrap gap-2 mb-4 text-xs">
          {recipe.prep_time && (
            <span className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-2.5 py-1 rounded-lg flex items-center gap-1">
              🕐 {recipe.prep_time}m prep
            </span>
          )}
          {recipe.cook_time && (
            <span className="bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 px-2.5 py-1 rounded-lg flex items-center gap-1">
              🔥 {recipe.cook_time}m cook
            </span>
          )}
          {recipe.servings && (
            <span className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 px-2.5 py-1 rounded-lg flex items-center gap-1">
              🍽️ {recipe.servings} servings
            </span>
          )}
        </div>

        {/* Cuisine & Ingredients */}
        {recipe.cuisine && (
          <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
            🌍 {recipe.cuisine}
          </p>
        )}

        {/* View Recipe Link */}
        <Link
          to={recipeLink}
          className="mt-auto px-4 py-2.5 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-pink-700 transition text-center w-full"
        >
          View Recipe
        </Link>
      </div>
    </div>
  );
};

export default RecipeCardEnhanced;
