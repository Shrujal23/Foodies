const axios = require('axios');

class EdamamService {
  constructor() {
    this.baseURL = 'https://api.edamam.com/api/recipes/v2';
    this.appId = process.env.EDAMAM_APP_ID;
    this.appKey = process.env.EDAMAM_APP_KEY;
  }

  async searchRecipes(query, options = {}) {
    try {
      const response = await axios.get(`${this.baseURL}`, {
        params: {
          type: 'public',
          q: query,
          app_id: this.appId,
          app_key: this.appKey,
          ...options
        },
        headers: {
          'User-Agent': 'Foodies-App/1.0',
          'Accept': 'application/json',
          'Edamam-Account-User': this.appId
        }
      });

      return this.formatRecipes(response.data);
    } catch (error) {
      console.error('Edamam API Error:', error.response?.data || error.message);
      throw new Error('Failed to search recipes');
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
          'Edamam-Account-User': this.appId
        }
      });

      return this.formatRecipe(response.data.recipe);
    } catch (error) {
      console.error('Edamam API Error:', error.response?.data || error.message);
      throw new Error('Failed to get recipe details');
    }
  }

  formatRecipes(data) {
    return {
      count: data.count,
      next: data._links?.next?.href || null,
      recipes: data.hits.map(hit => this.formatRecipe(hit.recipe))
    };
  }

  formatRecipe(recipe) {
    return {
      uri: recipe.uri,
      label: recipe.label,
      image: recipe.image,
      source: recipe.source,
      url: recipe.url,
      dietLabels: recipe.dietLabels,
      healthLabels: recipe.healthLabels,
      cautions: recipe.cautions,
      ingredientLines: recipe.ingredientLines,
      ingredients: recipe.ingredients,
      calories: recipe.calories,
      totalWeight: recipe.totalWeight,
      totalTime: recipe.totalTime,
      cuisineType: recipe.cuisineType,
      mealType: recipe.mealType,
      dishType: recipe.dishType,
      totalNutrients: recipe.totalNutrients
    };
  }
}

module.exports = new EdamamService();