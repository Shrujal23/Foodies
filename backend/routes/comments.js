const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const isAuthenticated = require('../middleware/authJWT');

// Get comments for a recipe
router.get('/recipes/:recipeId/comments', (req, res) => commentController.getRecipeComments(req, res));

// Add a comment to a recipe (public; user_id will be null for guests)
router.post('/recipes/:recipeId/comments', (req, res) => commentController.addComment(req, res));

// Delete a comment
router.delete('/comments/:commentId', isAuthenticated, (req, res) => commentController.deleteComment(req, res));

module.exports = router;