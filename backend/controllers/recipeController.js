const edamamService = require('../services/edamamService');
const { pool } = require('../db/database');

/* ====================== SEARCH RECIPES ====================== */
async function searchRecipes(req, res, next) {
  try {
    const { 
      query, 
      page = 1, 
      limit = 20, 
      source = 'all',
      cuisineType = '',
      diet = '',
      mealType = '',
      health = ''
    } = req.query;

    if (!query || query.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const searchQuery = query.trim();
    let results = {
      userRecipes: [],
      edamamRecipes: [],
      total: 0
    };

    // User Recipes
    if (source === 'all' || source === 'user') {
      try {
        const safeLimit = Math.min(parseInt(limit, 10) || 20, 50);
        const [userRecipes] = await pool.execute(`
          SELECT ur.*, u.username, u.display_name, u.avatar_url,
                 (SELECT COUNT(*) FROM user_favorites WHERE recipe_id = ur.id) as favorite_count
          FROM user_recipes ur
          LEFT JOIN users u ON ur.user_id = u.id
          WHERE LOWER(ur.title) LIKE ? 
             OR LOWER(ur.description) LIKE ? 
             OR LOWER(ur.ingredients) LIKE ?
          ORDER BY ur.created_at DESC
          LIMIT ${safeLimit}
        `, [`%${searchQuery.toLowerCase()}%`, `%${searchQuery.toLowerCase()}%`, `%${searchQuery.toLowerCase()}%`]);

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

    // Edamam Recipes
    if (source === 'all' || source === 'edamam') {
      try {
        const filters = {};
        if (cuisineType) filters.cuisineType = cuisineType;
        if (diet) filters.diet = diet;
        if (mealType) filters.mealType = mealType;
        if (health) filters.health = health;

        const edamamResult = await edamamService.searchRecipes(searchQuery, {
          from: (page - 1) * limit,
          to: page * limit,
          random: true,
          ...filters
        });

        results.edamamRecipes = edamamResult.recipes || [];
      } catch (error) {
        console.error('Edamam search error:', error.message);
      }
    }

    results.total = results.userRecipes.length + results.edamamRecipes.length;

    res.json({
      success: true,
      message: `Found ${results.total} recipes`,
      data: results
    });

  } catch (error) {
    console.error('Search Controller Error:', error);
    next(error);
  }
}

/* ====================== FEATURED RECIPES ====================== */
async function getFeaturedRecipes(req, res) {
  try {
    const safeLimit = Math.min(parseInt(req.query.limit, 10) || 8, 20);

    const [rows] = await pool.execute(`
      SELECT ur.*, u.username, u.display_name, u.avatar_url
      FROM user_recipes ur
      LEFT JOIN users u ON ur.user_id = u.id
      ORDER BY ur.created_at DESC
      LIMIT ${safeLimit}
    `);

    res.json(rows.map(recipe => ({
      ...recipe,
      _id: recipe.id,
      source: 'user',
      rating: 4.5,
      prepTime: recipe.prep_time,
      cookTime: recipe.cook_time,
    })));
  } catch (error) {
    console.error('Get Featured Recipes Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch featured recipes' });
  }
}

/* ====================== GET SINGLE RECIPE ====================== */
async function getRecipeById(req, res, next) {
  try {
    const { id } = req.params;
    const recipe = await edamamService.getRecipeById(id);
    res.json({ success: true, data: recipe });
  } catch (error) {
    console.error('Get Recipe Error:', error);
    next(error);
  }
}

/* ====================== FAVORITES ====================== */
async function getFavoriteRecipes(req, res) {
  if (!req.user) return res.status(401).json({ error: 'Authentication required' });

  try {
    const [rows] = await pool.execute(`
      SELECT r.*, uf.created_at as favorited_at 
      FROM recipes r
      INNER JOIN user_favorites uf ON r.recipe_id = uf.recipe_id
      WHERE uf.user_id = ?
      ORDER BY uf.created_at DESC
    `, [req.user.id]);
    res.json(rows);
  } catch (error) {
    console.error('Get Favorites Error:', error);
    res.status(500).json({ error: 'Failed to get favorites' });
  }
}

async function addToFavorites(req, res) {
  if (!req.user) return res.status(401).json({ error: 'Authentication required' });

  const { recipe } = req.body;
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [existing] = await connection.execute(
      'SELECT recipe_id FROM recipes WHERE recipe_id = ?',
      [recipe.uri]
    );

    if (existing.length === 0) {
      await connection.execute(
        `INSERT INTO recipes (recipe_id, label, image, source, url)
         VALUES (?, ?, ?, ?, ?)`,
        [recipe.uri, recipe.label, recipe.image, recipe.source, recipe.url]
      );
    }

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
    res.status(500).json({ error: 'Failed to add to favorites' });
  } finally {
    connection.release();
  }
}

async function removeFromFavorites(req, res) {
  if (!req.user) return res.status(401).json({ error: 'Authentication required' });

  try {
    const { recipeId } = req.params;
    await pool.execute(
      'DELETE FROM user_favorites WHERE user_id = ? AND recipe_id = ?',
      [req.user.id, recipeId]
    );
    res.json({ message: 'Recipe removed from favorites' });
  } catch (error) {
    console.error('Remove from Favorites Error:', error);
    res.status(500).json({ error: 'Failed to remove from favorites' });
  }
}

async function checkFavoriteStatus(req, res) {
  if (!req.user) return res.status(401).json({ error: 'Authentication required' });

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

/* ====================== USER RECIPES CRUD ====================== */

async function createUserRecipe(req, res, next) {
  if (!req.user) return res.status(401).json({ success: false, message: 'Authentication required' });
  
  try {
    const {
      title,
      description,
      ingredients,
      instructions,
      servings,
      cuisine
    } = req.body;

    const prep_time = parseInt(req.body.prepTime || req.body.prep_time || 0, 10);
    const cook_time = parseInt(req.body.cookTime || req.body.cook_time || 0, 10);
    const final_servings = parseInt(servings || 1, 10);

    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const [result] = await pool.execute(
      `INSERT INTO user_recipes 
       (user_id, title, description, ingredients, instructions, prep_time, cook_time, servings, cuisine, image)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.user.id,
        title,
        description,
        ingredients,
        instructions,
        prep_time,
        cook_time,
        final_servings,
        cuisine || 'international',
        image
      ]
    );

    res.status(201).json({ 
      success: true, 
      message: 'Recipe created successfully',
      recipeId: result.insertId 
    });
  } catch (err) {
    console.error('createUserRecipe error:', err);
    res.status(500).json({ success: false, message: 'Failed to create recipe' });
  }
}

async function getUserRecipes(req, res, next) {
  if (!req.user) return res.status(401).json({ success: false, message: 'Authentication required' });
  try {
    const [rows] = await pool.execute(
      `SELECT ur.*, u.username, u.display_name, u.avatar_url
       FROM user_recipes ur
       LEFT JOIN users u ON ur.user_id = u.id
       WHERE ur.user_id = ?
       ORDER BY ur.created_at DESC`,
      [req.user.id]
    );

    res.json(rows.map(r => ({ ...r, _id: r.id })));
  } catch (err) {
    console.error('getUserRecipes error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch recipes' });
  }
}

async function getAllPublicUserRecipes(req, res, next) {
  try {
    const { q = '', page = 1, limit = 12, sort = 'newest' } = req.query;
    
    const parsedPage = parseInt(page, 10) || 1;
    const parsedLimit = parseInt(limit, 10) || 12;
    const offset = (parsedPage - 1) * parsedLimit;
    const safeLimit = Math.min(parsedLimit, 50);

    const searchQuery = q ? q.toString().trim().toLowerCase() : '';

    let sqlQuery = `
      SELECT ur.*, u.username, u.display_name, u.avatar_url
      FROM user_recipes ur
      LEFT JOIN users u ON ur.user_id = u.id
    `;
    
    const queryParams = [];

    if (searchQuery) {
      sqlQuery += ` WHERE LOWER(ur.title) LIKE ? OR LOWER(ur.description) LIKE ?`;
      queryParams.push(`%${searchQuery}%`, `%${searchQuery}%`);
    }

    sqlQuery += ` ORDER BY ${sort === 'top' ? '(SELECT COUNT(*) FROM user_favorites WHERE recipe_id = ur.id) DESC' : 'ur.created_at DESC'}`;
    sqlQuery += ` LIMIT ${safeLimit} OFFSET ${offset}`;

    const [rows] = await pool.execute(sqlQuery, queryParams);

    res.json(rows.map(r => ({ ...r, _id: r.id })));
  } catch (err) {
    console.error('getAllPublicUserRecipes error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch public recipes' });
  }
}

async function getPublicUserRecipeById(req, res, next) {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute(
      `SELECT ur.*, u.username, u.display_name, u.avatar_url
       FROM user_recipes ur
       LEFT JOIN users u ON ur.user_id = u.id
       WHERE ur.id = ?
       LIMIT 1`,
      [id]
    );

    const recipe = rows[0];
    if (!recipe) return res.status(404).json({ success: false, message: 'Recipe not found' });
    res.json({ ...recipe, _id: recipe.id });
  } catch (err) {
    console.error('getPublicUserRecipeById error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch recipe' });
  }
}

async function updateUserRecipe(req, res, next) {
  if (!req.user) return res.status(401).json({ success: false, message: 'Authentication required' });
  try {
    const { id } = req.params;
    const {
      title,
      description,
      ingredients,
      instructions,
      servings,
      cuisine
    } = req.body;

    // Check if the user already has a recipe with this exact title
    const [existingRecipe] = await pool.execute(
      'SELECT id FROM user_recipes WHERE user_id = ? AND LOWER(title) = LOWER(?) AND id != ? LIMIT 1',
      [req.user.id, title.trim(), id]
    );
    
    if (existingRecipe.length > 0) {
      return res.status(400).json({ success: false, message: 'You already have a recipe with this title!' });
    }

    const prep_time = parseInt(req.body.prepTime || req.body.prep_time || 0, 10);
    const cook_time = parseInt(req.body.cookTime || req.body.cook_time || 0, 10);
    const final_servings = parseInt(servings || 1, 10);

    const image = req.file ? `/uploads/${req.file.filename}` : undefined;

    // Check ownership
    const [ownerCheck] = await pool.execute(
      'SELECT id FROM user_recipes WHERE id = ? AND user_id = ? LIMIT 1', 
      [id, req.user.id]
    );
    if (!ownerCheck[0]) return res.status(404).json({ success: false, message: 'Recipe not found' });

    if (image) {
      await pool.execute(
        `UPDATE user_recipes
         SET title = ?, description = ?, ingredients = ?, instructions = ?,
             prep_time = ?, cook_time = ?, servings = ?, cuisine = ?, image = ?
         WHERE id = ? AND user_id = ?`,
        [title, description, ingredients, instructions, prep_time, cook_time, final_servings, cuisine || 'international', image, id, req.user.id]
      );
    } else {
      await pool.execute(
        `UPDATE user_recipes
         SET title = ?, description = ?, ingredients = ?, instructions = ?,
             prep_time = ?, cook_time = ?, servings = ?, cuisine = ?
         WHERE id = ? AND user_id = ?`,
        [title, description, ingredients, instructions, prep_time, cook_time, final_servings, cuisine || 'international', id, req.user.id]
      );
    }

    res.json({ success: true, message: 'Recipe updated' });
  } catch (err) {
    console.error('updateUserRecipe error:', err);
    res.status(500).json({ success: false, message: 'Failed to update recipe' });
  }
}

async function deleteUserRecipe(req, res, next) {
  if (!req.user) return res.status(401).json({ success: false, message: 'Authentication required' });
  try {
    const { id } = req.params;
    await pool.execute('DELETE FROM user_recipes WHERE id = ? AND user_id = ?', [id, req.user.id]);
    res.json({ success: true, message: 'Recipe deleted' });
  } catch (err) {
    console.error('deleteUserRecipe error:', err);
    res.status(500).json({ success: false, message: 'Failed to delete recipe' });
  }
}

// ====================== FINAL EXPORT ======================
module.exports = {
  searchRecipes,
  getRecipeById,
  getFeaturedRecipes,
  getFavoriteRecipes,
  addToFavorites,
  removeFromFavorites,
  checkFavoriteStatus,
  createUserRecipe,
  getUserRecipes,
  getAllPublicUserRecipes,
  getPublicUserRecipeById,
  updateUserRecipe,
  deleteUserRecipe
};