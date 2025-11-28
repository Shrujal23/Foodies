// src/pages/Dashboard.js
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HeartIcon,
  MagnifyingGlassIcon,
  ClockIcon,
  FolderIcon,
  PlusIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import RecipeCard from '../components/recipes/RecipeCard';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../config';

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (authLoading || !user) return;

    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE_URL}/users/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error('Failed to load dashboard');
        const data = await res.json();
        setDashboardData(data);
      } catch (err) {
        setError(err.message);
        if (err.message.includes('token')) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [user, authLoading, navigate]);

  // Loading States
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-white dark:from-gray-950 dark:via-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-6" />
          <p className="text-xl font-medium text-gray-700 dark:text-gray-300">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-white dark:from-gray-950 flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl p-10 text-center">
          <SparklesIcon className="w-16 h-16 mx-auto text-orange-500 mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to Your Culinary Hub
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Sign in to see your saved recipes, collections, and cooking journey
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-bold rounded-2xl hover:from-orange-600 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-xl"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/register')}
              className="px-8 py-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-bold rounded-2xl border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-300"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-white dark:from-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Oops! Something went wrong</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-bold rounded-2xl hover:from-orange-600 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-xl"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-white dark:from-gray-950 dark:via-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-6">

        {/* Hero Welcome */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent mb-4">
            Welcome back, {user.display_name || user.username}!
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Here's your cooking journey at a glance
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <StatCard title="Saved Recipes" value={dashboardData?.totalFavorites || 0} icon={HeartIcon} />
          <StatCard title="Collections" value={dashboardData?.collections?.length || 0} icon={FolderIcon} />
          <StatCard title="Recent Searches" value={dashboardData?.recentActivity?.filter(a => a.activity_type === 'search').length || 0} icon={MagnifyingGlassIcon} />
          <StatCard title="Last Active" value={dashboardData?.recentActivity?.[0]?.created_at ? new Date(dashboardData.recentActivity[0].created_at).toLocaleDateString() : 'Today'} icon={ClockIcon} />
        </div>

        {/* Recent Favorites */}
        {dashboardData?.recentFavorites?.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Your Recent Favorites</h2>
              <button
                onClick={() => navigate('/favorites')}
                className="text-orange-600 hover:text-orange-700 font-medium flex items-center gap-2"
              >
                View all <span aria-hidden="true">→</span>
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {dashboardData.recentFavorites.map((recipe) => (
                <div key={recipe.recipe_id} className="transform hover:scale-105 transition-all duration-500">
                  <RecipeCard recipe={recipe} initialFavorite={true} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Collections */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Your Collections</h2>
            <button className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-bold rounded-2xl hover:from-orange-600 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-xl">
              <PlusIcon className="w-6 h-6" />
              New Collection
            </button>
          </div>

          {dashboardData?.collections?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {dashboardData.collections.map(collection => (
                <div
                  key={collection.id}
                  className="group relative bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 cursor-pointer"
                  onClick={() => navigate(`/collections/${collection.id}`)}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-400/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="p-8 relative">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <FolderIcon className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{collection.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{collection.recipe_count} recipes</p>
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 line-clamp-2">
                      {collection.description || 'No description'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl">
              <FolderIcon className="w-20 h-20 mx-auto text-gray-400 mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">No Collections Yet</h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-8">
                Organize your favorite recipes into beautiful collections
              </p>
              <button className="px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-bold rounded-2xl hover:from-orange-600 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-xl">
                <PlusIcon className="w-6 h-6 inline mr-2" />
                Create Your First Collection
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

// Reusable StatCard (you can extract this to its own file later)
function StatCard({ title, value, icon: Icon }) {
  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-400/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{title}</p>
          <p className="mt-3 text-5xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
        <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-8 h-8 text-white" />
        </div>
      </div>
    </div>
  );
}