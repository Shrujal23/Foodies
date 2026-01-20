/**
 * Input validation middleware
 * Validates and sanitizes incoming request data
 */

const { body, param, query, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  }
  next();
};

// Validators for common fields
const validateRecipeSearch = [
  query('query')
    .trim()
    .notEmpty().withMessage('Search query is required')
    .isLength({ max: 200 }).withMessage('Search query too long'),
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  handleValidationErrors
];

const validateUserRecipeCreation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 3, max: 150 }).withMessage('Title must be 3-150 characters'),
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 10, max: 2000 }).withMessage('Description must be 10-2000 characters'),
  body('prepTime')
    .isInt({ min: 0, max: 1440 }).withMessage('Prep time must be between 0-1440 minutes'),
  body('cookTime')
    .isInt({ min: 0, max: 1440 }).withMessage('Cook time must be between 0-1440 minutes'),
  body('servings')
    .isInt({ min: 1, max: 100 }).withMessage('Servings must be between 1-100'),
  body('difficulty')
    .optional()
    .isIn(['Easy', 'Medium', 'Hard']).withMessage('Invalid difficulty level'),
  body('ingredients')
    .optional()
    .custom(val => {
      try {
        const parsed = typeof val === 'string' ? JSON.parse(val) : val;
        if (!Array.isArray(parsed)) throw new Error();
        return parsed.every(ing => typeof ing === 'string' && ing.trim().length > 0);
      } catch {
        throw new Error('Invalid ingredients format');
      }
    }),
  body('instructions')
    .optional()
    .custom(val => {
      try {
        const parsed = typeof val === 'string' ? JSON.parse(val) : val;
        if (!Array.isArray(parsed)) throw new Error();
        return parsed.every(ins => typeof ins === 'string' && ins.trim().length > 0);
      } catch {
        throw new Error('Invalid instructions format');
      }
    }),
  handleValidationErrors
];

const validateComment = [
  body('content')
    .trim()
    .notEmpty().withMessage('Comment content is required')
    .isLength({ min: 1, max: 1000 }).withMessage('Comment must be 1-1000 characters'),
  handleValidationErrors
];

const validateLogin = [
  body('email')
    .trim()
    .isEmail().withMessage('Invalid email format'),
  body('password')
    .isLength({ min: 1 }).withMessage('Password is required'),
  handleValidationErrors
];

const validateRegister = [
  body('email')
    .trim()
    .isEmail().withMessage('Invalid email format'),
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain uppercase, lowercase, and numbers'),
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 }).withMessage('Username must be 3-30 characters')
    .matches(/^[a-zA-Z0-9_-]+$/).withMessage('Username can only contain letters, numbers, underscores and hyphens'),
  handleValidationErrors
];

const validateRecipeId = [
  param('id')
    .trim()
    .notEmpty().withMessage('Recipe ID is required'),
  handleValidationErrors
];

module.exports = {
  validateRecipeSearch,
  validateUserRecipeCreation,
  validateComment,
  validateLogin,
  validateRegister,
  validateRecipeId,
  handleValidationErrors
};
