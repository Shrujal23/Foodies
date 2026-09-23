import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCircleIcon, MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import RecipeCardEnhanced from '../components/recipes/RecipeCardEnhanced';
import EmptyState from '../components/common/EmptyState';
import Breadcrumbs from '../components/common/Breadcrumbs';
import { apiFetch } from '../services/apiClient';
import { clearClientAuth } from '../services/authService';

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = useCallback(async () => {
    try {
      const res = await apiFetch('/users/dashboard');

      if (res.status === 401) {
        clearClientAuth();
        navigate('/login');
        return;
      }

      if (!res.ok) throw new Error('Failed to load dashboard');
      const data = await res.json();
      setDashboardData(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setDashboardData({ isAuthenticated: false });
      setLoading(false);
      return;
    }

    fetchDashboard();

    const refreshDashboard = () => fetchDashboard();
    window.addEventListener('favorites:updated', refreshDashboard);
    window.addEventListener('collections:updated', refreshDashboard);

    return () => {
      window.removeEventListener('favorites:updated', refreshDashboard);
      window.removeEventListener('collections:updated', refreshDashboard);
    };
  }, [user, authLoading, fetchDashboard]);

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fffaf7] dark:bg-gray-950">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
          <p className="text-base text-[#7f665a] dark:text-gray-300">Getting your kitchen ready...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fffaf7] px-6 dark:bg-gray-950">
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
    <div className="min-h-screen bg-[#fffaf7] py-8 dark:bg-gray-950 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {!dashboardData?.isAuthenticated ? (
          <div className="max-w-md mx-auto mt-20">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-12 text-center">
              <div className="w-24 h-24 mx-auto mb-8 bg-white/90 dark:bg-gray-800 rounded-3xl flex items-center justify-center shadow-lg">
                <UserCircleIcon className="w-14 h-14 text-orange-500" />
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

            <div className="mb-10 flex flex-col gap-6 border-b border-[#eadbd1] pb-8 dark:border-gray-800 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-orange-700 dark:text-orange-300">Your kitchen</p>
                <h1 className="text-4xl font-bold leading-tight text-[#35221a] dark:text-white sm:text-5xl">
                  Welcome back, {user?.display_name || user?.username}.
                </h1>
                <p className="mt-3 max-w-xl text-base leading-relaxed text-[#7f665a] dark:text-gray-400 sm:text-lg">
                  Keep the recipes you love close, and find something good for the next meal.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => navigate('/search')}
                  className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-400/50"
                >
                  <MagnifyingGlassIcon className="h-5 w-5" />
                  Find a recipe
                </button>
                <button
                  onClick={() => navigate('/recipes/add')}
                  className="inline-flex items-center gap-2 rounded-lg border border-[#ddc9bc] bg-white px-4 py-3 text-sm font-semibold text-[#765648] transition hover:border-orange-400 hover:text-orange-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
                >
                  <PlusIcon className="h-5 w-5" />
                  Add your own
                </button>
              </div>
            </div>

            <div className="mb-16 grid grid-cols-2 border-y border-[#eadbd1] bg-white dark:border-gray-800 dark:bg-gray-900 sm:grid-cols-4">
              {[
                { value: dashboardData?.totalFavorites || 0, label: 'saved recipes' },
                { value: dashboardData?.collections?.length || 0, label: 'collections' },
                { value: dashboardData?.recentActivity?.length || 0, label: 'recent activities' },
              ].map((stat, index) => (
                <div key={stat.label} className={`px-4 py-5 sm:px-6 ${index > 0 ? 'border-l border-[#eadbd1] dark:border-gray-800' : ''}`}>
                  <p className="text-3xl font-bold tabular-nums text-[#35221a] dark:text-white">{stat.value}</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#8f7568] dark:text-gray-500">{stat.label}</p>
                </div>
              ))}
            </div>

            {dashboardData?.recentFavorites?.length > 0 && (
              <section className="mb-20">
                <div className="mb-8 flex items-end justify-between gap-4 border-b border-[#eadbd1] pb-5 dark:border-gray-800">
                  <div>
                    <p className="mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-orange-700 dark:text-orange-300">Your shelf</p>
                    <h2 className="text-2xl font-bold text-[#35221a] dark:text-white sm:text-3xl">
                      Saved for later
                    </h2>
                  </div>
                  <button
                    onClick={() => navigate('/collections')}
                    className="text-sm font-semibold text-orange-700 hover:text-orange-800 dark:text-orange-300"
                  >
                    See all <span aria-hidden="true">→</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {dashboardData.recentFavorites.slice(0, 8).map((recipe) => (
                    <RecipeCardEnhanced 
                      key={recipe.recipe_id || recipe.id} 
                      recipe={recipe}
                    />
                  ))}
                </div>
              </section>
            )}

            {!dashboardData?.recentFavorites?.length && (
              <section className="border border-[#eadbd1] bg-white px-6 py-12 dark:border-gray-800 dark:bg-gray-900 sm:px-10">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-orange-700 dark:text-orange-300">A blank shelf is a beginning</p>
                <h2 className="mt-3 text-2xl font-bold text-[#35221a] dark:text-white sm:text-3xl">Save a recipe for your next meal.</h2>
                <p className="mt-3 max-w-xl text-base leading-relaxed text-[#7f665a] dark:text-gray-400">
                  Search for something you already know you love, or wander a little and keep the good surprises.
                </p>
                <button
                  onClick={() => navigate('/search')}
                  className="mt-6 rounded-lg bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-400/50"
                >
                  Browse recipes
                </button>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}