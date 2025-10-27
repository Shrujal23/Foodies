# Foodies - Recipe Sharing Platform

A full-stack web application for food enthusiasts to discover, share, and manage recipes. Users can create accounts, upload their own recipes, explore community recipes, save favorites, and engage with the community through comments.

## 🚀 Features

### User Authentication
- JWT-based authentication
- OAuth integration with Google and GitHub
- Secure user registration and login
- Session management

### Recipe Management
- Create, read, update, and delete user recipes
- Rich recipe details including ingredients, instructions, prep/cook time, servings
- Recipe difficulty levels (Easy, Medium, Hard)
- Image upload support
- Public recipe browsing

### Social Features
- Save favorite recipes
- Comment on recipes
- User profiles and recipe collections
- Community-driven content

### User Experience
- Responsive design with Tailwind CSS
- Modern React-based frontend
- Real-time notifications with toast messages
- Intuitive navigation and user interface

## 🛠 Tech Stack

### Frontend
- **React** 19.1.1 - UI framework
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **React Hot Toast** - Notification system
- **Heroicons** - Icon library
- **Headless UI** - Accessible UI components

### Backend
- **Node.js** with **Express.js** - Server framework
- **MySQL2** - Database
- **JWT** - Authentication tokens
- **Passport.js** - OAuth authentication
- **Bcrypt** - Password hashing
- **Multer** - File uploads
- **CORS** - Cross-origin resource sharing

### Development Tools
- **Nodemon** - Development server auto-restart
- **Create React App** - Frontend build tool
- **CRACO** - Create React App Configuration Override

## 📋 Prerequisites

- Node.js (v14 or higher)
- MySQL database
- npm or yarn package manager

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd foodies
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory with the following variables:
```env
PORT=5000
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=foodies_db
JWT_SECRET=your_jwt_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
SESSION_SECRET=your_session_secret
```

### 3. Database Setup
Create a MySQL database named `foodies_db` and run the schema:
```sql
-- Run the SQL commands from backend/db/collections_schema.sql
```

### 4. Frontend Setup
```bash
cd ../frontend
npm install
```

Create a `.env` file in the frontend directory:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 5. Start the Application

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📖 Usage

### User Registration & Login
1. Visit the application homepage
2. Click "Register" to create a new account or "Login" to sign in
3. Use email/password or OAuth providers (Google/GitHub)

### Creating Recipes
1. Navigate to "Add Recipe" from the dashboard
2. Fill in recipe details: title, description, prep/cook time, servings
3. Add ingredients and instructions dynamically
4. Upload an optional recipe image
5. Set difficulty level and submit

### Managing Recipes
1. View your recipes in "My Recipes"
2. Edit or delete recipes from the detailed view
3. Browse public recipes on the home page
4. Save favorite recipes for later

### Social Interaction
- Comment on any public recipe
- Save recipes to your favorites
- Share recipes with others

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/logout` - User logout
- `GET /api/auth/google` - Google OAuth
- `GET /api/auth/github` - GitHub OAuth
- `GET /api/auth/me` - Get current user info

### Recipes
- `GET /api/recipes` - Get all public recipes
- `GET /api/recipes/my-recipes` - Get user's recipes
- `GET /api/recipes/user/:id` - Get specific user recipe
- `POST /api/recipes` - Create new recipe
- `PUT /api/recipes/user/:id` - Update user recipe
- `DELETE /api/recipes/user/:id` - Delete user recipe
- `POST /api/recipes/:id/favorite` - Add to favorites
- `DELETE /api/recipes/:id/favorite` - Remove from favorites

### Comments
- `GET /api/comments/:recipeId` - Get recipe comments
- `POST /api/comments/:recipeId` - Add comment
- `PUT /api/comments/:id` - Update comment
- `DELETE /api/comments/:id` - Delete comment

## 📁 Project Structure

```
foodies/
├── backend/
│   ├── controllers/          # Route controllers
│   ├── db/                   # Database schemas and connections
│   ├── middleware/           # Authentication and validation middleware
│   ├── routes/               # API route definitions
│   ├── services/             # Business logic services
│   ├── uploads/              # File upload directory
│   ├── .env                  # Environment variables
│   ├── package.json
│   └── server.js             # Main server file
├── frontend/
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── components/       # Reusable React components
│   │   ├── contexts/         # React contexts (Auth, etc.)
│   │   ├── pages/            # Page components
│   │   ├── services/         # API service functions
│   │   └── App.js            # Main app component
│   ├── .env                  # Frontend environment variables
│   ├── package.json
│   └── tailwind.config.js    # Tailwind CSS configuration
├── .gitignore
├── LICENSE
├── package.json              # Root package.json (if needed)
└── README.md
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow existing code style and conventions
- Write clear, concise commit messages
- Test your changes thoroughly
- Update documentation as needed
- Ensure responsive design works on all devices

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with Create React App
- Icons provided by Heroicons
- UI components from Headless UI
- Styling with Tailwind CSS

---

**Happy Cooking! 🍳**
