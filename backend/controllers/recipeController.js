const edamamService = require('../services/edamamService');
const { pool } = require('../db/database');

/**
 * Search both Edamam recipes and user-created recipes
 * Returns combined results with user recipes appearing first if they match
 */
async function searchRecipes(req, res, next) {
  try {
    const { 
      query, 
      page = 1, 
      limit = 20, 
      source = 'all',
      // Filter parameters
      diet = '',
      health = '',
      cuisineType = '',
      mealType = '',
      cookingTime = '',
      sortBy = 'relevance'
    } = req.query;
    
    if (!query || query.trim().length === 0) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'Search query is required'
      });
    }

    const searchQuery = query.trim().toLowerCase();
    let results = {
      userRecipes: [],
      edamamRecipes: [],
      total: 0
    };

    // Search user-created recipes from database
    if (source === 'all' || source === 'user') {
      try {
        const [userRecipes] = await pool.execute(`
          SELECT ur.*, u.username, u.display_name, u.avatar_url,
                 (SELECT COUNT(*) FROM user_favorites WHERE recipe_id = ur.id) as favorite_count,
                 (SELECT COUNT(*) FROM recipe_comments WHERE recipe_id = ur.id) as comment_count
          FROM user_recipes ur
          LEFT JOIN users u ON ur.user_id = u.id
          WHERE LOWER(ur.title) LIKE ? OR LOWER(ur.description) LIKE ? OR LOWER(ur.ingredients) LIKE ?
          ORDER BY ur.created_at DESC
          LIMIT ?
        `, [`%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`, limit]);

        results.userRecipes = userRecipes.map(recipe => ({
          ...recipe,
          source: 'user',
          _id: recipe.id,
          title: recipe.title,
          image: recipe.image,
          prepTime: recipe.prep_time,
          cookTime: recipe.cook_time,
          author: {
            name: recipe.display_name || recipe.username || 'Anonymous',
            avatar: recipe.avatar_url
          }
        }));
      } catch (error) {
        console.error('User recipe search error:', error);
      }
    }

    // Search Edamam recipes with filters
    if (source === 'all' || source === 'edamam') {
      try {
        const filters = {};
        
        // Apply filters only if they have values
        if (diet) filters.diet = diet;
        if (health) filters.health = health;
        if (cuisineType) filters.cuisineType = cuisineType;
        if (mealType) filters.mealType = mealType;
        if (cookingTime) filters.cookingTime = cookingTime;
        if (sortBy && sortBy !== 'relevance') filters.sortBy = sortBy;

        const edamamResult = await edamamService.searchRecipes(searchQuery, {
          from: (page - 1) * limit,
          to: page * limit,
          ...filters
        });

        results.edamamRecipes = edamamResult.recipes || [];
      } catch (error) {
        console.error('Edamam search error:', error);
        // Don't fail completely if Edamam is unavailable
      }
    }

    results.total = results.userRecipes.length + results.edamamRecipes.length;

    res.json({
      success: true,
      statusCode: 200,
      message: 'Search completed',
      data: results
    });
  } catch (error) {
    console.error('Search Error:', error);
    next(error);
  }
}

async function getRecipeById(req, res, next) {
  try {
    const { id } = req.params;
    const recipe = await edamamService.getRecipeById(id);
    res.json({
      success: true,
      statusCode: 200,
      data: recipe
    });
  } catch (error) {
    console.error('Get Recipe Error:', error);
    next(error);
  }
}

async function getFavoriteRecipes(req, res) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const [rows] = await pool.execute(
      `SELECT r.*, uf.created_at as favorited_at 
       FROM recipes r
       INNER JOIN user_favorites uf ON r.recipe_id = uf.recipe_id
       WHERE uf.user_id = ?
       ORDER BY uf.created_at DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (error) {
    console.error('Get Favorites Error:', error);
    res.status(500).json({ error: 'Failed to get favorite recipes' });
  }
}

async function addToFavorites(req, res) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const { recipe } = req.body;
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // Check if recipe exists in recipes table
    const [existingRecipe] = await connection.execute(
      'SELECT recipe_id FROM recipes WHERE recipe_id = ?',
      [recipe.uri]
    );

    // If recipe doesn't exist, insert it
    if (existingRecipe.length === 0) {
      await connection.execute(
        `INSERT INTO recipes (recipe_id, label, image, source, url)
         VALUES (?, ?, ?, ?, ?)`,
        [recipe.uri, recipe.label, recipe.image, recipe.source, recipe.url]
      );
    }

    // Add to user_favorites
    await connection.execute(
      `INSERT INTO user_favorites (user_id, recipe_id)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE created_at = CURRENT_TIMESTAMP`,
      [req.user.id, recipe.uri]
    );

    await connection.commit();
    res.json({ message: 'Recipe added to favorites' });
  } catch (error) {
    await connection.rollback();
    console.error('Add to Favorites Error:', error);
    res.status(500).json({ error: 'Failed to add recipe to favorites' });
  } finally {
    connection.release();
  }
}

async function removeFromFavorites(req, res) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const { recipeId } = req.params;
    await pool.execute(
      'DELETE FROM user_favorites WHERE user_id = ? AND recipe_id = ?',
      [req.user.id, recipeId]
    );
    res.json({ message: 'Recipe removed from favorites' });
  } catch (error) {
    console.error('Remove from Favorites Error:', error);
    res.status(500).json({ error: 'Failed to remove recipe from favorites' });
  }
}

async function checkFavoriteStatus(req, res) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const { recipeId } = req.params;
    const [rows] = await pool.execute(
      'SELECT 1 FROM user_favorites WHERE user_id = ? AND recipe_id = ?',
      [req.user.id, recipeId]
    );
    res.json({ isFavorite: rows.length > 0 });
  } catch (error) {
    console.error('Check Favorite Status Error:', error);
    res.status(500).json({ error: 'Failed to check favorite status' });
  }
}

async function createUserRecipe(req, res) {
  console.log('Create recipe request received:', req.body); // Debug log
  console.log('User in request:', req.user); // Debug log

  if (!req.user) {
    console.log('Authentication check failed - no user in request'); // Debug log
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    // For multipart/form-data, fields are on req.body and file is on req.file
    const { title, description } = req.body;
    const prepTime = parseInt(req.body.prepTime, 10);
    const cookTime = parseInt(req.body.cookTime, 10);
    const servings = parseInt(req.body.servings, 10);
    const ingredients = req.body.ingredients ? JSON.parse(req.body.ingredients) : [];
    const instructions = req.body.instructions ? JSON.parse(req.body.instructions) : [];
    const difficulty = req.body.difficulty;
    const cuisine = req.body.cuisine;
    // image may be provided via file upload (req.file) or as a string
    const imageFromBody = req.body.image;
    const image = req.file ? `/uploads/${req.file.filename}` : (imageFromBody || null);

    // Debug log
    console.log('Parsed recipe data:', {
      title,
      description,
      prepTime,
      cookTime,
      servings,
      ingredients,
      instructions,
      difficulty,
      cuisine,
      image
    });

    // Validate required fields
    if (!title || !description || !prepTime || !cookTime || !servings || !ingredients || !instructions) {
      console.log('Validation failed - missing required fields'); // Debug log
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Insert the recipe
    console.log('Attempting to insert recipe into database...'); // Debug log

    // Sanitize inputs for DB binding: convert undefined to null and ensure JSON strings
  const ingredientsJson = JSON.stringify(ingredients || []);
  const instructionsJson = JSON.stringify(instructions || []);
  const imageValue = (typeof image === 'string' && image.length > 0) ? image : null;
    const difficultyValue = difficulty || 'Medium';
    const cuisineValue = cuisine || 'international';

    const params = [
      req.user.id,
      title,
      description,
      prepTime,
      cookTime,
      servings,
      ingredientsJson,
      instructionsJson,
      imageValue,
      difficultyValue,
      cuisineValue
    ];

  console.log('DB insert params:', params);

    const [result] = await pool.execute(
      `INSERT INTO user_recipes (user_id, title, description, prep_time, cook_time, servings, ingredients, instructions, image, difficulty, cuisine)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      params
    );

    console.log('Recipe inserted, result:', result); // Debug log

    // Get the created recipe
    const [rows] = await pool.execute(
      'SELECT * FROM user_recipes WHERE id = ?',
      [result.insertId]
    );

    console.log('Retrieved created recipe:', rows[0]); // Debug log
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Create User Recipe Error:', error);
    // Log full stack for debugging
    if (error && error.stack) console.error(error.stack);
    // In development return the actual error message to the client to aid debugging
    res.status(500).json({ error: error.message || 'Failed to create recipe' });
  }
}

async function getUserRecipes(req, res) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const [rows] = await pool.execute(
      'SELECT * FROM user_recipes WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(rows);
  } catch (error) {
    console.error('Get User Recipes Error:', error);
    res.status(500).json({ error: 'Failed to get user recipes' });
  }
}

async function getAllPublicUserRecipes(req, res) {
  try {
    const [rows] = await pool.execute(
      `SELECT ur.*, u.username, u.display_name, u.avatar_url
       FROM user_recipes ur
       JOIN users u ON ur.user_id = u.id
       ORDER BY ur.created_at DESC`
    );
    res.json(rows);
  } catch (error) {
    console.error('Get All User Recipes Error:', error);
    res.status(500).json({ error: 'Failed to get recipes' });
  }
}

async function getPublicUserRecipeById(req, res) {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute(
      `SELECT ur.*, u.username, u.display_name, u.avatar_url
       FROM user_recipes ur
       JOIN users u ON ur.user_id = u.id
       WHERE ur.id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    return res.json(rows[0]);
  } catch (error) {
    console.error('Get Public User Recipe Error:', error);
    return res.status(500).json({ error: 'Failed to get recipe' });
  }
}

async function updateUserRecipe(req, res) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
  const { id } = req.params;
  const { title, description } = req.body;
  const prepTime = parseInt(req.body.prepTime, 10);
  const cookTime = parseInt(req.body.cookTime, 10);
  const servings = parseInt(req.body.servings, 10);
  const ingredients = req.body.ingredients ? JSON.parse(req.body.ingredients) : [];
  const instructions = req.body.instructions ? JSON.parse(req.body.instructions) : [];
  const difficulty = req.body.difficulty;
  const imageFromBody = req.body.image;
  const image = req.file ? `/uploads/${req.file.filename}` : (imageFromBody || null);

    // Check if recipe exists and belongs to user
    const [existing] = await pool.execute(
      'SELECT id FROM user_recipes WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    // Update the recipe
  const updateIngredientsJson = JSON.stringify(ingredients || []);
  const updateInstructionsJson = JSON.stringify(instructions || []);
  const updateImageValue = (typeof image === 'string' && image.length > 0) ? image : null;
  const updateDifficultyValue = difficulty || 'Medium';

  await pool.execute(
    `UPDATE user_recipes
     SET title = ?, description = ?, prep_time = ?, cook_time = ?, servings = ?,
       ingredients = ?, instructions = ?, image = ?, difficulty = ?
     WHERE id = ? AND user_id = ?`,
    [title, description, prepTime, cookTime, servings,
     updateIngredientsJson, updateInstructionsJson, updateImageValue, updateDifficultyValue,
     id, req.user.id]
  );

    // Get updated recipe
    const [rows] = await pool.execute(
      'SELECT * FROM user_recipes WHERE id = ?',
      [id]
    );

    res.json(rows[0]);
  } catch (error) {
    console.error('Update User Recipe Error:', error);
    res.status(500).json({ error: 'Failed to update recipe' });
  }
}

async function deleteUserRecipe(req, res) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const { id } = req.params;

    // Check if recipe exists and belongs to user
    const [existing] = await pool.execute(
      'SELECT id FROM user_recipes WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    // Delete the recipe
    await pool.execute(
      'DELETE FROM user_recipes WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    );

    res.json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    console.error('Delete User Recipe Error:', error);
    res.status(500).json({ error: 'Failed to delete recipe' });
  }
}

async function getFeaturedRecipes(req, res) {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 6, 20);
    const [rows] = await pool.execute(
      `SELECT ur.*, u.username, u.display_name, u.avatar_url,
              (SELECT COUNT(*) FROM user_favorites WHERE recipe_id = ur.id) as favorite_count,
              (SELECT COUNT(*) FROM recipe_comments WHERE recipe_id = ur.id) as comment_count
       FROM user_recipes ur
       JOIN users u ON ur.user_id = u.id
       ORDER BY ur.created_at DESC
       LIMIT ?`,
      [limit]
    );
    
    res.json(rows.map(recipe => ({
      ...recipe,
      _id: recipe.id,
      source: 'user',
      rating: 4.5, // Default rating
      servings: recipe.servings || 4,
      prepTime: recipe.prep_time,
      cookTime: recipe.cook_time
    })));
  } catch (error) {
    console.error('Get Featured Recipes Error:', error);
    res.status(500).json({ error: 'Failed to get featured recipes' });
  }
}

module.exports = {
  searchRecipes,
  getRecipeById,
  getFavoriteRecipes,
  addToFavorites,
  removeFromFavorites,
  checkFavoriteStatus,
  createUserRecipe,
  getUserRecipes,
  getAllPublicUserRecipes,
  getPublicUserRecipeById,
  updateUserRecipe,
  deleteUserRecipe,
  getFeaturedRecipes
};
