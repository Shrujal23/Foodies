import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getCurrentUser } from '../services/authService';

const AddRecipe = () => {
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState({
    title: '',
    description: '',
    prepTime: '',
    cookTime: '',
    servings: '',
    ingredients: [''],
    instructions: [''],
    image: null
  });

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      toast.error('You must be logged in to create a recipe. Redirecting to login...', { duration: 3000 });
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipe(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleIngredientChange = (index, value) => {
    const newIngredients = [...recipe.ingredients];
    newIngredients[index] = value;
    setRecipe(prev => ({
      ...prev,
      ingredients: newIngredients
    }));
  };

  const addIngredient = () => {
    setRecipe(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, '']
    }));
  };

  const handleInstructionChange = (index, value) => {
    const newInstructions = [...recipe.instructions];
    newInstructions[index] = value;
    setRecipe(prev => ({
      ...prev,
      instructions: newInstructions
    }));
  };

  const addInstruction = () => {
    setRecipe(prev => ({
      ...prev,
      instructions: [...prev.instructions, '']
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setRecipe(prev => ({
      ...prev,
      image: file
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Build multipart form data so we can upload an image file
      const fd = new FormData();
      fd.append('title', recipe.title);
      fd.append('description', recipe.description);
      fd.append('prepTime', String(parseInt(recipe.prepTime || 0, 10)));
      fd.append('cookTime', String(parseInt(recipe.cookTime || 0, 10)));
      fd.append('servings', String(parseInt(recipe.servings || 0, 10)));
      fd.append('difficulty', 'Medium');
      fd.append('ingredients', JSON.stringify(recipe.ingredients.filter(ing => ing.trim() !== '')));
      fd.append('instructions', JSON.stringify(recipe.instructions.filter(inst => inst.trim() !== '')));

      if (recipe.image instanceof File) {
        fd.append('image', recipe.image);
      }

      console.log('Submitting recipe form data');

      const response = await fetch('http://localhost:5000/api/recipes', {
        method: 'POST',
        body: fd,
        credentials: 'include'
      });

      console.log('Response status:', response.status); // Debug log
      const responseData = await response.json();
      console.log('Response data:', responseData); // Debug log

      if (response.ok) {
        toast.success('Recipe created successfully!');
        navigate('/my-recipes');
      } else {
        throw new Error(responseData.error || 'Failed to create recipe');
      }
    } catch (error) {
      console.error('Error creating recipe:', error);
      toast.error(error.message || 'Failed to create recipe. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Add New Recipe</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Recipe Title</label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={recipe.title}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent-500 focus:ring-accent-500"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                id="description"
                name="description"
                rows="3"
                required
                value={recipe.description}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent-500 focus:ring-accent-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="prepTime" className="block text-sm font-medium text-gray-700">Prep Time (minutes)</label>
                <input
                  type="number"
                  id="prepTime"
                  name="prepTime"
                  required
                  value={recipe.prepTime}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent-500 focus:ring-accent-500"
                />
              </div>

              <div>
                <label htmlFor="cookTime" className="block text-sm font-medium text-gray-700">Cook Time (minutes)</label>
                <input
                  type="number"
                  id="cookTime"
                  name="cookTime"
                  required
                  value={recipe.cookTime}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent-500 focus:ring-accent-500"
                />
              </div>

              <div>
                <label htmlFor="servings" className="block text-sm font-medium text-gray-700">Servings</label>
                <input
                  type="number"
                  id="servings"
                  name="servings"
                  required
                  value={recipe.servings}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent-500 focus:ring-accent-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Ingredients */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Ingredients</h2>
          
          <div className="space-y-3">
            {recipe.ingredients.map((ingredient, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={ingredient}
                  onChange={(e) => handleIngredientChange(index, e.target.value)}
                  placeholder="e.g., 2 cups flour"
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-accent-500 focus:ring-accent-500"
                />
              </div>
            ))}
            
            <button
              type="button"
              onClick={addIngredient}
              className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-accent-700 bg-accent-100 hover:bg-accent-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500"
            >
              + Add Ingredient
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Instructions</h2>
          
          <div className="space-y-3">
            {recipe.instructions.map((instruction, index) => (
              <div key={index} className="flex gap-2">
                <span className="mt-3 text-gray-500">{index + 1}.</span>
                <textarea
                  value={instruction}
                  onChange={(e) => handleInstructionChange(index, e.target.value)}
                  placeholder="Add instruction step..."
                  rows="2"
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-accent-500 focus:ring-accent-500"
                />
              </div>
            ))}
            
            <button
              type="button"
              onClick={addInstruction}
              className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-accent-700 bg-accent-100 hover:bg-accent-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500"
            >
              + Add Step
            </button>
          </div>
        </div>

        {/* Image Upload */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recipe Image</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Upload Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-1 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-medium
                file:bg-accent-50 file:text-accent-700
                hover:file:bg-accent-100"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-accent-600 hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500"
          >
            Create Recipe
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddRecipe;