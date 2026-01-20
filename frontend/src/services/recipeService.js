import * as edamamService from './edamamService';
import { API_BASE_URL } from '../config';

/**
 * Combined search that searches both user-created recipes and external Edamam recipes
 * User recipes appear first in results if they match the query
 * Supports filtering by diet, health, cuisine, meal type, cooking time, and sorting
 */
export async function searchRecipes(query, filters = {}) {
  try {
    const params = new URLSearchParams({
      query: query.trim(),
      source: 'all' // Search both user and edamam recipes
    });

    // Add filter parameters if they have values
    if (filters.diet) params.append('diet', filters.diet);
    if (filters.health) params.append('health', filters.health);
    if (filters.cuisineType) params.append('cuisineType', filters.cuisineType);
    if (filters.mealType) params.append('mealType', filters.mealType);
    if (filters.cookingTime) params.append('cookingTime', filters.cookingTime);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit || 20);

    const response = await fetch(`${API_BASE_URL}/recipes/search?${params.toString()}`);
    if (!response.ok) throw new Error('Failed to search recipes');
    
    const result = await response.json();
    
    // Combine and return results
    return {
      hits: [
        ...(result.data?.userRecipes || []),
        ...(result.data?.edamamRecipes || [])
      ].map(recipe => ({
        recipe: recipe
      }))
    };
  } catch (error) {
    console.error('Search error:', error);
    throw new Error('Failed to search recipes');
  }
}

/**
 * Search only external Edamam recipes (legacy function)
 */
export async function searchEdamamOnly(query, filters = {}) {
  try {
    const result = await edamamService.searchEdamamRecipes(query, filters);
    return {
      hits: result.recipes.map(recipe => ({
        recipe: recipe
      }))
    };
  } catch (error) {
    console.error('Edamam search error:', error);
    throw new Error('Failed to search recipes');
  }
}

export async function getFavorites() {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No authentication token found');

    const response = await fetch(`${API_BASE_URL}/recipes/favorites`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to get favorites');
    return await response.json();
  } catch (error) {
    console.error('Get favorites error:', error);
    throw error;
  }
}

export async function addToFavorites(recipe) {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No authentication token found');

    const response = await fetch(`${API_BASE_URL}/recipes/favorites`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ recipe })
    });
    if (!response.ok) throw new Error('Failed to add to favorites');
    return await response.json();
  } catch (error) {
    console.error('Add to favorites error:', error);
    throw error;
  }
}

export async function removeFromFavorites(recipeId) {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No authentication token found');

    const response = await fetch(`${API_BASE_URL}/recipes/favorites/${recipeId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to remove from favorites');
    return await response.json();
  } catch (error) {
    console.error('Remove from favorites error:', error);
    throw error;
  }
}

export async function checkFavoriteStatus(recipeId) {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No authentication token found');

    const response = await fetch(`${API_BASE_URL}/recipes/favorites/${recipeId}/status`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to check favorite status');
    return await response.json();
  } catch (error) {
    console.error('Check favorite status error:', error);
    throw error;
  }
}

/**
 * Get all public user recipes (accessible to unauth users)
 */
export async function getAllPublicRecipes() {
  try {
    const response = await fetch(`${API_BASE_URL}/recipes/user-recipes`);
    if (!response.ok) throw new Error('Failed to fetch public recipes');
    return await response.json();
  } catch (error) {
    console.error('Get public recipes error:', error);
    throw error;
  }
}

/**
 * Get featured user recipes (accessible to unauth users)
 */
export async function getFeaturedRecipes(limit = 6) {
  try {
    const response = await fetch(`${API_BASE_URL}/recipes/featured?limit=${limit}`);
    if (!response.ok) throw new Error('Failed to fetch featured recipes');
    return await response.json();
  } catch (error) {
    console.error('Get featured recipes error:', error);
    throw error;
  }
}