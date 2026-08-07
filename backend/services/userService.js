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
            return [Array.isArray(fallback) ? fallback : [fallback]];
          }
          throw err;
        }
      };

      const [favoritesCount] = await safeExecute(
        'SELECT COUNT(*) as count FROM user_favorites WHERE user_id = ?',
        [userId],
        [{ count: 0 }]
      );

      const [recentFavorites] = await safeExecute(
        `SELECT r.*, uf.created_at as favorited_at 
         FROM recipes r
         INNER JOIN user_favorites uf ON r.recipe_id = uf.recipe_id
         WHERE uf.user_id = ?
         ORDER BY uf.created_at DESC
         LIMIT 5`,
        [userId],
        []
      );

      const [recentActivity] = await safeExecute(
        `SELECT * FROM user_activity 
         WHERE user_id = ?
         ORDER BY created_at DESC
         LIMIT 10`,
        [userId],
        []
      );

      const [collectionsRows] = await safeExecute(
        `SELECT c.id, c.name, c.description, c.is_public, c.created_at, c.updated_at,
                COALESCE(COUNT(ci.id), 0) AS item_count
         FROM collections c
         LEFT JOIN collection_items ci ON ci.collection_id = c.id
         WHERE c.user_id = ?
         GROUP BY c.id
         ORDER BY c.created_at DESC`,
        [userId],
        []
      );

      const [topCategories] = await safeExecute(
        `SELECT 
          JSON_EXTRACT(details, '$.category') as category,
          COUNT(*) as count
         FROM user_activity
         WHERE user_id = ? AND activity_type = 'view'
         GROUP BY category
         ORDER BY count DESC
         LIMIT 5`,
        [userId],
        []
      );

      const collections = (collectionsRows || []).map((collection) => ({
        id: collection.id,
        name: collection.name,
        description: collection.description,
        isPublic: Boolean(collection.is_public),
        createdAt: collection.created_at,
        updatedAt: collection.updated_at,
        itemCount: Number(collection.item_count || 0)
      }));

      const categories = (topCategories || [])
        .map((entry) => {
          const rawCategory = entry?.category;
          if (!rawCategory) return null;

          let categoryValue = rawCategory;
          try {
            categoryValue = typeof rawCategory === 'string' ? JSON.parse(rawCategory) : rawCategory;
          } catch {
            categoryValue = rawCategory;
          }

          return {
            category: categoryValue,
            count: Number(entry.count || 0)
          };
        })
        .filter(Boolean);

      return {
        totalFavorites: Number(favoritesCount?.[0]?.count || 0),
        recentFavorites,
        recentActivity,
        collections,
        topCategories: categories
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