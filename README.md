# Foodies - Recipe Sharing Platform

[![React](https://img.shields.io/badge/React-JS-blue?logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green?logo=nodedotjs)](https://nodejs.org/)
[![MySQL](https.img.shields.io/badge/MySQL-Database-blue?logo=mysql)](https://www.mysql.com/)
[![Vercel](https://img.shields.io/badge/Frontend-Vercel-black?logo=vercel)](https://vercel.com/)
[![AWS](https://img.shields.io/badge/Backend-AWS_EC2-orange?logo=amazonaws)](https://aws.amazon.com/ec2/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

## 1. Project Overview

Foodies is a full-stack web application designed for culinary enthusiasts to discover, create, and share recipes. It provides a centralized platform for users to manage their personal recipes, explore community-contributed dishes, and interact through reviews and ratings. The project solves the common problem of disorganized recipe collections by offering a structured and feature-rich digital cookbook. A key feature is "Foody," an AI-powered assistant that offers real-time cooking advice, making the culinary experience more interactive and accessible.

## 2. Live Demo & Deployments

### Frontend (Vercel)
The React frontend is deployed on Vercel and is accessible here:
**https://foodies-dusky-sigma.vercel.app**

### Backend (AWS EC2)
The Node.js/Express REST API is hosted on an AWS EC2 instance.

> **Note:** As this is a personal cloud deployment for portfolio purposes, the EC2 instance is not running 24/7 to manage costs.

## 3. Features

- **User Authentication:** Secure user registration and login system with JWT.
- **User Profiles:** Personalized user profiles to manage recipes and activity.
- **Recipe Management:** Full CRUD (Create, Read, Update, Delete) functionality for recipes.
- **Recipe Browsing & Search:** Explore public recipes with advanced search and filtering by category.
- **Reviews and Ratings:** Users can rate recipes and leave detailed comments.
- **Bookmark/Save Recipes:** Save favorite recipes to a personal collection for easy access.
- **AI Recipe Assistant:** An integrated chatbot ("Foody") powered by the Groq API for instant recipe ideas, cooking tips, and ingredient substitutions.
- **Image Uploads:** Functionality to upload and associate images with recipes.
- **Protected Routes:** Secure access to user-specific features and data.
- **Admin Dashboard:** A dedicated interface for administrators to manage users and content.

## 4. Tech Stack

| Category      | Technology                                       |
|---------------|--------------------------------------------------|
| **Frontend**  | React.js, React Router, Context API, Tailwind CSS|
| **Backend**   | Node.js, Express.js                              |
| **Database**  | MySQL                                            |
| **Auth**      | JWT, Passport.js, Express Session                |
| **AI**        | Groq API                                         |
| **Deployment**| Vercel (Frontend), AWS EC2 (Backend)             |
| **API Docs**  | Swagger                                          |

## 5. System Architecture

The application follows a decoupled client-server architecture. The React frontend is served statically from Vercel, which communicates with a backend REST API deployed on an AWS EC2 instance. This API handles all business logic and interacts with a MySQL database.

```
User Browser
      |
      |
React Frontend (Vercel)
      |
      | (REST API Calls)
      |
Express REST API (AWS EC2)
      |
      | (Database Queries)
      |
MySQL Database
```

## 6. API Documentation

The backend API is documented using Swagger. You can explore the available endpoints and test them live.

**Swagger UI:** http://ec2-65-2-57-140.ap-south-1.compute.amazonaws.com:5000/api-docs

## 7. Environment Setup & Local Installation

To run this project locally, you will need Node.js and a MySQL instance.

### 1. Clone Repository
```bash
git clone <repository-url>
cd foodies
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory and add the following variables:
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
GROQ_API_KEY=your_groq_api_key
```

### 3. Database Setup
Ensure your MySQL server is running. Create a database named `foodies_db` and execute the schema files located in `backend/db/` to set up the required tables.

### 4. Frontend Setup
```bash
cd ../frontend
npm install
```
Create a `.env` file in the `frontend` directory:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 5. Run the Application

**Start Backend Server:**
```bash
cd backend
npm run dev
```

**Start Frontend Development Server:**
```bash
cd frontend
npm start
```
The application will be available at `http://localhost:3000`.

## 8. Folder Structure

```
foodies/
├── backend/
│   ├── controllers/      # Request/response handlers
│   ├── db/               # Database connection & schemas
│   ├── middleware/       # Auth and validation middleware
│   ├── routes/           # API route definitions
│   ├── services/         # Business logic
│   ├── .env.example
│   └── server.js         # Express server entry point
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/   # Reusable React components
    │   ├── contexts/     # Global state management
    │   ├── pages/        # Page-level components
    │   ├── services/     # API call functions
    │   └── App.js
    ├── .env.example
    └── package.json
```

## 9. Future Improvements

- **Recipe Collections:** Allow users to create and share public collections of recipes (e.g., "Weekly Dinners," "Holiday Baking").
- **Real-time Notifications:** Implement WebSockets for real-time notifications on new comments or recipe updates.
- **Advanced Search:** Integrate a more powerful search solution like Elasticsearch and using vector databases for faster and more relevant search results.
- **Unit & Integration Testing:** Increase test coverage for both frontend and backend to improve code reliability.

## License
This project is licensed under the MIT License. See the LICENSE file for details.
