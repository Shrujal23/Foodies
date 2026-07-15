const express = require('express');
const router = express.Router();
const {
  getRecipeReviews,
  getRatingBreakdown,
  createOrUpdateReview,
  deleteReview,
  markReviewHelpful
} = require('../controllers/reviewController');
const isAuthenticated = require('../middleware/auth');

// Public endpoints (no auth required)
router.get('/:recipeId/reviews', getRecipeReviews);
router.get('/:recipeId/rating-breakdown', getRatingBreakdown);

// Authenticated endpoints (user must be signed in)
router.post('/:recipeId/reviews', isAuthenticated, createOrUpdateReview);
router.delete('/:recipeId/reviews/:reviewId', isAuthenticated, deleteReview);
router.post('/:recipeId/reviews/:reviewId/helpful', markReviewHelpful);

module.exports = router;
