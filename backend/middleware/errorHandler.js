/**
 * Centralized Error Handling Middleware
 * Should be registered as the LAST middleware in server.js
 */

class AppError extends Error {
  constructor(message, statusCode = 500, errorCode = null) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.isOperational = true; // Errors we can predict and handle
    Error.captureStackTrace(this, this.constructor);
  }
}

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message || 'Internal Server Error';
  error.statusCode = err.statusCode || 500;

  // Log error (you can later connect this to Winston or Sentry)
  console.error({
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.path,
    statusCode: error.statusCode,
    message: error.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    ip: req.ip,
    userId: req.user?.id || null
  });

  // ==================== DATABASE ERRORS ====================
  if (err.code === 'ER_DUP_ENTRY') {
    const fieldMatch = err.message.match(/for key '(.+?)'/);
    const field = fieldMatch ? fieldMatch[1].split('.').pop() : 'field';
    
    return res.status(409).json({
      success: false,
      statusCode: 409,
      message: `This ${field} is already taken`,
      error: 'DuplicateEntry'
    });
  }

  if (err.code === 'ER_NO_SUCH_TABLE') {
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Database configuration error',
      error: 'DatabaseError'
    });
  }

  // ==================== JWT ERRORS ====================
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      statusCode: 401,
      message: 'Invalid token. Please login again.',
      error: 'InvalidToken'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      statusCode: 401,
      message: 'Your session has expired. Please login again.',
      error: 'TokenExpired'
    });
  }

  // ==================== VALIDATION ERRORS ====================
  if (err.name === 'ValidationError' || err.statusCode === 400) {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      message: err.message || 'Validation failed',
      error: 'ValidationError'
    });
  }

  // ==================== DEFAULT ERROR ====================
  res.status(error.statusCode).json({
    success: false,
    statusCode: error.statusCode,
    message: error.message,
    ...(process.env.NODE_ENV === 'development' && { 
      stack: error.stack,
      errorType: err.name 
    })
  });
};

// Utility to create operational errors easily
const createError = (message, statusCode = 500, errorCode = null) => {
  return new AppError(message, statusCode, errorCode);
};

module.exports = {
  errorHandler,
  AppError,
  createError
};
