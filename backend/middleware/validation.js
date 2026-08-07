/**
 * Input validation middleware
 * Validates and sanitizes incoming request data
 */

const { body, param, query, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(err => ({
      field: err.path || err.param,
      message: err.msg
    }));

    // Log only safe metadata (never passwords or full body to clients)
    console.warn('Validation failed:', {
      path: req.path,
      method: req.method,
      fields: formattedErrors.map(e => e.field),
    });

    return res.status(400).json({
      success: false,
      statusCode: 400,
      message: formattedErrors[0]?.message || 'Validation failed',
      errors: formattedErrors
    });
  }
  next();
};

// Shared password policy (register / any password set flow)
const strongPassword = body('password')
  .notEmpty().withMessage('Password is required')
  .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
  .isLength({ max: 128 }).withMessage('Password must be at most 128 characters')
  .matches(/[a-z]/).withMessage('Password must include a lowercase letter')
  .matches(/[A-Z]/).withMessage('Password must include an uppercase letter')
  .matches(/\d/).withMessage('Password must include a number')
  .matches(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/)
    .withMessage('Password must include a special character');

// Validators for common fields
const validateRecipeSearch = [
  query('query')
    .optional({ checkFalsy: true })
    .trim()
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
    .optional({ checkFalsy: true })
    .isInt({ min: 0, max: 1440 }).withMessage('Prep time must be between 0-1440 minutes'),
  body('cookTime')
    .optional({ checkFalsy: true })
    .isInt({ min: 0, max: 1440 }).withMessage('Cook time must be between 0-1440 minutes'),
  body('servings')
    .optional({ checkFalsy: true })
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
  body('identifier')
    .trim()
    .notEmpty().withMessage('Username or email is required')
    .isLength({ max: 254 }).withMessage('Username or email is too long')
    .custom(value => {
      if (value.includes('@')) {
        // Basic email shape; full checks happen on register
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254;
      }
      return /^[a-zA-Z0-9_-]{3,30}$/.test(value);
    }).withMessage('Enter a valid email address or username'),
  // Login: only check presence + max length (do not reveal password policy on login)
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ max: 128 }).withMessage('Password is too long'),
  handleValidationErrors
];

const validateRegister = [
  body('username')
    .trim()
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 3, max: 30 }).withMessage('Username must be 3-30 characters')
    .matches(/^[a-zA-Z0-9_-]+$/).withMessage('Username can only contain letters, numbers, underscores, and hyphens')
    .custom(value => !/^[_-]+$/.test(value)).withMessage('Username must include at least one letter or number')
    .customSanitizer(value => String(value).trim()),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isLength({ max: 254 }).withMessage('Email is too long')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail({ gmail_remove_dots: false })
    .customSanitizer(value => String(value).toLowerCase()),
  strongPassword,
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
