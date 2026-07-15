import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
// import { AuthProvider } from './contexts/AuthProvider'; // Fixed path consistency if needed
import './index.css';
import './App.css';

// Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import FloatingAIChatbot from './services/FloatingAIChatbot';

// Pages
import Home from './pages/Home';
import Search from './pages/Search';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import AddRecipe from './pages/AddRecipe';
import MyRecipes from './pages/MyRecipes';
import UserRecipeDetail from './pages/UserRecipeDetail';
import Collections from './pages/Collections';
import AdminCollections from './pages/AdminCollections';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import ForgotPassword from './pages/ForgotPassword';
import Subscriptions from './pages/Subscriptions';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import AdminDashboard from './pages/AdminDashboard'; // Imported perfectly!

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col transition-colors duration-300 ease-in-out">
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
                <Route path="/collections" element={<Collections />} />
                
                {/*Unified Admin Section */}
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/collections" element={<AdminCollections />} />
                
                {/* Standard Public Pages */}
                <Route path="/about" element={<AboutUs />} />
                <Route path="/contact" element={<ContactUs />} />
                <Route path="/subscriptions" element={<Subscriptions />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
              </Routes>
            </main>

            <Footer />
            <FloatingAIChatbot />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;