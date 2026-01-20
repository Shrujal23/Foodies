// src/pages/Dashboard.js
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import AuthWarningModal from '../components/common/AuthWarningModal';
import RecipeCard from '../components/recipes/RecipeCard';
import EmptyState from '../components/common/EmptyState';
import AnimatedStatCard from '../components/common/AnimatedStatCard';
import Breadcrumbs from '../components/common/Breadcrumbs';
import toastConfig from '../utils/toastConfig';
import { API_BASE_URL } from '../config';

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [showAuthWarning, setShowAuthWarning] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setShowAuthWarning(true);
      return;
    }

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
  if (authLoading) {
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
      <>
        <AuthWarningModal
          isOpen={showAuthWarning}
          onClose={() => navigate(-1)}
          onSignIn={() => navigate('/login', { state: { from: '/dashboard' } })}
        />
      </>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-white dark:from-gray-950 dark:via-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-6" />
          <p className="text-xl font-medium text-gray-700 dark:text-gray-300">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-white dark:from-gray-950 flex items-center justify-center px-6">
        <EmptyState
          icon="⚠️"
          title="Oops! Something went wrong"
          description={error}
          actions={[
            { label: 'Try Again', onClick: () => window.location.reload(), primary: true },
            { label: 'Go Home', to: '/' }
          ]}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-white dark:from-gray-950 dark:via-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-6">

        {/* Breadcrumbs */}
        <div className="mb-8">
          <Breadcrumbs />
        </div>

        {/* Hero Welcome */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent mb-4">
            Welcome back, {user.display_name || user.username}!
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Here's your cooking journey at a glance
          </p>
        </div>

        {/* Stats Grid - Animated */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <AnimatedStatCard 
            value={dashboardData?.totalFavorites || 0} 
            label="Saved Recipes" 
            icon="❤️"
            color="pink"
            duration={2000}
          />
          <AnimatedStatCard 
            value={dashboardData?.collections?.length || 0} 
            label="Collections" 
            icon="📁"
            color="orange"
            duration={2000}
          />
          <AnimatedStatCard 
            value={dashboardData?.recentActivity?.filter(a => a.activity_type === 'search').length || 0} 
            label="Searches"
            icon="🔍"
            color="blue"
            duration={2000}
          />
          <AnimatedStatCard 
            value={dashboardData?.recentFavorites?.length || 0}
            label="Recent Favorites" 
            icon="⭐"
            color="emerald"
            duration={2000}
          />
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
            <button 
              onClick={() => toastConfig.info('Create Collection feature coming soon!')}
              className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-bold rounded-2xl hover:from-orange-600 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-xl"
            >
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
            <EmptyState
              icon="📁"
              title="No Collections Yet"
              description="Organize your favorite recipes into beautiful collections"
              actions={[
                { label: 'Create Your First Collection', onClick: () => toastConfig.info('Create Collection feature coming soon!'), primary: true }
              ]}
              className="py-16 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl"
            />
          )}
        </section>
      </div>
    </div>
  );
}