import * as edamamService from './edamamService';
import { API_BASE_URL } from '../config';

// Helper to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Authentication required');
  
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// ====================== MAIN SEARCH ======================
export async function searchRecipes(query, filters = {}) {
  try {
    if (!query?.trim()) throw new Error('Search query is required');

    const params = new URLSearchParams({
      query: query.trim(),
      source: 'all'
    });

    // Add optional filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });

    const response = await fetch(`${API_BASE_URL}/recipes/search?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error(`Search failed: ${response.status}`);
    }

    const result = await response.json();
    
    return {
      success: true,
      hits: [
        ...(result.data?.userRecipes || []),
        ...(result.data?.edamamRecipes || [])
      ].map(recipe => ({ recipe }))
    };

  } catch (error) {
    console.error('Search error:', error);
    throw new Error(error.message || 'Failed to search recipes');
  }
}

// ====================== FEATURED RECIPES ======================
export async function getFeaturedRecipes(limit = 8) {
  try {
    const response = await fetch(`${API_BASE_URL}/recipes/featured?limit=${limit}`);
    
    if (!response.ok) throw new Error('Failed to fetch featured recipes');
    
    return await response.json();
  } catch (error) {
    console.error('Get featured recipes error:', error);
    throw error;
  }
}

// ====================== FAVORITES ======================
export async function getFavorites() {
  try {
    const response = await fetch(`${API_BASE_URL}/recipes/favorites`, {
      headers: getAuthHeaders()
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
    const response = await fetch(`${API_BASE_URL}/recipes/favorites`, {
      method: 'POST',
      headers: getAuthHeaders(),
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
    const response = await fetch(`${API_BASE_URL}/recipes/favorites/${recipeId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
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
    const response = await fetch(`${API_BASE_URL}/recipes/favorites/${recipeId}/status`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) throw new Error('Failed to check favorite status');
    return await response.json();
  } catch (error) {
    console.error('Check favorite status error:', error);
    throw error;
  }
}

// ====================== PUBLIC RECIPES ======================
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

// Legacy Edamam only search
export async function searchEdamamOnly(query, filters = {}) {
  try {
    const result = await edamamService.searchEdamamRecipes(query, filters);
    return {
      success: true,
      hits: result.recipes?.map(recipe => ({ recipe })) || []
    };
  } catch (error) {
    console.error('Edamam search error:', error);
    throw new Error('Failed to search Edamam recipes');
  }
}