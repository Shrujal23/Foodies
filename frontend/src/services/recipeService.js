import * as edamamService from './edamamService';
import { API_BASE_URL } from '../config';

export async function searchRecipes(query) {
  try {
    const { recipes } = await edamamService.searchRecipes(query);
    return { recipes };
  } catch (error) {
    console.error('Search error:', error);
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