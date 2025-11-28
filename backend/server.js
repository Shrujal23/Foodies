require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('./config/passport');

const app = express();

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Middleware - ORDER IS IMPORTANT!
app.use(cors({
  origin: true, // Allow all origins in development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Ensure required secrets exist
if (!process.env.JWT_SECRET) {
  throw new Error('Missing required env var JWT_SECRET');
}
if (!process.env.SESSION_SECRET) {
  throw new Error('Missing required env var SESSION_SECRET');
}

// Session configuration - Add these critical options
app.use(session({
  name: 'foodies.sid', // Give the session a specific name
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true if using HTTPS
    httpOnly: true, // Prevents client-side JS from reading the cookie
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'lax' // Helps with CSRF protection
  }
}));

// Passport initialization - MUST come after session
app.use(passport.initialize());
app.use(passport.session());

// Database connection
const mysql = require('mysql2/promise');
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Import routes
const authRoutes = require('./routes/auth');
const recipesRoutes = require('./routes/recipes');
const userRoutes = require('./routes/users');
const commentRoutes = require('./routes/comments');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipesRoutes);
app.use('/api/users', userRoutes);
app.use('/api', commentRoutes);

// Serve uploaded files (recipe images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Debug route to check authentication
app.get('/api/debug-auth', (req, res) => {
  res.json({
    authenticated: req.isAuthenticated(),
    user: req.user,
    sessionId: req.sessionID,
    session: req.session
  });
});

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Foodies API' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});