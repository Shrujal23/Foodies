const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { validateRecipeSearch, validateUserRecipeCreation, validateRecipeId } = require('../middleware/validation');

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

// File filter for multer - only allow images
const fileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (JPEG, PNG, WebP) are allowed'), false);
  }
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

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
  deleteUserRecipe,
  getFeaturedRecipes
} = require('../controllers/recipeController');
const isAuthenticated = require('../middleware/authJWT');

// Search recipes
router.get('/search', validateRecipeSearch, searchRecipes);

// Public: list all user-created recipes
router.get('/user-recipes', getAllPublicUserRecipes);

// Public: get featured recipes
router.get('/featured', getFeaturedRecipes);

// User recipes routes (must come before /:id to avoid conflicts)
// Accept optional image upload under the field name 'image'
router.post('/', isAuthenticated, upload.single('image'), validateUserRecipeCreation, createUserRecipe);
router.get('/my-recipes', isAuthenticated, getUserRecipes);
router.get('/user/:id', getPublicUserRecipeById);
router.put('/user/:id', isAuthenticated, upload.single('image'), validateUserRecipeCreation, updateUserRecipe);
router.delete('/user/:id', isAuthenticated, deleteUserRecipe);

// Favorite recipes routes
router.get('/favorites', isAuthenticated, getFavoriteRecipes);
router.post('/favorites', isAuthenticated, addToFavorites);
router.delete('/favorites/:recipeId', isAuthenticated, removeFromFavorites);
router.get('/favorites/:recipeId/status', isAuthenticated, checkFavoriteStatus);

// Get recipe by ID (keep this last to avoid route conflicts)
router.get('/:id', validateRecipeId, getRecipeById);

module.exports = router;
