const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Configure multer storage for recipe images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage });
const {
  searchRecipes,
  getRecipeById,
  getFavoriteRecipes,
  addToFavorites,
  removeFromFavorites,
  checkFavoriteStatus,
  createUserRecipe,
  getUserRecipes,
  getAllPublicUserRecipes,
  getPublicUserRecipeById,
  updateUserRecipe,
  deleteUserRecipe
} = require('../controllers/recipeController');
const isAuthenticated = require('../middleware/authJWT');

// Search recipes
router.get('/search', searchRecipes);

// Public: list all user-created recipes
router.get('/user-recipes', getAllPublicUserRecipes);

// User recipes routes (must come before /:id to avoid conflicts)
// Accept optional image upload under the field name 'image'
router.post('/', isAuthenticated, upload.single('image'), createUserRecipe);
router.get('/my-recipes', isAuthenticated, getUserRecipes);
router.get('/user/:id', getPublicUserRecipeById);
router.put('/user/:id', isAuthenticated, upload.single('image'), updateUserRecipe);
router.delete('/user/:id', isAuthenticated, deleteUserRecipe);

// Favorite recipes routes
router.get('/favorites', isAuthenticated, getFavoriteRecipes);
router.post('/favorites', isAuthenticated, addToFavorites);
router.delete('/favorites/:recipeId', isAuthenticated, removeFromFavorites);
router.get('/favorites/:recipeId/status', isAuthenticated, checkFavoriteStatus);

// Get recipe by ID (keep this last to avoid route conflicts)
router.get('/:id', getRecipeById);

module.exports = router;
