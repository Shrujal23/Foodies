/**
 * Admin Routes
 * All routes here require admin role
 */

const express = require('express');
const { isAdmin } = require('../middleware/adminAuth');
const isAuthenticated = require('../middleware/authJWT');
const { pool } = require('../db/database');
const router = express.Router();

/**
 * @route   GET /api/admin/users
 * @desc    Get all users (admin only)
 * @access  Admin
 */
router.get('/users', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const [users] = await pool.execute(`
      SELECT id, username, display_name, email, role, created_at, avatar_url
      FROM users
      ORDER BY created_at DESC
    `);

    res.json({
      success: true,
      statusCode: 200,
      data: users,
      total: users.length
    });
  } catch (error) {
    console.error('Admin get users error:', error);
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Failed to fetch users'
    });
  }
});

/**
 * @route   GET /api/admin/users/:userId
 * @desc    Get specific user details (admin only)
 * @access  Admin
 */
router.get('/users/:userId', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { userId } = req.params;

    const [users] = await pool.execute(`
      SELECT u.id, u.username, u.display_name, u.email, u.role, u.created_at, u.avatar_url,
             (SELECT COUNT(*) FROM user_recipes WHERE user_id = ?) as recipe_count,
             (SELECT COUNT(*) FROM user_favorites WHERE user_id = ?) as favorite_count
      FROM users u
      WHERE u.id = ?
    `, [userId, userId, userId]);

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      statusCode: 200,
      data: users[0]
    });
  } catch (error) {
    console.error('Admin get user error:', error);
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Failed to fetch user'
    });
  }
});

/**
 * @route   PUT /api/admin/users/:userId/role
 * @desc    Update user role (admin only)
 * @access  Admin
 */
router.put('/users/:userId/role', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    // Validate role
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'Invalid role. Must be "user" or "admin"'
      });
    }

    // Prevent admin from removing their own admin role
    if (req.user.id === userId && role === 'user') {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'Cannot remove your own admin role'
      });
    }

    await pool.execute(
      'UPDATE users SET role = ? WHERE id = ?',
      [role, userId]
    );

    const [updatedUser] = await pool.execute(
      'SELECT id, username, display_name, email, role FROM users WHERE id = ?',
      [userId]
    );

    res.json({
      success: true,
      statusCode: 200,
      message: 'User role updated',
      data: updatedUser[0]
    });
  } catch (error) {
    console.error('Admin update user role error:', error);
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Failed to update user role'
    });
  }
});

/**
 * @route   DELETE /api/admin/users/:userId
 * @desc    Delete a user (admin only)
 * @access  Admin
 */
router.delete('/users/:userId', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { userId } = req.params;

    // Prevent admin from deleting themselves
    if (req.user.id === userId) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'Cannot delete your own account'
      });
    }

    // Delete user and related data
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Delete user's recipes
      await connection.execute('DELETE FROM user_recipes WHERE user_id = ?', [userId]);

      // Delete user's favorites
      await connection.execute('DELETE FROM user_favorites WHERE user_id = ?', [userId]);

      // Delete user's comments
      await connection.execute('DELETE FROM recipe_comments WHERE user_id = ?', [userId]);

      // Delete user's reviews
      await connection.execute('DELETE FROM reviews WHERE user_id = ?', [userId]);

      // Delete user
      await connection.execute('DELETE FROM users WHERE id = ?', [userId]);

      await connection.commit();

      res.json({
        success: true,
        statusCode: 200,
        message: 'User deleted successfully'
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Admin delete user error:', error);
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Failed to delete user'
    });
  }
});

/**
 * @route   GET /api/admin/statistics
 * @desc    Get site statistics (admin only)
 * @access  Admin
 */
router.get('/statistics', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const [totalUsers] = await pool.execute('SELECT COUNT(*) as count FROM users');
    const [totalRecipes] = await pool.execute('SELECT COUNT(*) as count FROM user_recipes');
    const [totalReviews] = await pool.execute('SELECT COUNT(*) as count FROM reviews');
    const [totalFavorites] = await pool.execute('SELECT COUNT(*) as count FROM user_favorites');

    res.json({
      success: true,
      statusCode: 200,
      data: {
        totalUsers: totalUsers[0]?.count || 0,
        totalRecipes: totalRecipes[0]?.count || 0,
        totalReviews: totalReviews[0]?.count || 0,
        totalFavorites: totalFavorites[0]?.count || 0
      }
    });
  } catch (error) {
    console.error('Admin statistics error:', error);
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Failed to fetch statistics'
    });
  }
});

/**
 * @route   GET /api/admin/recipes
 * @desc    Get all recipes (admin can moderate) (admin only)
 * @access  Admin
 */
router.get('/recipes', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const [recipes] = await pool.execute(`
      SELECT ur.*, u.username, u.display_name, u.email,
             (SELECT COUNT(*) FROM reviews WHERE recipe_id = ur.id) as review_count
      FROM user_recipes ur
      LEFT JOIN users u ON ur.user_id = u.id
      ORDER BY ur.created_at DESC
    `);

    res.json({
      success: true,
      statusCode: 200,
      data: recipes,
      total: recipes.length
    });
  } catch (error) {
    console.error('Admin get recipes error:', error);
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Failed to fetch recipes'
    });
  }
});

/**
 * @route   DELETE /api/admin/recipes/:recipeId
 * @desc    Delete a recipe (admin only)
 * @access  Admin
 */
router.delete('/recipes/:recipeId', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { recipeId } = req.params;

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Delete reviews
      await connection.execute('DELETE FROM reviews WHERE recipe_id = ?', [recipeId]);

      // Delete favorites
      await connection.execute('DELETE FROM user_favorites WHERE recipe_id = ?', [recipeId]);

      // Delete comments
      await connection.execute('DELETE FROM recipe_comments WHERE recipe_id = ?', [recipeId]);

      // Delete recipe
      await connection.execute('DELETE FROM user_recipes WHERE id = ?', [recipeId]);

      await connection.commit();

      res.json({
        success: true,
        statusCode: 200,
        message: 'Recipe deleted successfully'
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Admin delete recipe error:', error);
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Failed to delete recipe'
    });
  }
});

/**
 * @route   GET /api/admin/reviews
 * @desc    Get all reviews for moderation (admin only)
 * @access  Admin
 */
router.get('/reviews', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const [reviews] = await pool.execute(`
      SELECT r.*, 
             ur.title as recipe_title,
             u.username, u.display_name
      FROM reviews r
      LEFT JOIN user_recipes ur ON r.recipe_id = ur.id
      LEFT JOIN users u ON r.user_id = u.id
      ORDER BY r.created_at DESC
    `);

    res.json({
      success: true,
      statusCode: 200,
      data: reviews,
      total: reviews.length
    });
  } catch (error) {
    console.error('Admin get reviews error:', error);
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Failed to fetch reviews'
    });
  }
});

/**
 * @route   DELETE /api/admin/reviews/:reviewId
 * @desc    Delete a review (admin only)
 * @access  Admin
 */
router.delete('/reviews/:reviewId', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { reviewId } = req.params;

    await pool.execute('DELETE FROM reviews WHERE id = ?', [reviewId]);

    res.json({
      success: true,
      statusCode: 200,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Admin delete review error:', error);
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Failed to delete review'
    });
  }
});

/**
 * @route   GET /api/admin/collections
 * @desc    Get all public collections (admin only)
 * @access  Admin
 */
router.get('/collections', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const [collections] = await pool.execute(`
      SELECT c.id, c.user_id, c.name, c.description, c.is_public, c.created_at,
             u.username, u.display_name,
             COUNT(ci.id) as item_count
      FROM collections c
      JOIN users u ON c.user_id = u.id
      LEFT JOIN collection_items ci ON c.id = ci.collection_id
      WHERE c.is_public = 1
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `);

    res.json({
      success: true,
      statusCode: 200,
      data: collections,
      total: collections.length
    });
  } catch (error) {
    console.error('Admin get collections error:', error);
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Failed to fetch collections'
    });
  }
});

/**
 * @route   GET /api/admin/users/:userId/collections
 * @desc    Get all collections for a specific user (admin only)
 * @access  Admin
 */
