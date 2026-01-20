const express = require('express');
const passport = require('passport');
const { createUserWithPassword, findUserByEmail, verifyPassword } = require('../db/database');
const { validateLogin, validateRegister } = require('../middleware/validation');
const router = express.Router();

/**
 * @swagger
 * /api/auth/status:
 *   get:
 *     summary: Check authentication status
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Authentication status
 */
router.get('/status', async (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.json({
      success: true,
      isAuthenticated: false,
      user: null
    });
  }

  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = require('jsonwebtoken').verify(
      token,
      process.env.JWT_SECRET
    );
    
    const user = await require('../db/database').findUserById(decoded.userId);
    
    if (user) {
      const { password_hash, ...userWithoutPassword } = user;
      res.json({
        success: true,
        isAuthenticated: true,
        user: userWithoutPassword
      });
    } else {
      res.json({
        success: true,
        isAuthenticated: false,
        user: null
      });
    }
  } catch (err) {
    console.error('Auth status error:', err);
    res.status(401).json({
      success: false,
      statusCode: 401,
      message: 'Invalid token'
    });
  }
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login with email and password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post('/login', validateLogin, async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await findUserByEmail(email);
    if (!user || !user.password_hash) {
      return res.status(401).json({
        success: false,
        statusCode: 401,
        message: 'Invalid email or password'
      });
    }

    const isValidPassword = await verifyPassword(user, password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        statusCode: 401,
        message: 'Invalid email or password'
      });
    }

    const { password_hash, ...userWithoutPassword } = user;

    const token = require('jsonwebtoken').sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Login failed'
    });
  }
});

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Registration successful
 */
router.post('/register', validateRegister, async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        statusCode: 409,
        message: 'User with this email already exists'
      });
    }

    const user = await createUserWithPassword(username, email, password);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Registration failed'
    });
  }
});

// Route to initiate GitHub OAuth
router.get('/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

// GitHub OAuth callback route
router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: 'http://localhost:3000/login' }),
  (req, res) => {
    res.redirect('http://localhost:3000/dashboard');
  }
);

// Route to initiate Google OAuth
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google OAuth callback route
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: 'http://localhost:3000/login' }),
  (req, res) => {
    res.redirect('http://localhost:3000/dashboard');
  }
);

// Logout route
router.get('/logout', (req, res) => {
  req.logout(function(err) {
    if (err) {
      return res.status(500).json({
        success: false,
        statusCode: 500,
        message: 'Error during logout'
      });
    }
    res.json({
      success: true,
      message: 'Logout successful'
    });
  });
});

module.exports = router;