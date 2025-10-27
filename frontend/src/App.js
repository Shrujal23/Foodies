import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import './index.css';
import './App.css';

// Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import Home from './pages/Home';
import Search from './pages/Search';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import AddRecipe from './pages/AddRecipe';
import MyRecipes from './pages/MyRecipes';
import UserRecipeDetail from './pages/UserRecipeDetail';

function App() {

  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col transition-colors duration-300">
          <Toaster position="top-center" />
          <Navbar />

          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/recipes/add" element={<AddRecipe />} />
              <Route path="/my-recipes" element={<MyRecipes />} />
              <Route path="/recipes/user/:id" element={<UserRecipeDetail />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