router.get('/users/:userId/collections', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { userId } = req.params;

    const [collections] = await pool.execute(`
      SELECT c.id, c.user_id, c.name, c.description, c.is_public, c.created_at,
             COUNT(ci.id) as item_count
      FROM collections c
      LEFT JOIN collection_items ci ON c.id = ci.collection_id
      WHERE c.user_id = ?
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `, [userId]);

    res.json({
      success: true,
      statusCode: 200,
      data: collections,
      total: collections.length
    });
  } catch (error) {
    console.error('Admin get user collections error:', error);
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Failed to fetch user collections'
    });
  }
});

/**
 * @route   DELETE /api/admin/collections/:collectionId
 * @desc    Delete a collection (admin only)
 * @access  Admin
 */
router.delete('/collections/:collectionId', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { collectionId } = req.params;

    const [[collection]] = await pool.execute(
      'SELECT id, user_id FROM collections WHERE id = ?',
      [collectionId]
    );

    if (!collection) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'Collection not found'
      });
    }

    // Delete collection items first
    await pool.execute('DELETE FROM collection_items WHERE collection_id = ?', [collectionId]);
    
    // Delete collection
    await pool.execute('DELETE FROM collections WHERE id = ?', [collectionId]);

    res.json({
      success: true,
      statusCode: 200,
      message: 'Collection deleted successfully',
      collectionId: collectionId,
      userId: collection.user_id
    });
  } catch (error) {
    console.error('Admin delete collection error:', error);
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Failed to delete collection'
    });
  }
});

/**
 * @route   GET /api/admin/collections/:collectionId/items
 * @desc    Get items in a collection (admin only)
 * @access  Admin
 */
router.get('/collections/:collectionId/items', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { collectionId } = req.params;

    const [items] = await pool.execute(`
      SELECT ci.id, ci.recipe_id, ci.recipe_type, ci.external_recipe_id, 
             ur.title, ur.description, ur.image, ur.created_at as recipe_date
      FROM collection_items ci
      LEFT JOIN user_recipes ur ON ci.recipe_id = ur.id AND ci.recipe_type = 'user'
      WHERE ci.collection_id = ?
      ORDER BY ci.created_at DESC
    `, [collectionId]);

    res.json({
      success: true,
      statusCode: 200,
      data: items,
      total: items.length
    });
  } catch (error) {
    console.error('Admin get collection items error:', error);
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Failed to fetch collection items'
    });
  }
});

/**
 * @route   DELETE /api/admin/collections/:collectionId/items/:itemId
 * @desc    Remove an item from a collection (admin only)
 * @access  Admin
 */
router.delete('/collections/:collectionId/items/:itemId', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { collectionId, itemId } = req.params;

    const [[item]] = await pool.execute(
      'SELECT id FROM collection_items WHERE id = ? AND collection_id = ?',
      [itemId, collectionId]
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'Item not found in collection'
      });
    }

    await pool.execute('DELETE FROM collection_items WHERE id = ?', [itemId]);

    res.json({
      success: true,
      statusCode: 200,
      message: 'Item removed from collection'
    });
  } catch (error) {
    console.error('Admin delete collection item error:', error);
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Failed to remove item from collection'
    });
  }
});

/**
 * @route   PUT /api/admin/collections/:collectionId
 * @desc    Update collection visibility or metadata (admin only)
 * @access  Admin
 */
router.put('/collections/:collectionId', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { collectionId } = req.params;
    const { isPublic, description } = req.body;

    const [[collection]] = await pool.execute(
      'SELECT id FROM collections WHERE id = ?',
      [collectionId]
    );

    if (!collection) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'Collection not found'
      });
    }

    let updateQuery = 'UPDATE collections SET';
    let params = [];

    if (isPublic !== undefined) {
      updateQuery += ' is_public = ?';
      params.push(isPublic);
    }

    if (description !== undefined) {
      if (params.length > 0) updateQuery += ',';
      updateQuery += ' description = ?';
      params.push(description);
    }

    updateQuery += ' WHERE id = ?';
    params.push(collectionId);

    await pool.execute(updateQuery, params);

    const [[updatedCollection]] = await pool.execute(
      'SELECT * FROM collections WHERE id = ?',
      [collectionId]
    );

    res.json({
      success: true,
      statusCode: 200,
      message: 'Collection updated successfully',
      data: updatedCollection
    });
  } catch (error) {
    console.error('Admin update collection error:', error);
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Failed to update collection'
    });
  }
});

module.exports = router;
