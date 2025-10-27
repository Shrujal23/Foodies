import { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { HeartIcon, MagnifyingGlassIcon, ClockIcon, FolderIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import RecipeCard from '../components/recipes/RecipeCard';
import StatCard from '../components/dashboard/StatCard';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (authLoading) return; // Wait for auth to complete
      
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found in localStorage');
          throw new Error('No authentication token found');
        }

        console.log('Fetching dashboard data...');
        const dashResponse = await fetch('http://localhost:5000/api/users/dashboard', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!dashResponse.ok) {
          const errorData = await dashResponse.json();
          console.error('Dashboard response not OK:', dashResponse.status, errorData);
          throw new Error(errorData.error || 'Failed to fetch dashboard data');
        }

        const dashData = await dashResponse.json();
        console.log('Dashboard data received:', dashData);
        setDashboardData(dashData);
        setError(null);
      } catch (error) {
        console.error('Dashboard fetch error:', error);
        setError(error.message);
        // If token is invalid, trigger a new auth check
        if (error.message === 'Invalid token') {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, authLoading]);

  if (authLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading authentication...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Error Loading Dashboard</h2>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Welcome, {user.display_name || user.username}!</h2>
      </div>

      {/* Stats Section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Stats</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Saved Recipes"
            value={dashboardData?.totalFavorites || 0}
            icon={HeartIcon}
          />
          <StatCard
            title="Recent Searches"
            value={dashboardData?.recentActivity?.filter(a => a.activity_type === 'search').length || 0}
            icon={MagnifyingGlassIcon}
          />
          <StatCard
            title="Last Active"
            value={dashboardData?.recentActivity?.[0]?.created_at 
              ? new Date(dashboardData.recentActivity[0].created_at).toLocaleDateString()
              : 'Never'}
            icon={ClockIcon}
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="bg-white rounded-lg shadow-sm p-6">
          {dashboardData?.recentActivity?.length > 0 ? (
            <ActivityFeed activities={dashboardData.recentActivity} />
          ) : (
            <p className="text-gray-500 text-center">No recent activity</p>
          )}
        </div>
      </div>

      {/* Collections Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Your Collections</h3>
          <button 
            onClick={() => {
              // TODO: Implement new collection creation
              toast.info('Creating new collections will be available soon!');
            }}
            className="inline-flex items-center px-4 py-2 bg-accent-600 text-white text-sm font-medium rounded-lg hover:bg-accent-700 transition duration-150 ease-in-out"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            New Collection
          </button>
        </div>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {dashboardData?.collections?.length > 0 ? (
            dashboardData.collections.map(collection => (
              <div key={collection.id} className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 hover:shadow-md transition duration-150 ease-in-out">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <FolderIcon className="h-5 w-5 text-accent-600 mr-2" />
                    <h4 className="font-medium text-gray-900">{collection.name}</h4>
                  </div>
                  <span className="text-sm text-gray-500">{collection.recipe_count} recipes</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{collection.description || 'No description provided'}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Created {new Date(collection.created_at).toLocaleDateString()}</span>
                  <button 
                    onClick={() => navigate(`/collections/${collection.id}`)} 
                    className="text-sm text-accent-600 hover:text-accent-700"
                  >
                    View
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8 bg-gray-50 rounded-lg">
              <FolderIcon className="h-12 w-12 mx-auto text-gray-400 mb-3" />
              <h4 className="text-lg font-medium text-gray-900 mb-1">No Collections Yet</h4>
              <p className="text-sm text-gray-600 mb-4">Create your first collection to organize your favorite recipes</p>
              <button 
                onClick={() => {
                  // TODO: Implement new collection creation
                  toast.info('Creating new collections will be available soon!');
                }}
                className="inline-flex items-center px-4 py-2 bg-accent-600 text-white text-sm font-medium rounded-lg hover:bg-accent-700 transition duration-150 ease-in-out"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Create Collection
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Favorite Recipes */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Favorite Recipes</h3>
        {dashboardData?.recentFavorites?.length > 0 ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {dashboardData.recentFavorites.map((recipe) => (
              <RecipeCard
                key={recipe.recipe_id}
                recipe={recipe}
                initialFavorite={true}
                onFavoriteToggle={async (recipe, isFavorite) => {
                  // Refetch dashboard data after toggling favorite
                  const response = await fetch('/api/users/dashboard', {
                    credentials: 'include'
                  });
                  const newData = await response.json();
                  setDashboardData(newData);
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">You haven't saved any recipes yet.</p>
          </div>
        )}
      </div>

      {/* Top Categories */}
      {dashboardData?.topCategories?.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Top Categories</h3>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {dashboardData.topCategories.map((category, index) => (
                <div key={category.category} className="text-center">
                  <div className="text-2xl font-bold text-indigo-600 mb-1">{category.count}</div>
                  <div className="text-sm text-gray-500">{category.category}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}