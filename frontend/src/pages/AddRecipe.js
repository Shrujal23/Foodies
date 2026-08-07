import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { apiFetch } from '../services/apiClient';
import AuthWarningModal from '../components/common/AuthWarningModal';

const AddRecipe = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [showAuthWarning, setShowAuthWarning] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [recipe, setRecipe] = useState({
    title: '',
    description: '',
    prepTime: '',
    cookTime: '',
    servings: '',
    difficulty: 'Medium',
    cuisine: 'international',
    calories: '',
    mealType: '',
    dishType: '',
    dietaryTags: '',
    ingredients: [''],
    instructions: [''],
    image: null,
    imagePreview: null
  });

  // Check authentication
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setShowAuthWarning(true);
    }
  }, [user, authLoading]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipe(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (index, value, field) => {
    const updated = [...recipe[field]];
    updated[index] = value;
    setRecipe(prev => ({ ...prev, [field]: updated }));
  };

  const addField = (field) => {
    setRecipe(prev => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  const removeField = (index, field) => {
    if (recipe[field].length === 1) return;
    setRecipe(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Image must be smaller than 10MB");
        return;
      }
      const preview = URL.createObjectURL(file);
      setRecipe(prev => ({ ...prev, image: file, imagePreview: preview }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    // Validation
    if (!recipe.title.trim() || !recipe.description.trim()) {
      toast.error("Title and description are required");
      return;
    }
    if (!recipe.ingredients[0]?.trim()) {
      toast.error("At least one ingredient is required");
      return;
    }
    if (!recipe.instructions[0]?.trim()) {
      toast.error("At least one instruction step is required");
      return;
    }

    setSubmitting(true);

    const dietaryTags = recipe.dietaryTags
      .split(',')
      .map((entry) => entry.trim())
      .filter(Boolean);

    const formData = new FormData();
    formData.append('title', recipe.title.trim());
    formData.append('description', recipe.description.trim());
    formData.append('prepTime', recipe.prepTime || 0);
    formData.append('cookTime', recipe.cookTime || 0);
    formData.append('servings', recipe.servings || 1);
    formData.append('difficulty', recipe.difficulty);
    formData.append('cuisine', recipe.cuisine);
    formData.append('calories', recipe.calories || 0);
    formData.append('mealType', recipe.mealType || '');
    formData.append('dishType', recipe.dishType || '');
    formData.append('dietaryTags', JSON.stringify(dietaryTags));
    formData.append('ingredients', JSON.stringify(recipe.ingredients.filter(i => i.trim())));
    formData.append('instructions', JSON.stringify(recipe.instructions.filter(i => i.trim())));

    if (recipe.image) {
      formData.append('image', recipe.image);
    }

    try {
      // Auth cookie sent automatically via apiFetch (credentials: include)
      const res = await apiFetch('/recipes/create-recipe', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Your recipe has been published successfully!!!');
        navigate('/recipes');
      } else {
        toast.error(data.message || 'Failed to publish recipe');
      }
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <AuthWarningModal
        isOpen={showAuthWarning}
        onClose={() => navigate(-1)}
        onSignIn={() => navigate('/login', { state: { from: '/recipes/add' } })}
      />

      {authLoading ? (
        <div className="flex min-h-screen items-center justify-center bg-[#fffaf7] dark:bg-gray-950">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
        </div>
      ) : !user ? (
        <div className="min-h-screen" />
      ) : (
        <div className="min-h-screen bg-[#fffaf7] py-12 dark:bg-gray-950">
          <div className="mx-auto max-w-5xl px-6 sm:px-8 lg:px-10">
            {/* Header */}
            <div className="mb-10 text-center">
              <h1 className="mb-4 bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-4xl font-bold text-transparent sm:text-5xl">
                Share Your Recipe
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 sm:text-xl">
                Let the community enjoy your creation
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">

              {/* Image Upload */}
              <div className="rounded-[1.5rem] border border-[#f4ddce] bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-900">
                <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Recipe Photo</h2>
                <div className="flex flex-col items-center">
                  {recipe.imagePreview ? (
                    <div className="relative overflow-hidden rounded-[1.25rem] shadow-lg">
                      <img
                        src={recipe.imagePreview}
                        alt="Preview"
                        className="max-h-96 w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setRecipe(prev => ({ ...prev, image: null, imagePreview: null }))}
                        className="absolute right-4 top-4 rounded-xl bg-red-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-red-700"
                      >
                        Remove Photo
                      </button>
                    </div>
                  ) : (
                    <label className="w-full cursor-pointer">
                      <div className="flex h-80 flex-col items-center justify-center rounded-[1.5rem] border-2 border-dashed border-gray-300 transition-colors hover:border-orange-500 dark:border-gray-700">
                        <p className="text-lg font-medium text-gray-600 dark:text-gray-400">Click to select a photo</p>
                        <p className="mt-2 text-sm text-gray-500">PNG, JPG • Max 10MB</p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Basic Information */}
              <div className="rounded-[1.5rem] border border-[#f4ddce] bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-900">
                <h2 className="mb-8 text-2xl font-bold text-gray-900 dark:text-white">Basic Information</h2>
                <div className="space-y-6">
                  <input
                    type="text"
                    name="title"
                    required
                    value={recipe.title}
                    onChange={handleChange}
                    placeholder="Recipe Title *"
                    className="w-full rounded-2xl border border-gray-300 bg-white px-6 py-4 text-lg text-gray-900 focus:ring-2 focus:ring-orange-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />

                  <textarea
                    name="description"
                    required
                    rows={4}
                    value={recipe.description}
                    onChange={handleChange}
                    placeholder="Brief description of your recipe... *"
                    className="w-full resize-none rounded-2xl border border-gray-300 bg-white px-6 py-4 text-lg text-gray-900 focus:ring-2 focus:ring-orange-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />

                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
                    <input type="number" name="prepTime" placeholder="Prep Time (min)" value={recipe.prepTime} onChange={handleChange} className="rounded-2xl border border-gray-300 bg-white px-6 py-4 text-gray-900 focus:ring-2 focus:ring-orange-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white" required />
                    <input type="number" name="cookTime" placeholder="Cook Time (min)" value={recipe.cookTime} onChange={handleChange} className="rounded-2xl border border-gray-300 bg-white px-6 py-4 text-gray-900 focus:ring-2 focus:ring-orange-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white" required />
                    <input type="number" name="servings" placeholder="Servings" value={recipe.servings} onChange={handleChange} className="rounded-2xl border border-gray-300 bg-white px-6 py-4 text-gray-900 focus:ring-2 focus:ring-orange-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white" required />
                    
                    <select name="difficulty" value={recipe.difficulty} onChange={handleChange} className="rounded-2xl border border-gray-300 bg-white px-6 py-4 text-gray-900 focus:ring-2 focus:ring-orange-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>

                    <select name="cuisine" value={recipe.cuisine} onChange={handleChange} className="rounded-2xl border border-gray-300 bg-white px-6 py-4 text-gray-900 focus:ring-2 focus:ring-orange-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                      <option value="international">International</option>
                      <option value="american">American</option>
                      <option value="asian">Asian</option>
                      <option value="chinese">Chinese</option>
                      <option value="french">French</option>
                      <option value="indian">Indian</option>
                      <option value="italian">Italian</option>
                      <option value="japanese">Japanese</option>
                      <option value="mexican">Mexican</option>
                    </select>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
                    <input type="number" name="calories" placeholder="Calories (optional)" min="0" value={recipe.calories} onChange={handleChange} className="rounded-2xl border border-gray-300 bg-white px-6 py-4 text-gray-900 focus:ring-2 focus:ring-orange-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white" />

                    <select name="mealType" value={recipe.mealType} onChange={handleChange} className="rounded-2xl border border-gray-300 bg-white px-6 py-4 text-gray-900 focus:ring-2 focus:ring-orange-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                      <option value="">Meal Type</option>
                      <option value="breakfast">Breakfast</option>
                      <option value="brunch">Brunch</option>
                      <option value="lunch">Lunch</option>
                      <option value="high-tea">High Tea</option>
                      <option value="dinner">Dinner</option>
                      <option value="dessert">Dessert</option>
                      <option value="snack">Snack</option>
                      <option value="festival">Festival Special</option>
                    </select>

                    <select name="dishType" value={recipe.dishType} onChange={handleChange} className="rounded-2xl border border-gray-300 bg-white px-6 py-4 text-gray-900 focus:ring-2 focus:ring-orange-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                      <option value="">Dish Type</option>
                      <option value="Main Course">Main Course</option>
                      <option value="Rice Bowl">Rice Bowl</option>
                      <option value="Pulao">Pulao</option>
                      <option value="Biryani">Biryani</option>
                      <option value="Curry">Curry</option>
                      <option value="Dal">Dal</option>
                      <option value="Sabzi">Sabzi</option>
                      <option value="Paratha">Paratha</option>
                      <option value="Snacks">Snacks</option>
                      <option value="Chaat">Chaat</option>
                      <option value="Dessert">Dessert</option>
                      <option value="Soup">Soup</option>
                      <option value="Salad">Salad</option>
                      <option value="Side Dish">Side Dish</option>
                    </select>

                    <input type="text" name="dietaryTags" placeholder="Dietary tags" value={recipe.dietaryTags} onChange={handleChange} className="rounded-2xl border border-gray-300 bg-white px-6 py-4 text-gray-900 focus:ring-2 focus:ring-orange-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
                  </div>
                </div>
              </div>

              {/* Ingredients */}
              <div className="rounded-[1.5rem] border border-[#f4ddce] bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-900">
                <div className="mb-8 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Ingredients</h2>
                  <button
                    type="button"
                    onClick={() => addField('ingredients')}
                    className="px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-medium rounded-xl hover:from-orange-600 hover:to-pink-700 transition"
                  >
                    + Add Ingredient
                  </button>
                </div>

                <div className="space-y-4">
                  {recipe.ingredients.map((ing, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-orange-100 font-bold text-orange-600 dark:bg-orange-900">
                        {i + 1}
                      </div>
                      <input
                        type="text"
                        value={ing}
                        onChange={(e) => handleArrayChange(i, e.target.value, 'ingredients')}
                        placeholder="e.g., 2 cups all-purpose flour"
                        className="flex-1 rounded-2xl border border-gray-300 bg-white px-6 py-4 text-gray-900 focus:ring-2 focus:ring-orange-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                      />
                      {recipe.ingredients.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeField(i, 'ingredients')}
                          className="px-4 text-red-500 hover:text-red-600"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Instructions */}
              <div className="rounded-[1.5rem] border border-[#f4ddce] bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-900">
                <div className="mb-8 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Instructions</h2>
                  <button
                    type="button"
                    onClick={() => addField('instructions')}
                    className="px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-medium rounded-xl hover:from-orange-600 hover:to-pink-700 transition"
                  >
                    + Add Step
                  </button>
                </div>

                <div className="space-y-6">
                  {recipe.instructions.map((step, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-pink-600 text-xl font-bold text-white shadow">
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <textarea
                          value={step}
                          onChange={(e) => handleArrayChange(i, e.target.value, 'instructions')}
                          placeholder="Describe this step in detail..."
                          rows={3}
                          className="w-full resize-none rounded-2xl border border-gray-300 bg-white px-6 py-4 text-gray-900 focus:ring-2 focus:ring-orange-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                        />
                        {recipe.instructions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeField(i, 'instructions')}
                            className="mt-2 text-sm text-red-500 hover:text-red-600"
                          >
                            Remove step
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pb-8 pt-6">
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-2xl bg-gradient-to-r from-orange-500 to-pink-600 px-16 py-6 text-xl font-bold text-white shadow-lg transition-all duration-200 hover:from-orange-600 hover:to-pink-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {submitting ? 'Publishing Your Recipe...' : 'Publish Recipe'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddRecipe;