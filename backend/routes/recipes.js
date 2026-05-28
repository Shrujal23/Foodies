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

const isAuthenticated = require('../middleware/authJWT');

// Controllers
const {
  searchRecipes,
  getRecipeById,
  getFeaturedRecipes,
  getRatingBreakdown,
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
router.get('/search', validateRecipeSearch, searchRecipes);
router.get('/featured', getFeaturedRecipes);
router.get('/user-recipes', getAllPublicUserRecipes);

// User Recipe CRUD Routes
router.post('/', isAuthenticated, upload.single('image'), validateUserRecipeCreation, createUserRecipe);
router.get('/my-recipes', isAuthenticated, getUserRecipes);
router.get('/user/:id', getPublicUserRecipeById);
router.put('/user/:id', isAuthenticated, upload.single('image'), validateUserRecipeCreation, updateUserRecipe);
router.delete('/user/:id', isAuthenticated, deleteUserRecipe);

// Favorites Routes
router.get('/favorites', isAuthenticated, getFavoriteRecipes);
router.post('/favorites', isAuthenticated, addToFavorites);
router.delete('/favorites/:recipeId', isAuthenticated, removeFromFavorites);
router.get('/favorites/:recipeId/status', isAuthenticated, checkFavoriteStatus);

// Rating Routes
router.get('/:id/rating-breakdown', getRatingBreakdown);

// Single Recipe (Keep this LAST to avoid route conflicts)
router.get('/:id', validateRecipeId, getRecipeById);

module.exports = router;