const jwt = require('jsonwebtoken');
const { findUserById } = require('../db/database');
const { extractToken } = require('../utils/authToken');

async function attachUser(req, res, next, requireAuth) {
  try {
    const token = extractToken(req);

    if (!token) {
      if (requireAuth) {
        return res.status(401).json({
          success: false,
          statusCode: 401,
          message: 'Authentication required',
        });
      }
      req.user = null;
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await findUserById(decoded.userId);

    if (!user) {
      if (requireAuth) {
        return res.status(401).json({
          success: false,
          statusCode: 401,
          message: 'User not found',
        });
      }
      req.user = null;
      return next();
    }

    const { password_hash, ...userWithoutPassword } = user;
    req.user = userWithoutPassword;
    next();
  } catch (err) {
    // Never log the token value — only error type
    console.error('Auth middleware error:', err.name, err.message);

    if (requireAuth) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          statusCode: 401,
          message: 'Session expired. Please sign in again.',
        });
      }
      return res.status(401).json({
        success: false,
        statusCode: 401,
        message: 'Invalid session. Please sign in again.',
      });
    }

    req.user = null;
    next();
  }
}

async function isAuthenticated(req, res, next) {
  return attachUser(req, res, next, true);
}

async function optionalAuth(req, res, next) {
  return attachUser(req, res, next, false);
}

module.exports = isAuthenticated;
module.exports.optionalAuth = optionalAuth;
