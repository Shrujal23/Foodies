require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const session = require('express-session');
const passport = require('./config/passport');
const swaggerUi = require('swagger-ui-express');
const swaggerConfig = require('./swaggerConfig');

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerSpec = swaggerJsdoc(swaggerConfig);

// Import middleware
const requestLogger = require('./middleware/logger');
const { apiLimiter, strictLimiter, searchLimiter } = require('./middleware/rateLimiter');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

// ====================== MIDDLEWARE ======================
app.use(requestLogger);

app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Global rate limiting
app.use('/api', apiLimiter);

// Session configuration
app.use(session({
  name: 'foodies.sid',
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: 'lax'
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// ====================== ROUTES ======================
const authRoutes = require('./routes/auth');
const recipesRoutes = require('./routes/recipes');
const userRoutes = require('./routes/users');
const reviewRoutes = require('./routes/reviews');
const adminRoutes = require('./routes/admin');
const bookmarkRoutes = require('./routes/bookmarks');

// Apply stricter rate limiting
app.use('/api/auth/login', strictLimiter);
app.use('/api/auth/register', strictLimiter);
app.use('/api/recipes/search', searchLimiter);

// Mount routes properly
app.use('/api/auth', authRoutes);
app.use('/api/recipes', reviewRoutes);
app.use('/api/recipes', recipesRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/bookmarks', bookmarkRoutes);

// Swagger Docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ====================== ERROR HANDLING ======================
// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    message: `Route not found: ${req.method} ${req.path}`
  });
});

// Global Error Handler (MUST be last)
app.use(errorHandler);

// ====================== START SERVER ======================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API Docs: http://localhost:${PORT}/api-docs`);
});