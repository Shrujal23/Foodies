const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Middleware
const { 
  validateRecipeSearch, 
  validateUserRecipeCreation, 
  validateRecipeId 
} = require('../middleware/validation');

const isAuthenticated = require('../middleware/auth');

// Controllers
const {
  searchRecipes,
  getRecipeById,
  getFeaturedRecipes,
  getFavoriteRecipes,
  addToFavorites,
  removeFromFavorites,
  checkFavoriteStatus,
  createUserRecipe,
  getAllPublicUserRecipes,
  getPublicUserRecipeById,
  updateUserRecipe,
  deleteUserRecipe,
} = require('../controllers/recipeController');

// ====================== MULTER CONFIGURATION ======================
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

// ====================== ROUTES ======================

// Public Routes
// GET /api/recipes — list all user-created recipes (community feed)
router.get('/', getAllPublicUserRecipes);
router.get('/search', validateRecipeSearch, searchRecipes);
router.get('/featured', getFeaturedRecipes);
// Backward-compatible alias for older clients
router.get('/user-recipes', getAllPublicUserRecipes);

// User Recipe CRUD Routes
// POST /api/recipes/create-recipe — create a new user recipe
router.post('/create-recipe', isAuthenticated, upload.single('image'), validateUserRecipeCreation, createUserRecipe);
// PUT /api/recipes/update-recipe/:id — update an existing user recipe
router.put('/update-recipe/:id', isAuthenticated, upload.single('image'), validateUserRecipeCreation, updateUserRecipe);
// DELETE /api/recipes/delete-recipe/:id — delete a user recipe
router.delete('/delete-recipe/:id', isAuthenticated, deleteUserRecipe);
router.get('/user/:id', getPublicUserRecipeById);

// Favorites Routes
router.get('/favorites', isAuthenticated, getFavoriteRecipes);
router.post('/favorites', isAuthenticated, addToFavorites);
router.delete('/favorites/:recipeId', isAuthenticated, removeFromFavorites);
router.get('/favorites/:recipeId/status', isAuthenticated, checkFavoriteStatus);

// Single Recipe (Keep this LAST to avoid route conflicts)
router.get('/:id', validateRecipeId, getRecipeById);

module.exports = router;