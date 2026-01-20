const express = require('express');
const router = express.Router();
const bookmarkController = require('../controllers/bookmarkController');
const isAuthenticated = require('../middleware/authJWT');

// Get user's collections
router.get('/collections', isAuthenticated, (req, res, next) => 
  bookmarkController.getUserCollections(req, res, next)
);

// Create new collection
router.post('/collections', isAuthenticated, (req, res, next) => 
  bookmarkController.createCollection(req, res, next)
);

// Get collection details
router.get('/collections/:collectionId', (req, res, next) => 
  bookmarkController.getCollectionDetails(req, res, next)
);

// Delete collection
router.delete('/collections/:collectionId', isAuthenticated, (req, res, next) => 
  bookmarkController.deleteCollection(req, res, next)
);

// Add recipe to collection
router.post('/collections/:collectionId/items', isAuthenticated, (req, res, next) => 
  bookmarkController.addToCollection(req, res, next)
);

// Remove recipe from collection
router.delete('/collections/:collectionId/items/:itemId', isAuthenticated, (req, res, next) => 
  bookmarkController.removeFromCollection(req, res, next)
);

// Check if recipe is bookmarked
router.get('/bookmarks/check', isAuthenticated, (req, res, next) => 
  bookmarkController.isRecipeBookmarked(req, res, next)
);

module.exports = router;
