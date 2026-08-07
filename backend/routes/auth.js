const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const {
  createUserWithPassword,
  findUserByEmail,
  findUserByEmailOrUsername,
  verifyPassword,
  findUserById
} = require('../db/database');
const { validateLogin, validateRegister } = require('../middleware/validation');
const { extractToken, setAuthCookie, clearAuthCookie } = require('../utils/authToken');
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
// ====================== AUTH STATUS ======================
// Reads JWT from httpOnly cookie OR Authorization Bearer (no token echoed back)
router.get('/status', async (req, res) => {
  const token = extractToken(req);

  if (!token) {
    return res.json({
      success: true,
      isAuthenticated: false,
      user: null
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await findUserById(decoded.userId);

    if (user) {
      const { password_hash, ...userWithoutPassword } = user;
      return res.json({
        success: true,
        isAuthenticated: true,
        user: userWithoutPassword
      });
    }
  } catch (err) {
    // Do not log token; treat as signed out
    console.error('Auth status error:', err.name, err.message);
  }

  res.json({
    success: true,
    isAuthenticated: false,
    user: null
  });
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
router.post('/login', validateLogin, async (req, res) => {
  // Generic failure message — avoid user enumeration
  const invalidMsg = 'Invalid username/email or password';

  try {
    let { identifier, password } = req.body;
    identifier = String(identifier || '').trim();
    // Normalize email lookups (usernames stay case-sensitive as stored)
    if (identifier.includes('@')) {
      identifier = identifier.toLowerCase();
    }

    const user = await findUserByEmailOrUsername(identifier);
    if (!user || !user.password_hash) {
      return res.status(401).json({ success: false, message: invalidMsg });
    }

    const isValidPassword = await verifyPassword(user, password);
    if (!isValidPassword) {
      return res.status(401).json({ success: false, message: invalidMsg });
    }

    const { password_hash, ...userWithoutPassword } = user;

    const rememberMe = Boolean(req.body.rememberMe);
    const expiresIn = rememberMe ? '7d' : '24h';

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn }
    );

    // Textbook: put JWT in httpOnly cookie — not readable by document.cookie / XSS
    setAuthCookie(res, token, rememberMe);

    // Do NOT return token in JSON body (would be readable by any JS on the page)
    res.json({
      success: true,
      message: 'Login successful',
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Login failed. Please try again.'
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
router.post('/register', validateRegister, async (req, res) => {
  try {
    const username = String(req.body.username || '').trim();
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = req.body.password;

    const existingByEmail = await findUserByEmail(email);
    if (existingByEmail) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists'
      });
    }

    // Username uniqueness (same helper works for exact username match)
    const existingByUsername = await findUserByEmailOrUsername(username);
    if (existingByUsername) {
      return res.status(409).json({
        success: false,
        message: 'This username is already taken'
      });
    }

    const user = await createUserWithPassword(username, email, password);

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    // Duplicate key safety net
    if (error && error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        success: false,
        message: 'An account with this email or username already exists'
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Registration failed. Please try again.'
    });
  }
});

// Route to initiate GitHub OAuth
router.get('/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

// GitHub OAuth callback route
router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => {
    const frontendUrl = 'http://localhost:3000';
    res.redirect(`${frontendUrl}/dashboard`);
  }
);

// Route to initiate Google OAuth
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google OAuth callback route
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    const frontendUrl = 'http://localhost:3000';
    res.redirect(`${frontendUrl}/dashboard`);
  }
);

// Logout — always clear JWT cookie (even if passport session fails)
router.get('/logout', (req, res) => {
  clearAuthCookie(res);

  const finish = () => {
    res.json({ success: true, message: 'Logged out successfully' });
  };

  if (typeof req.logout === 'function') {
    req.logout(function (err) {
      if (err) {
        console.error('Passport logout error:', err.message);
      }
      finish();
    });
  } else {
    finish();
  }
});

// Also support POST logout (same behavior)
router.post('/logout', (req, res) => {
  clearAuthCookie(res);
  res.json({ success: true, message: 'Logged out successfully' });
});

module.exports = router;