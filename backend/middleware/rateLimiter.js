/**
 * Rate Limiting Middleware
 */

const rateLimit = require('express-rate-limit');


const { ipKeyGenerator } = require('express-rate-limit');

const createLimiter = (options = {}) => {
  return rateLimit({
    windowMs: options.windowMs || 15 * 60 * 1000,
    max: options.max || 100,
    message: {
      success: false,
      statusCode: 429,
      message: options.message || 'Too many requests from this IP, please try again later.',
    },

    standardHeaders: true,
    legacyHeaders: false,

    
    keyGenerator: (req) => {
      // Prioritize user ID if logged in
      if (req.user?.id) {
        return `user:${req.user.id}`;
      }
      // Fallback to IP with proper IPv6 handling
      return ipKeyGenerator(req);
    },

    skip: (req) => {
      return process.env.NODE_ENV === 'development' || 
             req.user?.role === 'admin';
    },

    handler: (req, res) => {
      console.warn(`[Rate Limit] Exceeded → IP: ${req.ip} | Path: ${req.path}`);
      res.status(429).json({
        success: false,
        statusCode: 429,
        message: options.message || 'Too many requests. Please try again later.'
      });
    }
  });
};

// ==================== RATE LIMITERS ====================

const apiLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 150,
});

const strictLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 8,
  message: 'Too many login/register attempts. Please try again later.',
  skipSuccessfulRequests: true
});

const searchLimiter = createLimiter({
  windowMs: 60 * 1000,
  max: 25,
  message: 'Too many search requests. Please slow down.'
});

const uploadLimiter = createLimiter({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: 'Too many upload attempts. Please try again later.'
});

// Chat limiter: limit chat requests to prevent token overuse.
// Defaults: 30 requests per hour per user (or IP). Admins and development are skipped.
const chatLimiter = createLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 30,
  message: 'Too many chat requests. Please wait and try again later.'
});

module.exports = {
  apiLimiter,
  strictLimiter,
  searchLimiter,
  uploadLimiter,
  chatLimiter,
  createLimiter
};
