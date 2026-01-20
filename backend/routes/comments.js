const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const isAuthenticated = require('../middleware/authJWT');
const { validateComment, validateRecipeId } = require('../middleware/validation');

/**
 * @swagger
 * /api/recipes/{recipeId}/comments:
 *   get:
 *     summary: Get comments for a recipe
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: recipeId
 *         required: true
 *         schema:
 *           type: string
 *   post:
 *     summary: Add a comment to a recipe
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: recipeId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 */

// Get comments for a recipe
router.get('/recipes/:recipeId/comments', (req, res, next) => commentController.getRecipeComments(req, res, next));

// Add a comment to a recipe (requires authentication)
router.post('/recipes/:recipeId/comments', isAuthenticated, validateComment, (req, res, next) => commentController.addComment(req, res, next));

/**
 * @swagger
 * /api/comments/{commentId}:
 *   delete:
 *     summary: Delete a comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: integer
 */

// Delete a comment
router.delete('/comments/:commentId', isAuthenticated, (req, res, next) => commentController.deleteComment(req, res, next));

module.exports = router;