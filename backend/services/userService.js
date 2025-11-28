const { pool } = require('../db/database');

class UserService {
  async getUserStats(userId) {
    const connection = await pool.getConnection();
    try {
      const safeExecute = async (sql, params = [], fallback = []) => {
        try {
          return await connection.execute(sql, params);
        } catch (err) {
          if (err && err.code === 'ER_NO_SUCH_TABLE') {
            return [fallback];
          }
          throw err;
        }
      };

      // Get total favorites count
      const [favoritesCount] = await safeExecute(
        'SELECT COUNT(*) as count FROM user_favorites WHERE user_id = ?',
        [userId]
      );

      // Get recently favorited recipes
      const [recentFavorites] = await safeExecute(
        `SELECT r.*, uf.created_at as favorited_at 
         FROM recipes r
         INNER JOIN user_favorites uf ON r.recipe_id = uf.recipe_id
         WHERE uf.user_id = ?
         ORDER BY uf.created_at DESC
         LIMIT 5`,
        [userId]
      );

      // Get recent activity
      const [recentActivity] = await safeExecute(
        `SELECT * FROM user_activity 
         WHERE user_id = ?
         ORDER BY created_at DESC
         LIMIT 10`,
        [userId]
      );

      // Collections feature is optional; skip querying if not implemented
      const collections = [];

      // Get most viewed recipe categories (from activity)
      const [topCategories] = await safeExecute(
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