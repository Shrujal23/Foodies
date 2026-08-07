const edamamService = require('../services/edamamService');
const { pool } = require('../db/database');

/*
  Search recipes — handles both user-created recipes and Edamam results.
  Keeps the interface simple so the frontend can aggregate both sources.
*/
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

    const rawQuery = query?.trim() || '';
    const searchQuery = rawQuery.toLowerCase();
    const safeLimit = Math.min(parseInt(limit, 10) || 20, 50);
    const offset = Math.max((parseInt(page, 10) - 1) * safeLimit, 0);

    let results = {
      userRecipes: [],
      edamamRecipes: []
    };

    // User Recipes
    if (source === 'all' || source === 'user') {
      try {
        const whereClauses = [];
        const queryParams = [];

        if (searchQuery) {
          const lowerQuery = `%${searchQuery}%`;
          whereClauses.push('(LOWER(ur.title) LIKE ? OR LOWER(ur.description) LIKE ?)');
          queryParams.push(lowerQuery, lowerQuery);
        }

        if (cuisineType) {
          whereClauses.push('LOWER(ur.cuisine) = ?');
          queryParams.push(cuisineType.toLowerCase());
        }

        if (diet) {
          const dietTerm = `%${diet.toLowerCase()}%`;
          whereClauses.push(
            '(LOWER(ur.title) LIKE ? OR LOWER(ur.description) LIKE ? OR LOWER(ur.ingredients) LIKE ?)'
          );
          queryParams.push(dietTerm, dietTerm, dietTerm);
        }

        if (health) {
          const healthTerm = `%${health.toLowerCase()}%`;
          whereClauses.push(
            '(LOWER(ur.title) LIKE ? OR LOWER(ur.description) LIKE ? OR LOWER(ur.ingredients) LIKE ?)'
          );
          queryParams.push(healthTerm, healthTerm, healthTerm);
        }

        if (mealType) {
          const mealTerm = `%${mealType.toLowerCase()}%`;
          whereClauses.push(
            '(LOWER(ur.title) LIKE ? OR LOWER(ur.description) LIKE ? OR LOWER(ur.ingredients) LIKE ?)'
          );
          queryParams.push(mealTerm, mealTerm, mealTerm);
        }

        if (whereClauses.length === 0) {
          whereClauses.push('1 = 1');
        }

        if (cuisineType) {
          whereClauses.push('LOWER(ur.cuisine) = ?');
          queryParams.push(cuisineType.toLowerCase());
        }

        if (diet) {
          const dietTerm = `%${diet.toLowerCase()}%`;
          whereClauses.push(
            '(LOWER(ur.title) LIKE ? OR LOWER(ur.description) LIKE ? OR LOWER(ur.ingredients) LIKE ?)'
          );
          queryParams.push(dietTerm, dietTerm, dietTerm);
        }

        if (health) {
          const healthTerm = `%${health.toLowerCase()}%`;
          whereClauses.push(
            '(LOWER(ur.title) LIKE ? OR LOWER(ur.description) LIKE ? OR LOWER(ur.ingredients) LIKE ?)'
          );
          queryParams.push(healthTerm, healthTerm, healthTerm);
        }

        if (mealType) {
          const mealTerm = `%${mealType.toLowerCase()}%`;
          whereClauses.push(
            '(LOWER(ur.title) LIKE ? OR LOWER(ur.description) LIKE ? OR LOWER(ur.ingredients) LIKE ?)'
          );
          queryParams.push(mealTerm, mealTerm, mealTerm);
        }

        const [userRecipes] = await pool.execute(`
          SELECT ur.*, u.username, u.display_name, u.avatar_url,
          (SELECT COUNT(*) FROM user_favorites WHERE recipe_id = ur.id) as favorite_count
          FROM user_recipes ur
          LEFT JOIN users u ON ur.user_id = u.id
          WHERE ${whereClauses.join(' AND ')}
          ORDER BY ur.created_at DESC
          LIMIT ? OFFSET ?
        `, [...queryParams, safeLimit, offset]);

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

        const edamamQuery = searchQuery || cuisineType || diet || mealType || health || 'recipe';
        const edamamResult = await edamamService.searchRecipes(edamamQuery, {
          from: (page - 1) * safeLimit,
          to: page * safeLimit,
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

/*
  Featured recipes — return a short list of recent user recipes for the UI.
*/
async function getFeaturedRecipes(req, res) {
  try {
    const safeLimit = Math.min(parseInt(req.query.limit, 10) || 8, 20);

    const [rows] = await pool.execute(`
      SELECT ur.*, u.username, u.display_name, u.avatar_url,
             (SELECT AVG(rating) FROM reviews WHERE recipe_id = ur.id) as avg_rating,
             (SELECT COUNT(*) FROM user_favorites WHERE recipe_id = ur.id) as favorite_count
      FROM user_recipes ur
      LEFT JOIN users u ON ur.user_id = u.id
      ORDER BY ur.created_at DESC
      LIMIT ${safeLimit}
    `);

    res.json(rows.map(recipe => ({
      ...recipe,
      _id: recipe.id,
      source: 'user',
      // Provide real data instead of hardcoded values
      avg_rating: Number(recipe.avg_rating) || null,
      favorite_count: Number(recipe.favorite_count) || 0,
      prepTime: recipe.prep_time,
      cookTime: recipe.cook_time,
    })));
  } catch (error) {
    console.error('Get Featured Recipes Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch featured recipes' });
  }
}

/*
  Get a single recipe by ID — currently proxies to Edamam for external recipes.
*/
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

/*
  Favorites endpoints — list, add, remove, and check favorite status for a user.
*/
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
  if (!recipe || typeof recipe !== 'object') {
    return res.status(400).json({ error: 'Recipe payload is required' });
  }

  // Normalize incoming recipe fields to avoid DB constraint failures
  const recipeId = recipe.uri || recipe.recipeId || recipe._id || recipe.id;
  const label = recipe.label || recipe.title || 'Untitled Recipe';
  const image = recipe.image || null;
  const source = recipe.source || 'user';
  const url = recipe.url || null;

  if (!recipeId) {
    return res.status(400).json({ error: 'Recipe identifier is required' });
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [existing] = await connection.execute(
      'SELECT recipe_id FROM recipes WHERE recipe_id = ?',
      [recipeId]
    );

    if (existing.length === 0) {
      await connection.execute(
        `INSERT INTO recipes (recipe_id, label, image, source, url)
         VALUES (?, ?, ?, ?, ?)`,
        [recipeId, label, image, source, url]
      );
    }

    await connection.execute(
      `INSERT INTO user_favorites (user_id, recipe_id)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE created_at = CURRENT_TIMESTAMP`,
      [req.user.id, recipeId]
    );

    // Also add to a per-user "Favorites" collection so saved recipes appear in Collections view.
    try {
      // Find or create a Favorites collection for this user
      const [favRows] = await connection.execute(
        'SELECT id FROM collections WHERE user_id = ? AND name = ? LIMIT 1',
        [req.user.id, 'Favorites']
      );

      let favoritesCollectionId;
      if (favRows.length > 0) {
        favoritesCollectionId = favRows[0].id;
      } else {
        const [insertCol] = await connection.execute(
          'INSERT INTO collections (user_id, name, description) VALUES (?, ?, ?)',
          [req.user.id, 'Favorites', 'Automatically created favorites collection']
        );
        favoritesCollectionId = insertCol.insertId;
      }

      // Insert into the mapping table used by the app: collection_items
      if (source === 'user') {
        const userRecipeId = parseInt(recipeId, 10);
        if (!Number.isNaN(userRecipeId)) {
          await connection.execute(
            `INSERT IGNORE INTO collection_items (collection_id, recipe_id, recipe_type, external_recipe_id)
             VALUES (?, ?, ?, NULL)`,
            [favoritesCollectionId, userRecipeId, 'user']
          );
        }
      } else {
        await connection.execute(
          `INSERT IGNORE INTO collection_items (collection_id, recipe_id, recipe_type, external_recipe_id)
           VALUES (?, NULL, ?, ?)`,
          [favoritesCollectionId, 'external', recipeId]
        );
      }
    } catch (err) {
      // non-fatal: log and continue — favorites should still succeed
      console.error('Warning: failed to add favorite into Favorites collection', err.message || err);
    }

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

/*
  User recipe CRUD — create, read, update, delete user-submitted recipes.
*/

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
    const calories = parseInt(req.body.calories || 0, 10);
    const mealType = req.body.mealType || req.body.meal_type || '';
    const dishType = req.body.dishType || req.body.dish_type || '';

    let dietaryTags = [];
    try {
      const parsed = JSON.parse(req.body.dietaryTags || req.body.dietary_tags || '[]');
      dietaryTags = Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      dietaryTags = String(req.body.dietaryTags || req.body.dietary_tags || '')
        .split(',')
        .map((entry) => entry.trim())
        .filter(Boolean);
    }

    const image = req.file ? `/uploads/${req.file.filename}` : null;

    let result;
    try {
      [result] = await pool.execute(
        `INSERT INTO user_recipes 
         (user_id, title, description, ingredients, instructions, prep_time, cook_time, servings, cuisine, calories, meal_type, dish_type, dietary_tags, image)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
          Number.isNaN(calories) ? null : calories,
          mealType || null,
          dishType || null,
          dietaryTags.length > 0 ? JSON.stringify(dietaryTags) : null,
          image
        ]
      );
    } catch (err) {
      if (err && err.code === 'ER_BAD_FIELD_ERROR' && /cuisine/i.test(err.message || '')) {
        [result] = await pool.execute(
          `INSERT INTO user_recipes 
           (user_id, title, description, ingredients, instructions, prep_time, cook_time, servings, image)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            req.user.id,
            title,
            description,
            ingredients,
            instructions,
            prep_time,
            cook_time,
            final_servings,
            image
          ]
        );
      } else {
        throw err;
      }
    }

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
    const calories = parseInt(req.body.calories || 0, 10);
    const mealType = req.body.mealType || req.body.meal_type || '';
    const dishType = req.body.dishType || req.body.dish_type || '';

    let dietaryTags = [];
    try {
      const parsed = JSON.parse(req.body.dietaryTags || req.body.dietary_tags || '[]');
      dietaryTags = Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      dietaryTags = String(req.body.dietaryTags || req.body.dietary_tags || '')
        .split(',')
        .map((entry) => entry.trim())
        .filter(Boolean);
    }

    const image = req.file ? `/uploads/${req.file.filename}` : undefined;

    // Check ownership
    const [ownerCheck] = await pool.execute(
      'SELECT id FROM user_recipes WHERE id = ? AND user_id = ? LIMIT 1', 
      [id, req.user.id]
    );
    if (!ownerCheck[0]) return res.status(404).json({ success: false, message: 'Recipe not found' });

    try {
      if (image) {
        await pool.execute(
          `UPDATE user_recipes
          SET title = ?, description = ?, ingredients = ?, instructions = ?,
          prep_time = ?, cook_time = ?, servings = ?, cuisine = ?, calories = ?, meal_type = ?, dish_type = ?, dietary_tags = ?, image = ?
          WHERE id = ? AND user_id = ?`,
          [title, description, ingredients, instructions, prep_time, cook_time, final_servings, cuisine || 'international', Number.isNaN(calories) ? null : calories, mealType || null, dishType || null, dietaryTags.length > 0 ? JSON.stringify(dietaryTags) : null, image, id, req.user.id]
        );
      } else {
        await pool.execute(
          `UPDATE user_recipes
          SET title = ?, description = ?, ingredients = ?, instructions = ?,
          prep_time = ?, cook_time = ?, servings = ?, cuisine = ?, calories = ?, meal_type = ?, dish_type = ?, dietary_tags = ?
          WHERE id = ? AND user_id = ?`,
          [title, description, ingredients, instructions, prep_time, cook_time, final_servings, cuisine || 'international', Number.isNaN(calories) ? null : calories, mealType || null, dishType || null, dietaryTags.length > 0 ? JSON.stringify(dietaryTags) : null, id, req.user.id]
        );
      }
    } catch (err) {
      if (err && err.code === 'ER_BAD_FIELD_ERROR' && /cuisine/i.test(err.message || '')) {
        if (image) {
          await pool.execute(
            `UPDATE user_recipes
             SET title = ?, description = ?, ingredients = ?, instructions = ?,
                 prep_time = ?, cook_time = ?, servings = ?, image = ?
             WHERE id = ? AND user_id = ?`,
            [title, description, ingredients, instructions, prep_time, cook_time, final_servings, image, id, req.user.id]
          );
        } else {
          await pool.execute(
            `UPDATE user_recipes
             SET title = ?, description = ?, ingredients = ?, instructions = ?,
                 prep_time = ?, cook_time = ?, servings = ?
             WHERE id = ? AND user_id = ?`,
            [title, description, ingredients, instructions, prep_time, cook_time, final_servings, id, req.user.id]
          );
        }
      } else {
        throw err;
      }
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