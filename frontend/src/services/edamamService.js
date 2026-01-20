const BASE_URL = 'https://api.edamam.com/api/recipes/v2';

// API credentials
const APP_ID = '368b75c9';
const APP_KEY = 'a838059b4d768c144297f65867ff6da4';

const transformRecipeData = (recipe) => {
  const cuisine = (recipe.cuisineType && recipe.cuisineType[0])
    ? String(recipe.cuisineType[0]).toLowerCase()
    : 'other';
  const normalizedHealth = (recipe.healthLabels || []).map(l => String(l).toLowerCase());
  const normalizedDiet = (recipe.dietLabels || []).map(l => String(l).toLowerCase());
  const dietary = new Set();
  if (normalizedDiet.includes('low-carb')) dietary.add('low-carb');
  if (normalizedHealth.includes('vegan')) dietary.add('vegan');
  if (normalizedHealth.includes('vegetarian')) dietary.add('vegetarian');
  if (normalizedHealth.includes('gluten-free')) dietary.add('gluten-free');

  // Derive a simple id from uri for routing convenience
  const idFromUri = recipe.uri?.split('#recipe_')[1] || recipe.uri;

  return {
    // Original fields
    uri: recipe.uri,
    label: recipe.label,
    image: recipe.images?.REGULAR?.url || recipe.image,
    source: recipe.source,
    url: recipe.url,
    dietLabels: recipe.dietLabels || [],
    healthLabels: recipe.healthLabels || [],
    calories: Math.round(recipe.calories),
    totalTime: recipe.totalTime || 0,
    ingredientLines: recipe.ingredientLines || [],
    author: {
      name: recipe.source || 'Unknown Source',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(recipe.source || 'Chef')}&background=random`
    },
    // Normalized fields used by Home page UI
    _id: idFromUri,
    title: recipe.label,
    description: recipe.source || 'View full recipe details',
    cuisine,
    dietary: Array.from(dietary),
    prepTime: 0,
    cookTime: recipe.totalTime || 0,
    rating: undefined,
  };
};

/**
 * Search Edamam recipes from external API
 * This is the legacy search function that only searches Edamam
 */
export const searchEdamamRecipes = async (query = '', filters = {}) => {
  try {
    const params = new URLSearchParams({
      type: 'public',
      q: query || 'main course',
      app_id: APP_ID,
      app_key: APP_KEY
    });

    // Apply filters
    if (filters.diet) {
      params.append('diet', filters.diet);
    }

    if (filters.health) {
      params.append('health', filters.health);
    }

    if (filters.cuisineType) {
      params.append('cuisineType', filters.cuisineType);
    }

    if (filters.mealType) {
      params.append('mealType', filters.mealType);
    }

    if (filters.dishType) {
      params.append('dishType', filters.dishType);
    }

    // Handle cooking time filter
    if (filters.cookingTime) {
      const maxTime = parseInt(filters.cookingTime);
      params.append('time', `1-${maxTime}`);
    }

    // Handle sorting
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'time':
          params.append('sort', 'time');
          break;
        case 'calories':
          params.append('sort', 'calories');
          break;
        case 'rating':
          params.append('sort', 'rating');
          break;
        default:
          // Default is relevance
          break;
      }
    }

    const url = `${BASE_URL}?${params.toString()}`;
    console.log('Fetching from:', url); // Debug log

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Edamam-Account-User': '368b75c9' // Using app_id as user ID
      }
    });
    const data = await response.json();

    console.log('Edamam API Response:', data); // Debug log

    if (!response.ok) {
      console.error('API Error Response:', data);
      throw new Error(data.message || 'Failed to fetch recipes');
    }

    if (data.hits && Array.isArray(data.hits)) {
      return {
        recipes: data.hits.map(hit => transformRecipeData(hit.recipe)),
        nextPage: data._links?.next?.href || null
      };
    } else {
      console.error('Unexpected API response format:', data);
      throw new Error('Invalid response format from API');
    }
  } catch (error) {
    console.error('Error fetching recipes:', error);
    throw error;
  }
};

export const getFeaturedRecipes = async () => {
  // Get a mix of different cuisine types for featured recipes
  const cuisines = ['pasta', 'chicken', 'salad', 'burger'];
  const promises = cuisines.map(cuisine => 
    searchEdamamRecipes(cuisine).then(data => {
      console.log(`Got data for ${cuisine}:`, data);
      return data.recipes[0];
    })
  );
  try {
    const recipes = await Promise.all(promises);
    return recipes.filter(Boolean); // Remove any null values
  } catch (error) {
    console.error('Error fetching featured recipes:', error);
    throw error;
  }
};

export const getRecipesByCategory = async (category) => {
  try {
    const { recipes } = await searchEdamamRecipes('', category);
    return recipes.slice(0, 8); // Return top 8 recipes for the category
  } catch (error) {
    console.error(`Error fetching ${category} recipes:`, error);
    throw error;
  }
};