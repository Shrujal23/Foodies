const axios = require('axios');

class EdamamService {
  constructor() {
    this.baseURL = 'https://api.edamam.com/api/recipes/v2';
    this.appId = process.env.EDAMAM_APP_ID;
    this.appKey = process.env.EDAMAM_APP_KEY;
  }

  async searchRecipes(query, options = {}) {
    try {
      if (!this.appId || !this.appKey) {
        throw new Error('Edamam API credentials are missing');
      }

      const params = {
        type: 'public',
        q: query,
        app_id: this.appId,
        app_key: this.appKey,
        random: true,                   
        field: [
          'uri', 'label', 'image', 'source', 'url', 'ingredientLines',
          'ingredients', 'calories', 'totalTime', 'cuisineType',
          'mealType', 'dishType', 'dietLabels', 'healthLabels'
        ],
        ...options
      };

      // Strong Indian cuisine bias (since app is Indian-focused)
      if (!options.cuisineType) {
        params.cuisineType = 'indian';
      }

      console.log(`🔍 Searching Edamam for: "${query}" with cuisine=indian`);

      const response = await axios.get(this.baseURL, {
        params,
        timeout: 12000,
        headers: {
          'User-Agent': 'Foodies-App/1.0',
          'Accept': 'application/json',
        }
      });

      const result = this.formatRecipes(response.data);

      console.log(`Edamam returned ${result.recipes.length} recipes for "${query}"`);

      return result;

    } catch (error) {
      console.error('Edamam API Error:', {
        query,
        status: error.response?.status,
        data: error.response?.data || error.message
      });

      if (error.response?.status === 429) {
        throw new Error('Rate limit exceeded. Please try again in a few seconds.');
      }

      throw new Error(`Failed to search recipes: ${error.message}`);
    }
  }

  async getRecipeById(id) {
    try {
      const response = await axios.get(`${this.baseURL}/${id}`, {
        params: {
          type: 'public',
          app_id: this.appId,
          app_key: this.appKey
        },
        headers: {
          'User-Agent': 'Foodies-App/1.0',
          'Accept': 'application/json',
        }
      });

      return this.formatRecipe(response.data.recipe);
    } catch (error) {
      console.error('Edamam Get Recipe Error:', error.message);
      throw new Error('Failed to get recipe details');
    }
  }

  formatRecipes(data) {
    if (!data || !data.hits) {
      return { count: 0, next: null, recipes: [] };
    }

    return {
      count: data.count || data.hits.length,
      next: data._links?.next?.href || null,
      recipes: data.hits.map(hit => this.formatRecipe(hit.recipe))
    };
  }

  formatRecipe(recipe) {
    return {
      uri: recipe.uri,
      _id: recipe.uri.split('#')[1] || recipe.uri, // Extract ID
      label: recipe.label,
      image: recipe.image,
      source: recipe.source,
      url: recipe.url,
      dietLabels: recipe.dietLabels || [],
      healthLabels: recipe.healthLabels || [],
      ingredientLines: recipe.ingredientLines || [],
      ingredients: recipe.ingredients || [],
      calories: Math.round(recipe.calories || 0),
      totalTime: recipe.totalTime || 0,
      cuisineType: recipe.cuisineType || ['international'],
      mealType: recipe.mealType || [],
      dishType: recipe.dishType || [],
      totalNutrients: recipe.totalNutrients || {}
    };
  }
}

module.exports = new EdamamService();