const express = require('express');
const router = express.Router();
const bookmarkController = require('../controllers/bookmarkController');
const authMiddleware = require('../middleware/auth');

// Get user's collections (requires authentication)
router.get('/collections', authMiddleware, (req, res, next) => 
  bookmarkController.getUserCollections(req, res, next)
);

// Create a new collection for the signed-in user
router.post('/collections', authMiddleware, (req, res, next) => 
  bookmarkController.createCollection(req, res, next)
);

// Get collection details (public collections accessible without auth)
router.get('/collections/:collectionId', authMiddleware.optionalAuth, (req, res, next) => 
  bookmarkController.getCollectionDetails(req, res, next)
);

// Delete a collection (only owner can do this)
router.delete('/collections/:collectionId', authMiddleware, (req, res, next) => 
  bookmarkController.deleteCollection(req, res, next)
);

// Add a recipe (or external recipe) to a collection
router.post('/collections/:collectionId/items', authMiddleware, (req, res, next) => 
  bookmarkController.addToCollection(req, res, next)
);

// Remove an item from a collection
router.delete('/collections/:collectionId/items/:itemId', authMiddleware, (req, res, next) => 
  bookmarkController.removeFromCollection(req, res, next)
);

// Check bookmark status for a given recipe
router.get('/check', authMiddleware, (req, res, next) => 
  bookmarkController.isRecipeBookmarked(req, res, next)
);

module.exports = router;
