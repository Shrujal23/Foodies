const jwt = require('jsonwebtoken');
const { findUserById } = require('../db/database');

async function isAuthenticated(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false,
        statusCode: 401,
        message: 'No token provided' 
      });
    }

    const token = authHeader.split(' ')[1];
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await findUserById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ 
        success: false,
        statusCode: 401,
        message: 'User not found' 
      });
    }

    // strip password and other sensitive fields before attaching user to request
    const { password_hash, ...userWithoutPassword } = user;
    req.user = userWithoutPassword;
    next();
  } catch (err) {
    console.error('Auth middleware error:', err.name, err.message);

    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ 
        success: false,
        statusCode: 401,
        message: 'Token expired' 
      });
    }

    // If token is invalid, respond 401 so the client can re-authenticate
    return res.status(401).json({
      success: false,
      statusCode: 401,
      message: 'Invalid token'
    });
  }
}

module.exports = isAuthenticated;