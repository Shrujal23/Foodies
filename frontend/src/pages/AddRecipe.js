import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getCurrentUser } from '../services/authService';
import { API_BASE_URL } from '../config';

const AddRecipe = () => {
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState({
    title: '',
    description: '',
    prepTime: '',
    cookTime: '',
    servings: '',
    difficulty: 'Medium',
    ingredients: [''],
    instructions: [''],
    image: null,
    imagePreview: null
  });

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      toast.error('Please log in to create a recipe');
      setTimeout(() => navigate('/login'), 1500);
    }
  }, [navigate]);

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
    setRecipe(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setRecipe(prev => ({ ...prev, image: file, imagePreview: preview }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append('title', recipe.title);
    fd.append('description', recipe.description);
    fd.append('prepTime', recipe.prepTime || '0');
    fd.append('cookTime', recipe.cookTime || '0');
    fd.append('servings', recipe.servings || '1');
    fd.append('difficulty', recipe.difficulty);
    fd.append('ingredients', JSON.stringify(recipe.ingredients.filter(i => i.trim())));
    fd.append('instructions', JSON.stringify(recipe.instructions.filter(i => i.trim())));
    if (recipe.image) fd.append('image', recipe.image);

    try {
      const res = await fetch(`${API_BASE_URL}/recipes`, {
        method: 'POST',
        body: fd,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (res.ok) {
        toast.success('Recipe created successfully!');
        navigate('/my-recipes');
      } else {
        const err = await res.json();
        throw new Error(err.error || 'Failed to create recipe');
      }
    } catch (err) {
      toast.error(err.message || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12">
      <div className="max-w-5xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent">
            Create New Recipe
          </h1>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-400">
            Share your culinary masterpiece with the world
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">

          {/* Image Upload Card */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Recipe Photo</h2>
            <div className="flex flex-col items-center">
              {recipe.imagePreview ? (
                <div className="relative">
                  <img
                    src={recipe.imagePreview}
                    alt="Preview"
                    className="w-full max-w-2xl h-96 object-cover rounded-2xl shadow-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setRecipe(prev => ({ ...prev, image: null, imagePreview: null }))}
                    className="absolute top-4 right-4 bg-red-600 text-white p-3 rounded-full hover:bg-red-700 transition"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer">
                  <div className="border-4 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl w-full h-96 flex flex-col items-center justify-center hover:border-orange-500 transition">
                    <svg className="w-20 h-20 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
                      Click to upload a beautiful photo
                    </p>
                    <p className="text-sm text-gray-500 mt-2">PNG, JPG up to 10MB</p>
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

          {/* Basic Info */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8">
            <h2 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white">Basic Information</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Recipe Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  value={recipe.title}
                  onChange={handleChange}
                  placeholder="e.g., Classic Chocolate Chip Cookies"
                  className="w-full px-5 py-4 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition text-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                <textarea
                  name="description"
                  rows="4"
                  required
                  value={recipe.description}
                  onChange={handleChange}
                  placeholder="Tell us what makes this recipe special..."
                  className="w-full px-5 py-4 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition text-lg resize-none"
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Prep Time (min)</label>
                  <input
                    type="number"
                    name="prepTime"
                    required
                    value={recipe.prepTime}
                    onChange={handleChange}
                    className="w-full px-5 py-4 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition text-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cook Time (min)</label>
                  <input
                    type="number"
                    name="cookTime"
                    required
                    value={recipe.cookTime}
                    onChange={handleChange}
                    className="w-full px-5 py-4 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition text-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Servings</label>
                  <input
                    type="number"
                    name="servings"
                    required
                    value={recipe.servings}
                    onChange={handleChange}
                    className="w-full px-5 py-4 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition text-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Difficulty</label>
                  <select
                    name="difficulty"
                    value={recipe.difficulty}
                    onChange={handleChange}
                    className="w-full px-5 py-4 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition text-lg"
                  >
                    <option>Easy</option>
                    <option>Medium</option>
                    <option>Hard</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Ingredients */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Ingredients</h2>
              <button
                type="button"
                onClick={() => addField('ingredients')}
                className="px-5 py-3 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-medium rounded-xl hover:from-orange-600 hover:to-pink-700 transition shadow-lg"
              >
                + Add Ingredient
              </button>
            </div>
            <div className="space-y-4">
              {recipe.ingredients.map((ing, i) => (
                <div key={i} className="flex gap-3 items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {i + 1}
                  </div>
                  <input
                    type="text"
                    value={ing}
                    onChange={(e) => handleArrayChange(i, e.target.value, 'ingredients')}
                    placeholder="e.g., 2 cups all-purpose flour"
                    className="flex-1 px-5 py-4 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition text-lg"
                  />
                  {recipe.ingredients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeField(i, 'ingredients')}
                      className="text-red-600 hover:text-red-700 p-3"
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
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Instructions</h2>
              <button
                type="button"
                onClick={() => addField('instructions')}
                className="px-5 py-3 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-medium rounded-xl hover:from-orange-600 hover:to-pink-700 transition shadow-lg"
              >
                + Add Step
              </button>
            </div>
            <div className="space-y-6">
              {recipe.instructions.map((step, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-pink-600 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0 shadow-lg">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={step}
                      onChange={(e) => handleArrayChange(i, e.target.value, 'instructions')}
                      placeholder="Describe this step clearly..."
                      rows="3"
                      className="w-full px-5 py-4 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition text-lg resize-none"
                    />
                    {recipe.instructions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeField(i, 'instructions')}
                        className="text-red-600 hover:text-red-700 text-sm font-medium mt-2"
                      >
                        Remove step
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-center pt-8">
            <button
              type="submit"
              className="px-12 py-5 bg-gradient-to-r from-orange-500 to-pink-600 text-white text-xl font-bold rounded-2xl hover:from-orange-600 hover:to-pink-700 transform hover:scale-105 transition-all duration-200 shadow-2xl"
            >
              Publish Recipe
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRecipe;