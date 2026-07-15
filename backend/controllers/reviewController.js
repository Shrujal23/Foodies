const { pool } = require('../db/database');

async function getRecipeReviews(req, res) {
  try {
    const { recipeId } = req.params;
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(1, parseInt(req.query.limit, 10) || 10);
    const offset = (page - 1) * limit;
    const sort = req.query.sort || 'recent';

    let orderBy = 'r.created_at DESC';
    if (sort === 'rating-high') orderBy = 'r.rating DESC, r.created_at DESC';
    if (sort === 'rating-low') orderBy = 'r.rating ASC, r.created_at DESC';
    if (sort === 'helpful') orderBy = 'r.helpful_count DESC, r.created_at DESC';

    const [rows] = await pool.execute(
      `SELECT r.id, r.recipe_id, r.user_id, r.rating, r.title, r.comment, r.helpful_count, r.unhelpful_count, r.created_at, r.updated_at,
              u.username, u.display_name, u.avatar_url
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.recipe_id = ?
       ORDER BY ${orderBy}
       LIMIT ? OFFSET ?`,
      [recipeId, limit, offset]
    );

    const [countRow] = await pool.execute(
      'SELECT COUNT(*) as total FROM reviews WHERE recipe_id = ?',
      [recipeId]
    );
    const total = countRow[0]?.total || 0;

    const [avgRow] = await pool.execute(
      'SELECT AVG(rating) as avgRating, COUNT(*) as ratingCount FROM reviews WHERE recipe_id = ?',
      [recipeId]
    );
    const avgRating = avgRow[0]?.avgRating ?? 0;
    const ratingCount = avgRow[0]?.ratingCount ?? 0;

    const reviews = rows.map(r => ({
      id: r.id,
      recipeId: r.recipe_id,
      userId: r.user_id,
      rating: r.rating,
      title: r.title,
      comment: r.comment,
      helpfulCount: r.helpful_count,
      unhelpfulCount: r.unhelpful_count,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
      user: {
        username: r.username,
        displayName: r.display_name,
        avatarUrl: r.avatar_url
      }
    }));

    res.json({
      reviews,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      stats: { averageRating: Number(avgRating ? avgRating.toFixed(1) : 0), totalRatings: ratingCount }
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

    const stats = { five: 0, four: 0, three: 0, two: 0, one: 0 };
    breakdown.forEach(b => {
      if (b.rating === 5) stats.five = b.count;
      if (b.rating === 4) stats.four = b.count;
      if (b.rating === 3) stats.three = b.count;
      if (b.rating === 2) stats.two = b.count;
      if (b.rating === 1) stats.one = b.count;
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

    const r = parseInt(rating, 10);
    if (!r || r < 1 || r > 5) return res.status(400).json({ error: 'Rating must be 1-5' });

    const [[recipe]] = await pool.execute('SELECT id FROM user_recipes WHERE id = ?', [recipeId]);
    if (!recipe) return res.status(404).json({ error: 'Recipe not found' });

    const [[existing]] = await pool.execute('SELECT id FROM reviews WHERE recipe_id = ? AND user_id = ?', [recipeId, userId]);
    if (existing) {
      await pool.execute(
        'UPDATE reviews SET rating = ?, title = ?, comment = ?, updated_at = NOW() WHERE recipe_id = ? AND user_id = ?',
        [r, title || null, comment || null, recipeId, userId]
      );
    } else {
      await pool.execute('INSERT INTO reviews (recipe_id, user_id, rating, title, comment) VALUES (?, ?, ?, ?, ?)',
        [recipeId, userId, r, title || null, comment || null]);
    }

    const [[rev]] = await pool.execute(
      `SELECT r.id, r.recipe_id, r.user_id, r.rating, r.title, r.comment, r.helpful_count, r.unhelpful_count, r.created_at, r.updated_at,
              u.username, u.display_name, u.avatar_url
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.recipe_id = ? AND r.user_id = ?`,
      [recipeId, userId]
    );

    const out = {
      id: rev.id,
      recipeId: rev.recipe_id,
      userId: rev.user_id,
      rating: rev.rating,
      title: rev.title,
      comment: rev.comment,
      helpfulCount: rev.helpful_count,
      unhelpfulCount: rev.unhelpful_count,
      createdAt: rev.created_at,
      updatedAt: rev.updated_at,
      user: { username: rev.username, displayName: rev.display_name, avatarUrl: rev.avatar_url }
    };

    res.json({ message: 'Review saved', review: out });
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
    const [[rev]] = await pool.execute('SELECT user_id FROM reviews WHERE id = ? AND recipe_id = ?', [reviewId, recipeId]);
    if (!rev) return res.status(404).json({ error: 'Review not found' });
    if (rev.user_id !== userId) return res.status(403).json({ error: 'Unauthorized' });

    await pool.execute('DELETE FROM reviews WHERE id = ?', [reviewId]);
    res.json({ message: 'Review deleted' });
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
    if (helpful) {
      await pool.execute('UPDATE reviews SET helpful_count = helpful_count + 1 WHERE id = ? AND recipe_id = ?', [reviewId, recipeId]);
    } else {
      await pool.execute('UPDATE reviews SET unhelpful_count = unhelpful_count + 1 WHERE id = ? AND recipe_id = ?', [reviewId, recipeId]);
    }

    res.json({ message: 'Thanks for the feedback' });
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
