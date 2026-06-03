import { API_BASE_URL } from '../config';

export async function searchRecipes(query, filters = {}) {
  try {
    const params = new URLSearchParams({
      query: query?.trim() || '',
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
    return result.data || { userRecipes: [], edamamRecipes: [] };
  } catch (error) {
    throw new Error(error.message || 'Failed to search recipes');
  }
}

export async function getFeaturedRecipes(limit = 8) {
    const response = await fetch(`${API_BASE_URL}/recipes/featured?limit=${limit}`);
    
    if (!response.ok) throw new Error('Failed to fetch featured recipes');
    
    return await response.json();
}
