import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderIcon,
  PlusIcon,
  LockClosedIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import RecipeCardEnhanced from '../components/recipes/RecipeCardEnhanced';
import EmptyState from '../components/common/EmptyState';
import AnimatedStatCard from '../components/common/AnimatedStatCard';
import Breadcrumbs from '../components/common/Breadcrumbs';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../config';

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setDashboardData({ isAuthenticated: false });
      setLoading(false);
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
        console.error(err);
        setError(err.message);
        if (err.message.includes('token') || err.message.includes('401')) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [user, authLoading, navigate]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-rose-50 dark:from-gray-950 dark:via-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
          <p className="text-xl font-medium text-gray-700 dark:text-gray-300">Loading your kitchen dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-rose-50 flex items-center justify-center px-6">
        <EmptyState
          title="Something went wrong"
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-rose-50 dark:from-gray-950 dark:via-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-6">

        {!dashboardData?.isAuthenticated ? (
          <div className="max-w-md mx-auto mt-20">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-12 text-center">
              <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-orange-100 to-pink-100 dark:from-orange-900 dark:to-pink-900 rounded-3xl flex items-center justify-center">
                <LockClosedIcon className="w-12 h-12 text-orange-600" />
              </div>

              <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                Welcome to Your Kitchen
              </h2>
              
              <p className="text-gray-600 dark:text-gray-400 mb-10 text-lg leading-relaxed">
                Sign in to access your saved recipes, collections, and personalized recommendations.
              </p>

              <div className="space-y-4">
                <button
                  onClick={() => navigate('/login')}
                  className="w-full py-4 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-semibold rounded-2xl hover:from-orange-600 hover:to-pink-700 transition-all active:scale-[0.97]"
                >
                  Login to Continue
                </button>

                <button
                  onClick={() => navigate('/register')}
                  className="w-full py-4 border-2 border-gray-300 dark:border-gray-600 font-medium rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                >
                  Create New Account
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <Breadcrumbs />

            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-3xl mb-6">
                <span className="font-medium text-orange-600">Welcome back</span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white mb-4">
                Namaste, {user?.display_name || user?.username}!
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Ready to cook something amazing today?
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
              <AnimatedStatCard 
                value={dashboardData?.totalFavorites || 0} 
                label="Saved Recipes" 
                color="pink"
              />
              <AnimatedStatCard 
                value={dashboardData?.collections?.length || 0} 
                label="Collections"             
                color="orange"
              />
              <AnimatedStatCard 
                value={dashboardData?.recentActivity?.length || 0} 
                label="Recent Activity"
                color="blue"
              />
              <AnimatedStatCard 
                value={dashboardData?.recentFavorites?.length || 0}
                label="This Month" 
                color="emerald"
              />
            </div>

            {dashboardData?.recentFavorites?.length > 0 && (
              <section className="mb-20">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Recently Saved
                  </h2>
                  <button
                onClick={() => navigate('/collections')}
                    className="text-orange-600 hover:text-orange-700 font-medium flex items-center gap-2"
                  >
                    View All →
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {dashboardData.recentFavorites.slice(0, 8).map((recipe) => (
                    <RecipeCardEnhanced 
                      key={recipe.recipe_id || recipe.id} 
                      recipe={recipe} 
                      isSaved={true}
                    />
                  ))}
                </div>
              </section>
            )}

            <section>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Your Collections</h2>
                <button 
                  onClick={() => toast.info('Collection creation coming soon!')}
                  className="flex items-center gap-3 px-6 py-3.5 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-semibold rounded-2xl hover:brightness-110 transition-all"
                >
                  <PlusIcon className="w-5 h-5" />
                  New Collection
                </button>
              </div>

              {dashboardData?.collections?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {dashboardData.collections.map((collection) => (
                    <div
                      key={collection.id}
                  onClick={() => navigate('/collections')}
                      className="group bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-pink-600 rounded-2xl flex items-center justify-center">
                          <FolderIcon className="w-9 h-9 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{collection.name}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {collection.recipe_count} recipes
                          </p>
                        </div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 line-clamp-3">
                        {collection.description || "A beautiful collection of homemade recipes."}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No Collections Yet"
                  description="Organize your favorite recipes into collections"
                  actions={[
                    { 
                      label: 'Create First Collection', 
                      onClick: () => toast.info('This feature is coming soon!'), 
                      primary: true 
                    }
                  ]}
                />
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
}