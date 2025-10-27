const { pool } = require('../db/database');

class UserService {
  async getUserStats(userId) {
    const connection = await pool.getConnection();
    try {
      // Get total favorites count
      const [favoritesCount] = await connection.execute(
        'SELECT COUNT(*) as count FROM user_favorites WHERE user_id = ?',
        [userId]
      );

      // Get recently favorited recipes
      const [recentFavorites] = await connection.execute(
        `SELECT r.*, uf.created_at as favorited_at 
         FROM recipes r
         INNER JOIN user_favorites uf ON r.recipe_id = uf.recipe_id
         WHERE uf.user_id = ?
         ORDER BY uf.created_at DESC
         LIMIT 5`,
        [userId]
      );

      // Get recent activity
      const [recentActivity] = await connection.execute(
        `SELECT * FROM user_activity 
         WHERE user_id = ?
         ORDER BY created_at DESC
         LIMIT 10`,
        [userId]
      );

      // Get user's collections with recipe counts
      const [collections] = await connection.execute(
        `SELECT 
          c.*,
          COUNT(DISTINCT cr.recipe_id) + COUNT(DISTINCT cur.user_recipe_id) as recipe_count
         FROM collections c
         LEFT JOIN collection_recipes cr ON c.id = cr.collection_id
         LEFT JOIN collection_user_recipes cur ON c.id = cur.collection_id
         WHERE c.user_id = ?
         GROUP BY c.id
         ORDER BY c.created_at DESC`,
        [userId]
      );

      // Get most viewed recipe categories (from activity)
      const [topCategories] = await connection.execute(
        `SELECT 
          JSON_EXTRACT(details, '$.category') as category,
          COUNT(*) as count
         FROM user_activity
         WHERE user_id = ? AND activity_type = 'view'
         GROUP BY category
         ORDER BY count DESC
         LIMIT 5`,
        [userId]
      );

      return {
        totalFavorites: favoritesCount[0].count,
        recentFavorites,
        recentActivity,
        collections,
        topCategories: topCategories.map(c => ({
          category: JSON.parse(c.category),
          count: c.count
        }))
      };
    } finally {
      connection.release();
    }
  }

  async logActivity(userId, activityType, recipeId = null, details = {}) {
    try {
      await pool.execute(
        'INSERT INTO user_activity (user_id, activity_type, recipe_id, details) VALUES (?, ?, ?, ?)',
        [userId, activityType, recipeId, JSON.stringify(details)]
      );
    } catch (error) {
      console.error('Error logging activity:', error);
      // Don't throw error as this is non-critical
    }
  }
}

module.exports = new UserService();