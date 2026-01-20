/**
 * Database query optimization utilities
 * Helps prevent N+1 queries and improves database performance
 */

// Example optimized query patterns

/**
 * Get user recipes with aggregated data in a single query
 * Prevents N+1 queries for getting comment count, favorite count, etc.
 */
const getOptimizedUserRecipes = async (pool, userId) => {
  const [rows] = await pool.execute(`
    SELECT 
      ur.*,
      COUNT(DISTINCT uf.user_id) as favorite_count,
      COUNT(DISTINCT rc.id) as comment_count,
      u.username,
      u.avatar_url
    FROM user_recipes ur
    LEFT JOIN user_favorites uf ON ur.id = uf.recipe_id
    LEFT JOIN recipe_comments rc ON ur.id = rc.recipe_id
    LEFT JOIN users u ON ur.user_id = u.id
    WHERE ur.user_id = ?
    GROUP BY ur.id
    ORDER BY ur.created_at DESC
  `, [userId]);
  
  return rows;
};

/**
 * Batch load user data instead of individual queries
 */
const batchLoadUsers = async (pool, userIds) => {
  if (!userIds.length) return [];
  
  const placeholders = userIds.map(() => '?').join(',');
  const [rows] = await pool.execute(`
    SELECT id, username, display_name, avatar_url
    FROM users
    WHERE id IN (${placeholders})
  `, userIds);
  
  return rows;
};

/**
 * Use LIMIT with OFFSET for pagination instead of loading all records
 */
const getPaginatedRecipes = async (pool, page = 1, limit = 20) => {
  const offset = (page - 1) * limit;
  
  const [recipes] = await pool.execute(`
    SELECT * FROM user_recipes
    ORDER BY created_at DESC
    LIMIT ? OFFSET ?
  `, [limit, offset]);
  
  const [countResult] = await pool.execute(`
    SELECT COUNT(*) as total FROM user_recipes
  `);
  
  return {
    recipes,
    total: countResult[0].total,
    pages: Math.ceil(countResult[0].total / limit),
    currentPage: page
  };
};

/**
 * Use indexes on frequently queried columns
 * Run these migration queries on your database:
 * 
 * CREATE INDEX idx_user_recipes_user_id ON user_recipes(user_id);
 * CREATE INDEX idx_user_recipes_created_at ON user_recipes(created_at DESC);
 * CREATE INDEX idx_user_favorites_user_id ON user_favorites(user_id);
 * CREATE INDEX idx_user_favorites_recipe_id ON user_favorites(recipe_id);
 * CREATE INDEX idx_recipe_comments_recipe_id ON recipe_comments(recipe_id);
 * CREATE INDEX idx_recipe_comments_user_id ON recipe_comments(user_id);
 * CREATE INDEX idx_users_email ON users(email);
 * CREATE INDEX idx_users_username ON users(username);
 */

/**
 * Selective column loading - only fetch needed columns
 */
const getRecipesSummary = async (pool) => {
  const [rows] = await pool.execute(`
    SELECT id, title, image, created_at, user_id
    FROM user_recipes
    LIMIT 50
  `);
  
  return rows;
};

module.exports = {
  getOptimizedUserRecipes,
  batchLoadUsers,
  getPaginatedRecipes,
  getRecipesSummary
};
