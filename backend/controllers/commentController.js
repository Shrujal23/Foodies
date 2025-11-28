const { pool } = require('../db/database');

async function getRecipeComments(req, res) {
  try {
    const { recipeId } = req.params;
    const [rows] = await pool.execute(
      `SELECT rc.*, u.username, u.display_name, u.avatar_url 
       FROM recipe_comments rc
       LEFT JOIN users u ON rc.user_id = u.id
       WHERE rc.recipe_id = ?
       ORDER BY rc.created_at DESC`,
      [recipeId]
    );
    res.json(rows);
  } catch (error) {
    console.error('Get Comments Error:', error);
    res.status(500).json({ error: 'Failed to get comments' });
  }
}

async function addComment(req, res) {
  try {
    const { recipeId } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Comment content is required' });
    }

    const userId = req.user?.id || null;

    const [result] = await pool.execute(
      'INSERT INTO recipe_comments (recipe_id, user_id, content) VALUES (?, ?, ?)',
      [recipeId, userId, content]
    );

    // Get the created comment with user details
    const [comments] = await pool.execute(
      `SELECT rc.*, u.username, u.display_name, u.avatar_url 
       FROM recipe_comments rc
       LEFT JOIN users u ON rc.user_id = u.id
       WHERE rc.id = ?`,
      [result.insertId]
    );

    res.status(201).json(comments[0]);
  } catch (error) {
    console.error('Add Comment Error:', error);
    res.status(500).json({ error: 'Failed to add comment' });
  }
}

async function deleteComment(req, res) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const { commentId } = req.params;

    // Check if comment exists and belongs to user
    const [comment] = await pool.execute(
      'SELECT * FROM recipe_comments WHERE id = ?',
      [commentId]
    );

    if (comment.length === 0) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    if (comment[0].user_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this comment' });
    }

    await pool.execute(
      'DELETE FROM recipe_comments WHERE id = ?',
      [commentId]
    );

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Delete Comment Error:', error);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
}

module.exports = {
  getRecipeComments,
  addComment,
  deleteComment
};