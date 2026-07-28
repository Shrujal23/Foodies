const { body } = require('express-validator');
const { handleValidationErrors } = require('./validation');

const validateProfileUpdate = [
  body('username')
    .optional()
    .trim()
    .isLength({ min: 3, max: 30 }).withMessage('Username must be 3-30 characters')
    .matches(/^[a-zA-Z0-9_-]+$/).withMessage('Username can only contain letters, numbers, underscores, and hyphens'),
  body('display_name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('Display name must be 2-50 characters'),
  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  body('avatar_url')
    .optional()
    .trim()
    .isURL().withMessage('Avatar URL must be a valid URL'),
  handleValidationErrors
];

module.exports = {
  validateProfileUpdate
};
