const express = require('express');
const passport = require('passport');
const { createUserWithPassword, findUserByEmail, verifyPassword } = require('../db/database');
const router = express.Router();

// Route to initiate GitHub OAuth
router.get('/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

// GitHub OAuth callback route
router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: 'http://localhost:3000/login' }),
  (req, res) => {
    // Successful authentication, redirect home.
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
    // Successful authentication, redirect home.
    res.redirect('http://localhost:3000/dashboard');
  }
);

// Check authentication status
router.get('/status', async (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.json({
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
    
    // Fetch user data from database using the decoded userId
    const user = await require('../db/database').findUserById(decoded.userId);
    
    if (user) {
      // Remove sensitive information
      const { password_hash, ...userWithoutPassword } = user;
      res.json({
        isAuthenticated: true,
        user: userWithoutPassword
      });
    } else {
      res.json({
        isAuthenticated: false,
        user: null
      });
    }
  } catch (err) {
    console.error('Auth status error:', err);
    res.json({
      isAuthenticated: false,
      user: null
    });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const user = await findUserByEmail(email);
    if (!user || !user.password_hash) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await verifyPassword(user, password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Remove password hash from response
    const { password_hash, ...userWithoutPassword } = user;

    // Generate JWT token
    const token = require('jsonwebtoken').sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Log the user in
    req.login(userWithoutPassword, (err) => {
      if (err) {
        console.error('Login error:', err);
        return res.status(500).json({ error: 'Login failed' });
      }
      res.json({
        user: userWithoutPassword,
        token
      });
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Register route
router.post('/register', async (req, res) => {
  try {
    console.log('Registration attempt:', req.body); // Log the request body
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      console.log('Missing required fields:', { username: !!username, email: !!email, password: !!password });
      return res.status(400).json({ error: 'Username, email, and password required' });
    }

    // Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      console.log('User already exists with email:', email);
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    console.log('Creating new user with email:', email);
    const user = await createUserWithPassword(username, email, password);
    console.log('User created successfully:', user);

    // Return success without logging in
    console.log('User created successfully, redirecting to login');
    res.json({ 
      message: 'Registration successful', 
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed: ' + error.message });
  }
});

// Logout route
router.get('/logout', (req, res) => {
  req.logout(function(err) {
    if (err) {
      return res.status(500).json({ error: 'Error during logout' });
    }
    res.json({ success: true });
  });
});

module.exports = router;