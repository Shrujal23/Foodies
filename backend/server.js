require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('./config/passport');
const swaggerUi = require('swagger-ui-express');
const swaggerConfig = require('./swaggerConfig');

const app = express();

// Import middleware
const requestLogger = require('./middleware/logger');
const { apiLimiter, strictLimiter, searchLimiter } = require('./middleware/rateLimiter');
const { errorHandler } = require('./middleware/errorHandler');

// Request logging middleware (should be early)
app.use(requestLogger);

// Middleware - ORDER IS IMPORTANT!
app.use(cors({
  origin: true, // Allow all origins in development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Apply rate limiting globally
app.use('/api/', apiLimiter);

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

// Swagger API documentation
const specs = swaggerConfig;
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  customCss: '.swagger-ui { padding: 20px; }'
}));

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
const reviewRoutes = require('./routes/reviews');
const adminRoutes = require('./routes/admin');
const bookmarkRoutes = require('./routes/bookmarks');

// Apply stricter rate limiting to auth routes
app.use('/api/auth/login', strictLimiter);
app.use('/api/auth/register', strictLimiter);

// Apply search rate limiter
app.use('/api/recipes/search', searchLimiter);

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipesRoutes);
app.use('/api/users', userRoutes);
app.use('/api', commentRoutes);
app.use('/api/recipes', reviewRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', bookmarkRoutes);

// Serve uploaded files (recipe images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    message: 'Endpoint not found',
    path: req.path
  });
});

// Centralized error handling middleware (MUST be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});