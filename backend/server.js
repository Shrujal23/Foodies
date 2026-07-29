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

const chatRoutes = require('./routes/ai_routes');

const requestLogger = require('./middleware/logger');
const { apiLimiter, strictLimiter, searchLimiter, chatLimiter } = require('./middleware/rateLimiter');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

// Logging
app.use(requestLogger);

// CORS
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://foodies-dusky-sigma.vercel.app",
    "https://foodies-o39vn46h3-shrujal23s-projects.vercel.app"
];


app.use(cors({
    origin: function(origin, callback){

        if(!origin) return callback(null,true);

        if(allowedOrigins.includes(origin)){
            return callback(null,true);
        }

        return callback(new Error("Not allowed by CORS"));
    },
    credentials:true,
    methods:[
        "GET",
        "POST",
        "PUT",
        "DELETE",
        "OPTIONS"
    ],
    allowedHeaders:[
        "Content-Type",
        "Authorization",
        "Accept"
    ]
}));

// Body parser
app.use(express.json({
    limit:"10mb"
}));

app.use(express.urlencoded({
    extended:true,
    limit:"10mb"
}));

// Rate limiting
app.use('/api',apiLimiter);

app.use(
    '/api/auth/login',
    strictLimiter
);

app.use(
    '/api/auth/register',
    strictLimiter
);

app.use(
    '/api/recipes/search',
    searchLimiter
);

// Session
app.use(session({

    name:"foodies.sid",

    secret:process.env.SESSION_SECRET,

    resave:false,

    saveUninitialized:false,

    cookie:{
        secure:process.env.NODE_ENV==="production",
        httpOnly:true,
        maxAge:24*60*60*1000,
        sameSite:"lax"
    }

}));

// Passport
app.use(passport.initialize());

app.use(passport.session());

// Routes
const authRoutes = require('./routes/auth');
const recipesRoutes = require('./routes/recipes');
const userRoutes = require('./routes/users');
const userProfileRoutes = require('./routes/userProfile');
const reviewRoutes = require('./routes/reviews');
const adminRoutes = require('./routes/admin');
const bookmarkRoutes = require('./routes/bookmarks');


app.use('/api/auth',authRoutes);

app.use('/api/recipes',reviewRoutes);

app.use('/api/recipes',recipesRoutes);

app.use('/api/users',userRoutes);

app.use('/api/users',userProfileRoutes);

app.use('/api/admin',adminRoutes);

app.use('/api/bookmarks',bookmarkRoutes);

app.use('/api/chat', chatLimiter, chatRoutes);


app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
);

app.use(
    '/uploads',
    express.static(
        path.join(__dirname,'uploads')
    )
);

app.use((req,res)=>{

    res.status(404).json({

        success:false,

        statusCode:404,

        message:`Route not found: ${req.method} ${req.path}`

    });

});


app.use(errorHandler);

const PORT = process.env.PORT || 5000;
// Ensure DB schema migrations that are safe to run at startup
const { pool } = require('./db/database');

async function ensureSchema() {
    try {
        const [columns] = await pool.execute("SHOW COLUMNS FROM user_recipes LIKE 'cuisine'");
        if (columns.length === 0) {
            await pool.execute("ALTER TABLE user_recipes ADD COLUMN cuisine VARCHAR(100) DEFAULT 'international'");
        }
    } catch (err) {
        // Non-fatal: log the error so developer can apply migrations manually if needed
        console.warn('Schema migration warning:', err.message || err);
    }
}

(async () => {
    await ensureSchema();

    app.listen(PORT, "0.0.0.0", () => {
        console.log(
            `Server running on port ${PORT}`
        );

        console.log(
            `Swagger: http://localhost:${PORT}/api-docs`
        );
    });
})();