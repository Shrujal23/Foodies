import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../config';
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

    const formData = new FormData();
    formData.append('title', recipe.title.trim());
    formData.append('description', recipe.description.trim());
    formData.append('prepTime', recipe.prepTime || 0);
    formData.append('cookTime', recipe.cookTime || 0);
    formData.append('servings', recipe.servings || 1);
    formData.append('difficulty', recipe.difficulty);
    formData.append('cuisine', recipe.cuisine);
    formData.append('ingredients', JSON.stringify(recipe.ingredients.filter(i => i.trim())));
    formData.append('instructions', JSON.stringify(recipe.instructions.filter(i => i.trim())));

    if (recipe.image) {
      formData.append('image', recipe.image);
    }

    try {
      const res = await fetch(`${API_BASE_URL}/recipes`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Your recipe has been published successfully!!!');
        navigate('/my-recipes');
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
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : !user ? (
        <div className="min-h-screen" />
      ) : (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12">
          <div className="max-w-4xl mx-auto px-6">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent mb-4">
                Share Your Recipe
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Let the community enjoy your creation
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10">

              {/* Image Upload */}
              <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8">
                <h2 className="text-2xl font-bold mb-6">Recipe Photo</h2>
                <div className="flex flex-col items-center">
                  {recipe.imagePreview ? (
                    <div className="relative rounded-2xl overflow-hidden shadow-lg">
                      <img
                        src={recipe.imagePreview}
                        alt="Preview"
                        className="max-h-96 w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setRecipe(prev => ({ ...prev, image: null, imagePreview: null }))}
                        className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-xl text-sm font-medium transition"
                      >
                        Remove Photo
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer w-full">
                      <div className="border-4 border-dashed border-gray-300 dark:border-gray-700 rounded-3xl h-80 flex flex-col items-center justify-center hover:border-orange-500 transition-colors">
                        <p className="text-lg font-medium text-gray-600 dark:text-gray-400">Click to select a photo</p>
                        <p className="text-sm text-gray-500 mt-2">PNG, JPG • Max 10MB</p>
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
              <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8">
                <h2 className="text-2xl font-bold mb-8">Basic Information</h2>
                <div className="space-y-6">
                  <input
                    type="text"
                    name="title"
                    required
                    value={recipe.title}
                    onChange={handleChange}
                    placeholder="Recipe Title *"
                    className="w-full px-6 py-4 text-lg rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500"
                  />

                  <textarea
                    name="description"
                    required
                    rows={4}
                    value={recipe.description}
                    onChange={handleChange}
                    placeholder="Brief description of your recipe... *"
                    className="w-full px-6 py-4 text-lg rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 resize-none"
                  />

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <input type="number" name="prepTime" placeholder="Prep Time (min)" value={recipe.prepTime} onChange={handleChange} className="px-6 py-4 rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500" required />
                    <input type="number" name="cookTime" placeholder="Cook Time (min)" value={recipe.cookTime} onChange={handleChange} className="px-6 py-4 rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500" required />
                    <input type="number" name="servings" placeholder="Servings" value={recipe.servings} onChange={handleChange} className="px-6 py-4 rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500" required />
                    
                    <select name="difficulty" value={recipe.difficulty} onChange={handleChange} className="px-6 py-4 rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500">
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Ingredients */}
              <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold">Ingredients</h2>
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
                    <div key={i} className="flex gap-3 items-center">
                      <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-xl flex items-center justify-center text-orange-600 font-bold flex-shrink-0">
                        {i + 1}
                      </div>
                      <input
                        type="text"
                        value={ing}
                        onChange={(e) => handleArrayChange(i, e.target.value, 'ingredients')}
                        placeholder="e.g., 2 cups all-purpose flour"
                        className="flex-1 px-6 py-4 rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500"
                      />
                      {recipe.ingredients.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeField(i, 'ingredients')}
                          className="text-red-500 hover:text-red-600 px-4"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold">Instructions</h2>
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
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-pink-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0 shadow">
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <textarea
                          value={step}
                          onChange={(e) => handleArrayChange(i, e.target.value, 'instructions')}
                          placeholder="Describe this step in detail..."
                          rows={3}
                          className="w-full px-6 py-4 rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 resize-none"
                        />
                        {recipe.instructions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeField(i, 'instructions')}
                            className="text-red-500 hover:text-red-600 text-sm mt-2"
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
              <div className="flex justify-center pt-8 pb-12">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-16 py-6 bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white text-xl font-bold rounded-2xl transition-all duration-200 shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
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