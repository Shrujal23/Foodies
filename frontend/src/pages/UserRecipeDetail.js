import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { API_BASE_URL, ASSET_BASE_URL } from '../config';
import { useAuth } from '../contexts/AuthContext';
import { apiFetch } from '../services/apiClient';
import ReviewsSection from '../components/recipes/ReviewsSection';
import ServingsMultiplier from '../components/recipes/ServingsMultiplier';
import BookmarkButton from '../components/recipes/BookmarkButton';
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  EmailShareButton,
  PinterestShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  EmailIcon,
  PinterestIcon
} from 'react-share';

const UserRecipeDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const initialRecipe = location.state?.recipe || null;
  const [recipe, setRecipe] = useState(initialRecipe);
  const [loading, setLoading] = useState(!initialRecipe);

  const getShareUrl = (recipeItem) => {
    if (!recipeItem?.id) return window.location.href;

    const recipeId = encodeURIComponent(recipeItem.id);
    const isExternalRecipe = String(recipeItem.id).startsWith('recipe_');
    const path = isExternalRecipe ? `/recipes/${recipeId}` : `/recipes/user/${recipeId}`;

    return `${window.location.origin}${path}`;
  };

  const shareUrl = recipe ? getShareUrl(recipe) : window.location.href;
  const shareTitle = recipe?.title ? `${recipe.title} on Foodies` : 'Check out this recipe on Foodies';

  const normalizeTextValue = (...values) => {
    for (const value of values) {
      if (typeof value === 'string' && value.trim()) return value.trim().replace(/\s+/g, ' ');
      if (Array.isArray(value)) {
        const match = value.find((entry) => typeof entry === 'string' && entry.trim());
        if (match) return match.trim().replace(/\s+/g, ' ');
      }
    }
    return '';
  };

  const normalizeTagList = (value) => {
    if (!value) return [];
    if (Array.isArray(value)) {
      return value
        .filter((entry) => typeof entry === 'string' && entry.trim())
        .map((entry) => entry.trim().replace(/\s+/g, ' '));
    }
    if (typeof value === 'string') {
      return value
        .split(/[,,;]/)
        .map((entry) => entry.trim())
        .filter(Boolean);
    }
    return [];
  };

  const toDisplayLabel = (value) => {
    if (!value) return '';
    return String(value)
      .replace(/_/g, ' ')
      .replace(/\s+/g, ' ')
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const recipeTitle = normalizeTextValue(recipe?.title, recipe?.label, recipe?.name, recipe?.recipeName) || 'Delicious Recipe';
  const recipeDescription = normalizeTextValue(recipe?.description, recipe?.summary, recipe?.notes, recipe?.about) ||
    (normalizeTextValue(recipe?.cuisine, recipe?.cuisineType, recipe?.cuisine_type) || normalizeTextValue(recipe?.source, recipe?.sourceName, recipe?.source_name)
      ? `${normalizeTextValue(recipe?.cuisine, recipe?.cuisineType, recipe?.cuisine_type) ? toDisplayLabel(normalizeTextValue(recipe?.cuisine, recipe?.cuisineType, recipe?.cuisine_type)) : 'Authentic'} recipe from ${normalizeTextValue(recipe?.source, recipe?.sourceName, recipe?.source_name) || 'our community'}`
      : '');
  const recipeCuisine = normalizeTextValue(recipe?.cuisine, recipe?.cuisineType, recipe?.cuisine_type, recipe?.cuisineName);
  const recipeSource = normalizeTextValue(recipe?.source, recipe?.sourceName, recipe?.source_name, 'Community Recipe');
  const recipeMealType = normalizeTextValue(recipe?.mealType, recipe?.mealTypes, recipe?.meal_type);
  const recipeDishType = normalizeTextValue(recipe?.dishType, recipe?.dishTypes, recipe?.dish_type);
  const recipeDietaryTags = normalizeTagList(recipe?.dietary_tags || recipe?.dietaryTags || recipe?.dietary || recipe?.dietLabels || recipe?.healthLabels).map((tag) => toDisplayLabel(tag));
  const recipeCalories = Number(recipe?.calories ?? recipe?.calories_kcal ?? recipe?.nutrition?.calories ?? 0);
  const sourceUrl = normalizeTextValue(recipe?.source_url || recipe?.sourceUrl || recipe?.url, recipe?.sourceUrl, recipe?.source_url);
  const recipeDifficulty = recipe?.difficulty || (recipe?.healthScore && recipe.healthScore > 70 ? 'Easy' : 'Medium');

  const formatTime = (value) => {
    if (!value && value !== 0) return '—';
    const num = Number(value);
    if (Number.isNaN(num)) return '—';
    return `${num} min`;
  };

  const formatDate = (value) => {
    if (!value) return 'Not available';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'Not available';
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const formatCalories = (value) => {
    if (!value && value !== 0) return 'Not provided';
    const num = Number(value);
    if (Number.isNaN(num) || num <= 0) return 'Not provided';
    return `${Math.round(num)} kcal`;
  };

  useEffect(() => {
    if (initialRecipe) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const isExternalRecipe = String(id).startsWith('recipe_');
        const endpoint = isExternalRecipe
          ? `${API_BASE_URL}/recipes/${encodeURIComponent(id)}`
          : `${API_BASE_URL}/recipes/user/${encodeURIComponent(id)}`;

        const recipeRes = await fetch(endpoint);
        if (!recipeRes.ok) throw new Error('Recipe not found');

        const responseData = await recipeRes.json();
        const recipeData = responseData.data || responseData;

        if (recipeData.image && !recipeData.image.startsWith('http')) {
          recipeData.image = `${ASSET_BASE_URL}${recipeData.image}`;
        }
        setRecipe(recipeData);
      } catch (err) {
        toast.error('Recipe not found');
        navigate('/recipes');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, initialRecipe, navigate]);

  const handleDeleteRecipe = async () => {
    if (!window.confirm('Delete this recipe permanently?')) return;
    try {
      const res = await apiFetch(`/recipes/delete-recipe/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        toast.success('Recipe deleted');
        navigate('/recipes');
      } else {
        const data = await res.json().catch(() => ({}));
        toast.error(data.message || 'Failed to delete recipe');
      }
    } catch (err) {
      toast.error('Failed to delete recipe');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fffaf7] dark:bg-gray-950">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!recipe) return null;

  const normalizeIngredients = (value) => {
    if (!value) return [];

    const formatIngredientObject = (item) => {
      if (!item || typeof item !== 'object') return '';

      if (typeof item.text === 'string' && item.text.trim()) return item.text.trim();
      if (typeof item.ingredient === 'string' && item.ingredient.trim()) return item.ingredient.trim();
      if (typeof item.food === 'string' && item.food.trim()) {
        const parts = [item.quantity, item.measure, item.food]
          .filter((part) => part !== null && part !== undefined && part !== '')
          .map((part) => String(part).trim())
          .filter(Boolean);
        return parts.join(' ');
      }

      const fallbackParts = [item.name, item.label, item.title, item.food, item.foodLabel, item.ingredientName]
        .filter((part) => typeof part === 'string' && part.trim())
        .map((part) => part.trim());

      return fallbackParts.join(' ');
    };

    if (Array.isArray(value)) {
      return value
        .map((item) => {
          if (typeof item === 'string') return item.trim();
          if (Array.isArray(item)) {
            return item.map((child) => formatIngredientObject(child)).filter(Boolean).join(' • ');
          }
          if (item && typeof item === 'object') {
            return formatIngredientObject(item);
          }
          return String(item);
        })
        .filter(Boolean);
    }

    if (typeof value === 'string') {
      try {
        return normalizeIngredients(JSON.parse(value));
      } catch {
        return value
          .split(/\n|;|•/)
          .map((item) => item.trim())
          .filter(Boolean);
      }
    }

    return [];
  };

  const normalizeInstructions = (value) => {
    if (!value) return [];

    if (Array.isArray(value)) {
      return value
        .map((item) => {
          if (typeof item === 'string') return item.trim();
          if (item && typeof item === 'object') {
            return [item.text, item.step, item.instructions].find((entry) => typeof entry === 'string' && entry.trim()) || '';
          }
          return '';
        })
        .filter(Boolean);
    }

    if (typeof value === 'string') {
      try {
        return normalizeInstructions(JSON.parse(value));
      } catch {
        return value
          .split(/\n/)
          .map((item) => item.trim())
          .filter(Boolean);
      }
    }

    return [];
  };

  const ingredients = normalizeIngredients(recipe.ingredients);
  const instructions = normalizeInstructions(recipe.instructions || recipe.instructionLines || []);

  return (
    <div className="min-h-screen bg-[#fffaf7] dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-10">

        <div className="relative mb-10 overflow-hidden rounded-[2rem] shadow-[0_20px_60px_rgba(87,43,19,0.12)]">
          <img
            src={recipe.image || 'https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80'}
            alt={recipe.title}
            className="h-96 w-full object-cover md:h-[500px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent"></div>

          <div className="absolute bottom-0 left-0 right-0 p-8 text-white sm:p-10 lg:p-12">
            <h1 className="mb-3 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
              {recipeTitle}
            </h1>
            {recipeDescription && (
              <p className="max-w-4xl text-lg opacity-95 sm:text-xl md:text-2xl">
                {recipeDescription}
              </p>
            )}
          </div>

          <div className="absolute left-6 top-6 rounded-full border border-white/30 bg-black/25 px-4 py-2 text-sm font-semibold text-white shadow-lg backdrop-blur sm:left-8 sm:top-8 sm:px-5 sm:py-3 sm:text-base">
            {recipeCuisine || recipeSource}
          </div>

          <div
            className="absolute right-6 top-6 rounded-full px-4 py-2 text-sm font-semibold text-white shadow-lg sm:right-8 sm:top-8 sm:px-5 sm:py-3 sm:text-lg"
            style={{
              backgroundColor:
                recipeDifficulty === 'Easy' ? '#10b981' :
                recipeDifficulty === 'Medium' ? '#f59e0b' : '#ef4444'
            }}
          >
            {recipeDifficulty}
          </div>
        </div>

        <div className="mb-8 flex flex-wrap gap-3">
          <div className="rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-medium text-orange-700 dark:border-orange-800/60 dark:bg-orange-900/20 dark:text-orange-300">
            {recipeSource}
          </div>
          {recipeCuisine && (
            <div className="rounded-full border border-pink-200 bg-pink-50 px-4 py-2 text-sm font-medium text-pink-700 dark:border-pink-800/60 dark:bg-pink-900/20 dark:text-pink-300">
              {recipeCuisine}
            </div>
          )}
        </div>

        <div className="mb-10 grid gap-4 md:grid-cols-3">
          <div className="rounded-[1.25rem] border border-[#f4ddce] bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Calories</p>
            <p className="mt-2 text-2xl font-bold text-orange-600">{formatCalories(recipeCalories)}</p>
          </div>
          <div className="rounded-[1.25rem] border border-[#f4ddce] bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Meal Type</p>
            <p className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">{recipeMealType || 'Not provided'}</p>
          </div>
          <div className="rounded-[1.25rem] border border-[#f4ddce] bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Dietary Tags</p>
            <p className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">
              {recipeDietaryTags.length > 0 ? recipeDietaryTags.join(' • ') : 'Not provided'}
            </p>
          </div>
        </div>

        <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:flex-wrap">
            <span className="font-medium text-gray-700 dark:text-gray-300">Share this recipe:</span>
            <div className="flex flex-wrap gap-3">
                <FacebookShareButton url={shareUrl} quote={shareTitle}>
                  <FacebookIcon size={40} round />
                </FacebookShareButton>
                <TwitterShareButton url={shareUrl} title={shareTitle}>
                  <TwitterIcon size={40} round />
                </TwitterShareButton>
                <WhatsappShareButton url={shareUrl} title={shareTitle}>
                  <WhatsappIcon size={40} round />
                </WhatsappShareButton>
                <PinterestShareButton url={shareUrl} media={recipe.image} description={shareTitle}>
                  <PinterestIcon size={40} round />
                </PinterestShareButton>
                <EmailShareButton url={shareUrl} subject={shareTitle}>
                  <EmailIcon size={40} round />
                </EmailShareButton>
              </div>

            <div className="flex items-center gap-2 border-l border-gray-300 pl-6 dark:border-gray-700">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Save to collection:</span>
              <BookmarkButton recipeId={recipe.id} />
            </div>
          </div>

          {user && user.id === recipe.user_id && (
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to={`/recipes/edit/${recipe.id}`}
                className="rounded-xl border border-gray-300 bg-white px-6 py-3 font-medium transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
              >
                Edit Recipe
              </Link>
              <button
                onClick={handleDeleteRecipe}
                className="rounded-xl bg-red-600 px-6 py-3 font-medium text-white transition hover:bg-red-700"
              >
                Delete Recipe
              </button>
            </div>
          )}

          <Link
            to="/recipes"
            className="flex items-center gap-2 font-medium text-orange-600 transition hover:text-orange-500"
          >
            Back to Recipes
          </Link>
        </div>

        <div className="grid gap-12 lg:grid-cols-3">

          <div className="lg:col-span-2 space-y-12">

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="rounded-[1.25rem] border border-[#f4ddce] bg-white p-5 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <div className="text-2xl font-bold text-orange-600 sm:text-3xl">{formatTime(recipe.prep_time || recipe.prepTime)}</div>
                <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">Prep Time</div>
              </div>
              <div className="rounded-[1.25rem] border border-[#f4ddce] bg-white p-5 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <div className="text-2xl font-bold text-orange-600 sm:text-3xl">{formatTime(recipe.cook_time || recipe.cookTime)}</div>
                <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">Cook Time</div>
              </div>
              <div className="rounded-[1.25rem] border border-[#f4ddce] bg-white p-5 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <div className="text-2xl font-bold text-orange-600 sm:text-3xl">{recipe.servings || recipe.yield || '—'}</div>
                <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">Servings</div>
              </div>
              <div className="rounded-[1.25rem] border border-[#f4ddce] bg-white p-5 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <div className="text-2xl font-bold text-orange-600 sm:text-3xl">
                  {formatTime((Number(recipe.prep_time || recipe.prepTime || 0) + Number(recipe.cook_time || recipe.cookTime || 0)))}
                </div>
                <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">Total Time</div>
              </div>
            </div>

            <ServingsMultiplier 
              originalServings={recipe.servings || recipe.yield || 1}
              ingredients={ingredients}
            />

            <div className="rounded-[1.5rem] border border-[#f4ddce] bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h2 className="mb-8 text-2xl font-bold text-gray-900 dark:text-white">Ingredients</h2>
              <ul className="space-y-4">
                {ingredients.length > 0 ? ingredients.map((ing, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                      {i + 1}
                    </div>
                    <span className="pt-1.5 text-lg text-gray-700 dark:text-gray-300">{ing}</span>
                  </li>
                )) : (
                  <li className="rounded-2xl border border-dashed border-orange-200 bg-orange-50 px-4 py-4 text-sm text-orange-700 dark:border-orange-800/60 dark:bg-orange-900/20 dark:text-orange-300">
                    Ingredients are not available for this recipe yet.
                  </li>
                )}
              </ul>
            </div>

            <div className="rounded-[1.5rem] border border-[#f4ddce] bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h2 className="mb-8 text-2xl font-bold text-gray-900 dark:text-white">Instructions</h2>
              {instructions.length > 0 ? (
                <ol className="space-y-8">
                  {instructions.map((step, i) => (
                    <li key={i} className="flex gap-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-pink-600 rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0 shadow-lg">
                        {i + 1}
                      </div>
                      <p className="pt-2 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                        {step}
                      </p>
                    </li>
                  ))}
                </ol>
              ) : (
                <div className="space-y-3 rounded-2xl border border-dashed border-orange-200 bg-orange-50 px-4 py-4 text-sm text-orange-700 dark:border-orange-800/60 dark:bg-orange-900/20 dark:text-orange-300">
                  <p>Instructions are not available for this recipe yet.</p>
                  {sourceUrl ? (
                    <a href={sourceUrl} target="_blank" rel="noreferrer" className="font-semibold text-orange-600 underline-offset-2 hover:underline">
                      View the original recipe source
                    </a>
                  ) : (
                    <p>We can pull fuller step-by-step instructions from a richer recipe source if you want that added.</p>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-8">
            <div className="rounded-[1.5rem] border border-[#f4ddce] bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h3 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">Recipe Info</h3>
              <div className="space-y-5 text-sm">
                <div>
                  <span className="text-gray-500">Cuisine</span>
                  <p className="font-medium text-gray-900 dark:text-gray-200">
                    {recipeCuisine || 'Not specified'}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Meal type</span>
                  <p className="font-medium text-gray-900 dark:text-gray-200">
                    {recipeMealType || 'Not specified'}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Dish type</span>
                  <p className="font-medium text-gray-900 dark:text-gray-200">
                    {recipeDishType || 'Not specified'}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Calories</span>
                  <p className="font-medium text-gray-900 dark:text-gray-200">
                    {formatCalories(recipeCalories)}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Original source</span>
                  {sourceUrl ? (
                    <a href={sourceUrl} target="_blank" rel="noreferrer" className="mt-1 block font-medium text-orange-600 underline-offset-2 hover:underline">
                      Open recipe link
                    </a>
                  ) : (
                    <p className="font-medium text-gray-900 dark:text-gray-200">Not provided</p>
                  )}
                </div>
                <div>
                  <span className="text-gray-500">Created</span>
                  <p className="font-medium text-gray-900 dark:text-gray-200">
                    {formatDate(recipe.created_at || recipe.createdAt)}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Last updated</span>
                  <p className="font-medium text-gray-900 dark:text-gray-200">
                    {formatDate(recipe.updated_at || recipe.updatedAt || recipe.created_at || recipe.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20">
          <ReviewsSection recipeId={id} />
        </div>
      </div>
    </div>
  );
};
export default UserRecipeDetail;