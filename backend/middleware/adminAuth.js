/**
 * Admin Middleware
 * Checks if the authenticated user is an admin
 */

function isAdmin(req, res, next) {
  // Check if user is authenticated
  if (!req.user) {
    return res.status(401).json({
      success: false,
      statusCode: 401,
      message: 'Authentication required'
    });
  }

  // Check if user is admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      statusCode: 403,
      message: 'Admin access required'
    });
  }

  // User is authenticated and is admin
  next();
}

/**
 * Middleware to allow both authenticated users and admins
 * But admin gets special access
 */
function adminOrUser(req, res, next) {
  // Mark if user is admin for use in route handlers
  if (req.user) {
    req.isAdmin = req.user.role === 'admin';
  }
  next();
}

module.exports = {
  isAdmin,
  adminOrUser
};
