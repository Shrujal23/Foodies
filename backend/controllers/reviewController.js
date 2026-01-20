const { pool } = require('../db/database');

// Get all reviews for a recipe
async function getRecipeReviews(req, res) {
  try {
    const { recipeId } = req.params;
    const { page = 1, limit = 10, sort = 'recent' } = req.query;
    
    const offset = (page - 1) * limit;
    
    let orderBy = 'r.created_at DESC';
    if (sort === 'rating-high') orderBy = 'r.rating DESC, r.created_at DESC';
    if (sort === 'rating-low') orderBy = 'r.rating ASC, r.created_at DESC';
    if (sort === 'helpful') orderBy = 'r.helpful_count DESC, r.created_at DESC';

    const [reviews] = await pool.execute(
      `SELECT r.*, u.username, u.display_name, u.avatar_url
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.recipe_id = ?
       ORDER BY ${orderBy}
       LIMIT ? OFFSET ?`,
      [recipeId, parseInt(limit), offset]
    );

    // Get total count
    const [[{ total }]] = await pool.execute(
      'SELECT COUNT(*) as total FROM reviews WHERE recipe_id = ?',
      [recipeId]
    );

    // Get average rating
    const [[{ avgRating, ratingCount }]] = await pool.execute(
      'SELECT AVG(rating) as avgRating, COUNT(*) as ratingCount FROM reviews WHERE recipe_id = ?',
      [recipeId]
    );

    res.json({
      reviews,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      },
      stats: {
        averageRating: avgRating ? parseFloat(avgRating.toFixed(1)) : 0,
        totalRatings: ratingCount
      }
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
}

// Get rating breakdown for a recipe
async function getRatingBreakdown(req, res) {
  try {
    const { recipeId } = req.params;

    const [breakdown] = await pool.execute(
      `SELECT rating, COUNT(*) as count
       FROM reviews
       WHERE recipe_id = ?
       GROUP BY rating
       ORDER BY rating DESC`,
      [recipeId]
    );

    const stats = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0
    };

    breakdown.forEach(item => {
      stats[item.rating] = item.count;
    });

    res.json(stats);
  } catch (error) {
    console.error('Error fetching rating breakdown:', error);
    res.status(500).json({ error: 'Failed to fetch rating breakdown' });
  }
}

// Create/Update a review
async function createOrUpdateReview(req, res) {
  try {
    const { recipeId } = req.params;
    const { rating, title, comment } = req.body;
    const userId = req.user.id;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    // Check if recipe exists
    const [[recipe]] = await pool.execute(
      'SELECT id FROM user_recipes WHERE id = ?',
      [recipeId]
    );

    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    // Check if user already reviewed
    const [[existingReview]] = await pool.execute(
      'SELECT id FROM reviews WHERE recipe_id = ? AND user_id = ?',
      [recipeId, userId]
    );

    if (existingReview) {
      // Update existing review
      await pool.execute(
        'UPDATE reviews SET rating = ?, title = ?, comment = ?, updated_at = NOW() WHERE recipe_id = ? AND user_id = ?',
        [rating, title || null, comment || null, recipeId, userId]
      );
    } else {
      // Create new review
      await pool.execute(
        'INSERT INTO reviews (recipe_id, user_id, rating, title, comment) VALUES (?, ?, ?, ?, ?)',
        [recipeId, userId, rating, title || null, comment || null]
      );
    }

    // Fetch the created/updated review with user details
    const [[review]] = await pool.execute(
      `SELECT r.*, u.username, u.display_name, u.avatar_url
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.recipe_id = ? AND r.user_id = ?`,
      [recipeId, userId]
    );

    res.json({ message: 'Review saved successfully', review });
  } catch (error) {
    console.error('Error saving review:', error);
    res.status(500).json({ error: 'Failed to save review' });
  }
}

// Delete a review
async function deleteReview(req, res) {
  try {
    const { recipeId, reviewId } = req.params;
    const userId = req.user.id;

    const [[review]] = await pool.execute(
      'SELECT user_id FROM reviews WHERE id = ? AND recipe_id = ?',
      [reviewId, recipeId]
    );

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    if (review.user_id !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await pool.execute('DELETE FROM reviews WHERE id = ?', [reviewId]);
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ error: 'Failed to delete review' });
  }
}

// Mark review as helpful/unhelpful
async function markReviewHelpful(req, res) {
  try {
    const { recipeId, reviewId } = req.params;
    const { helpful } = req.body;

    const column = helpful ? 'helpful_count' : 'unhelpful_count';

    await pool.execute(
      `UPDATE reviews SET ${column} = ${column} + 1 WHERE id = ? AND recipe_id = ?`,
      [reviewId, recipeId]
    );

    res.json({ message: 'Thank you for your feedback' });
  } catch (error) {
    console.error('Error marking review helpful:', error);
    res.status(500).json({ error: 'Failed to update review' });
  }
}

module.exports = {
  getRecipeReviews,
  getRatingBreakdown,
  createOrUpdateReview,
  deleteReview,
  markReviewHelpful
};
