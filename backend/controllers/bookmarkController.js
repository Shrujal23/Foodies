const { pool } = require('../db/database');

async function getUserCollections(req, res) {
  try {
    const uid = req.user?.id;
    if (!uid) return res.status(401).json({ error: 'Authentication required' });

    console.debug(`getUserCollections called by userId=${uid}`);

    const [rows] = await pool.execute(
      `SELECT c.id, c.user_id, c.name, c.description, c.is_public, c.created_at, c.updated_at,
       COALESCE(COUNT(ci.id), 0) AS item_count
       FROM collections c
       LEFT JOIN collection_items ci ON ci.collection_id = c.id
       WHERE c.user_id = ?
       GROUP BY c.id
       ORDER BY c.created_at DESC`,
      [uid]
    );

    const result = rows.map(r => ({
      id: r.id,
      userId: r.user_id,
      name: r.name,
      description: r.description,
      isPublic: Boolean(r.is_public),
      createdAt: r.created_at,
      updatedAt: r.updated_at,
      itemCount: Number(r.item_count || 0)
    }));

    res.json(result);
  } catch (err) {
    console.error('Get Collections Error:', err);
    res.status(500).json({ error: 'Failed to fetch collections' });
  }
}

// Create a new collection
async function createCollection(req, res) {
  try {
    const userId = req.user.id;
    const { name, description, isPublic } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Collection name is required' });
    }

    const [result] = await pool.execute(
      'INSERT INTO collections (user_id, name, description, is_public) VALUES (?, ?, ?, ?)',
      [userId, name, description || null, isPublic || false]
    );

    res.status(201).json({ 
      id: result.insertId, 
      name, 
      description, 
      isPublic,
      itemCount: 0 
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Collection name already exists' });
    }
    console.error('Create Collection Error:', error);
    res.status(500).json({ error: 'Failed to create collection' });
  }
}

// Delete a collection
async function deleteCollection(req, res) {
  try {
    const { collectionId } = req.params;
    const userId = req.user.id;

    // Verify ownership
    const [[collection]] = await pool.execute(
      'SELECT id FROM collections WHERE id = ? AND user_id = ?',
      [collectionId, userId]
    );

    if (!collection) {
      return res.status(404).json({ error: 'Collection not found' });
    }

    await pool.execute('DELETE FROM collections WHERE id = ?', [collectionId]);
    res.json({ success: true });
  } catch (error) {
    console.error('Delete Collection Error:', error);
    res.status(500).json({ error: 'Failed to delete collection' });
  }
}

// Add recipe to collection (bookmark)
async function addToCollection(req, res) {
  try {
    const { collectionId } = req.params;
    const { recipeId, recipeType, externalRecipeId } = req.body;
    const userId = req.user.id;

    // Verify collection ownership
    const [[collection]] = await pool.execute(
      'SELECT id FROM collections WHERE id = ? AND user_id = ?',
      [collectionId, userId]
    );

    if (!collection) {
      return res.status(404).json({ error: 'Collection not found' });
    }

    const [result] = await pool.execute(
      `INSERT INTO collection_items 
       (collection_id, recipe_id, recipe_type, external_recipe_id) 
       VALUES (?, ?, ?, ?)`,
      [collectionId, recipeId || null, recipeType || 'user', externalRecipeId || null]
    );

    res.status(201).json({ 
      id: result.insertId,
      message: 'Recipe added to collection' 
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Recipe already in collection' });
    }
    console.error('Add to Collection Error:', error);
    res.status(500).json({ error: 'Failed to add recipe to collection' });
  }
}

// Remove recipe from collection (unbookmark)
async function removeFromCollection(req, res) {
  try {
    const { collectionId, itemId } = req.params;
    const userId = req.user.id;

    // Verify collection ownership
    const [[collection]] = await pool.execute(
      'SELECT id FROM collections WHERE id = ? AND user_id = ?',
      [collectionId, userId]
    );

    if (!collection) {
      return res.status(404).json({ error: 'Collection not found' });
    }

    await pool.execute(
      'DELETE FROM collection_items WHERE id = ? AND collection_id = ?',
      [itemId, collectionId]
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Remove from Collection Error:', error);
    res.status(500).json({ error: 'Failed to remove recipe' });
  }
}

// Gets the collection details with recipes
async function getCollectionDetails(req, res) {
  try {
    const { collectionId } = req.params;
    const userId = req.user?.id;

    const [[collection]] = await pool.execute(
      'SELECT * FROM collections WHERE id = ?',
      [collectionId]
    );

    if (!collection) {
      return res.status(404).json({ error: 'Collection not found' });
    }

    // Debug: log owner vs requester
    console.debug(`getCollectionDetails: collectionId=${collectionId} owner=${collection.user_id} requester=${userId} is_public=${collection.is_public}`);

    // Check if user has access
    if (collection.user_id !== userId && !collection.is_public) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const [items] = await pool.execute(
      `SELECT ci.id, ci.collection_id, ci.recipe_id, ci.recipe_type, ci.external_recipe_id, ci.added_at,
       ur.title, ur.image, ur.difficulty, ur.prep_time, ur.cook_time, ur.servings
       FROM collection_items ci
       LEFT JOIN user_recipes ur ON ci.recipe_id = ur.id
       WHERE ci.collection_id = ?
       ORDER BY ci.added_at DESC`,
      [collectionId]
    );

    const collectionOut = {
      id: collection.id,
      userId: collection.user_id,
      name: collection.name,
      description: collection.description,
      isPublic: Boolean(collection.is_public),
      createdAt: collection.created_at,
      updatedAt: collection.updated_at,
      itemCount: items.length
    };

    res.json({ collection: collectionOut, items });
  } catch (error) {
    console.error('Get Collection Details Error:', error);
    res.status(500).json({ error: 'Failed to fetch collection' });
  }
}

// Check if recipe is bookmarked
async function isRecipeBookmarked(req, res) {
  try {
    const userId = req.user.id;
    const { recipeId, externalRecipeId } = req.query;

    let query, params;
    
    if (recipeId) {
      query = `SELECT ci.id, c.id as collectionId, c.name 
               FROM collection_items ci
               JOIN collections c ON ci.collection_id = c.id
               WHERE c.user_id = ? AND ci.recipe_id = ?`;
      params = [userId, recipeId];
    } else if (externalRecipeId) {
      query = `SELECT ci.id, c.id as collectionId, c.name 
               FROM collection_items ci
               JOIN collections c ON ci.collection_id = c.id
               WHERE c.user_id = ? AND ci.external_recipe_id = ?`;
      params = [userId, externalRecipeId];
    }

    const [bookmarks] = await pool.execute(query, params);
    res.json({ isBookmarked: bookmarks.length > 0, bookmarks });
  } catch (error) {
    console.error('Check Bookmark Error:', error);
    res.status(500).json({ error: 'Failed to check bookmark status' });
  }
}

module.exports = {
  getUserCollections,
  createCollection,
  deleteCollection,
  addToCollection,
  removeFromCollection,
  getCollectionDetails,
  isRecipeBookmarked
};
