import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import {
  ChartBarIcon,
  UserGroupIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  BookmarkIcon,
  FolderIcon,
  ShieldCheckIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

import AdminCollections from './AdminCollections';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('statistics');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRecipes: 0,
    totalReviews: 0,
    totalFavorites: 0
  });
  const [listData, setListData] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const isAdmin = user?.role === 'admin';

  // 1. Fetch Global Numerical KPIs
  const fetchStatistics = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/admin/statistics`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const resData = await response.json();
      if (resData.success) {
        setStats(resData.data);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to load system metrics');
    } finally {
      setLoading(false);
    }
  };

  // 2. Dynamic Loader for Minimal Lists (Users / Reviews / Recipes)
  const loadTabList = async (tabName) => {
    if (tabName === 'statistics' || tabName === 'collections') return;
    setDataLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/admin/${tabName}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const resData = await response.json();
      if (resData.success) {
        setListData(resData.data || []);
      }
    } catch (error) {
      toast.error(`Failed to load ${tabName}`);
      setListData([]);
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  useEffect(() => {
    loadTabList(activeTab);
  }, [activeTab]);

  // Guard non-admin users early so the page never renders unprotected data
  if (user && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 py-12">
        <div className="max-w-xl w-full rounded-3xl border border-red-200 dark:border-red-900/60 bg-white dark:bg-gray-900 shadow-lg p-8 text-center">
          <h1 className="text-2xl font-semibold text-red-700 dark:text-red-300">Admin access required</h1>
          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">Only users with an admin role can access this dashboard.</p>
        </div>
      </div>
    );
  }

  // 3. Destructive Moderation Handlers
  const handleDeleteItem = async (itemId) => {
    if (!window.confirm(`Permanently remove this item from the database?`)) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/admin/${activeTab}/${itemId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const resData = await response.json();
      if (resData.success) {
        toast.success('Item dropped cleanly');
        setListData(prev => prev.filter(item => (item.id !== itemId && item.recipe_id !== itemId)));
        fetchStatistics(); 
      }
    } catch (err) {
      toast.error('Deletion failed');
    }
  };

  const handleRoleToggle = async (userId, currentRole) => {
    const targetRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role: targetRole })
      });
      const resData = await response.json();
      if (resData.success) {
        toast.success('User status updated');
        setListData(prev => prev.map(u => u.id === userId ? { ...u, role: targetRole } : u));
      }
    } catch (err) {
      toast.error('Could not overwrite structural user tier');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 text-gray-900 dark:text-white min-h-screen">
      
      {/* Title Header Block */}
      <div className="mb-10">
        <h1 className="text-4xl font-black tracking-tight">System Control Panel</h1>
        <p className="text-gray-500 mt-2">Central hub for platform metric evaluation and data entity modification.</p>
      </div>

      {/* Metrics Counters Dashboard Layout */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {[
          { label: 'Total Accounts', count: stats.totalUsers, border: 'border-blue-500', icon: UserGroupIcon },
          { label: 'Community Recipes', count: stats.totalRecipes, border: 'border-orange-500', icon: BookmarkIcon },
          { label: 'Platform Reviews', count: stats.totalReviews, border: 'border-pink-500', icon: ChatBubbleOvalLeftEllipsisIcon },
          { label: 'Total Favorites', count: stats.totalFavorites, border: 'border-yellow-500', icon: ChartBarIcon },
        ].map((card, key) => {
          const Icon = card.icon;
          return (
            <div key={key} className={`bg-white dark:bg-gray-900 p-6 rounded-2xl border border-l-4 ${card.border} dark:border-y-gray-800 dark:border-r-gray-800 shadow-sm`}>
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{card.label}</span>
                <Icon className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-3xl font-black mt-4">{loading ? '...' : card.count}</p>
            </div>
          );
        })}
      </div>

      {/* Control Split Panel Interface */}
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Simple Horizontal/Vertical Navigation Track */}
        <div className="w-full lg:w-60 flex lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 shrink-0">
          {[
            { id: 'statistics', name: 'Overview', icon: ChartBarIcon },
            { id: 'users', name: 'Users', icon: UserGroupIcon },
            { id: 'recipes', name: 'Recipes', icon: BookmarkIcon },
            { id: 'reviews', name: 'Reviews', icon: ChatBubbleOvalLeftEllipsisIcon },
            { id: 'collections', name: 'Collections', icon: FolderIcon },
          ].map(btn => {
            const TabIcon = btn.icon;
            return (
              <button
                key={btn.id}
                onClick={() => setActiveTab(btn.id)}
                className={`w-full text-left px-4 py-3 rounded-xl font-medium text-sm transition whitespace-nowrap ${
                  activeTab === btn.id
                    ? 'bg-orange-600 text-white shadow-sm'
                    : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <TabIcon className={`h-5 w-5 ${activeTab === btn.id ? 'text-white' : 'text-gray-400 dark:text-gray-500'}`} />
                  {btn.name}
                </div>
              </button>
            );
          })}
        </div>

        {/* Dynamic Action Rendering Window */}
        <div className="flex-1 bg-white dark:bg-gray-900 rounded-2xl border dark:border-gray-800 shadow-sm p-6 min-w-0">
          
          {activeTab === 'statistics' && (
            <div className="text-center py-16 text-gray-400">
              <Cog6ToothIcon className="mx-auto h-12 w-12 text-orange-500" />
              <h3 className="font-bold text-gray-800 dark:text-white text-lg mt-3">Platform integrity</h3>
              <p className="text-sm max-w-xs mx-auto mt-1">Select a section to review users, recipes, reviews, or collections.</p>
            </div>
          )}

          {/* Collections Nested Interface */}
          {activeTab === 'collections' && <AdminCollections />}

          {/* Minimalist Uniform Lists for All Other Models */}
          {activeTab !== 'statistics' && activeTab !== 'collections' && (
            dataLoading ? (
              <div className="text-center py-10 text-gray-400 animate-pulse">Querying relation vectors...</div>
            ) : listData.length === 0 ? (
              <div className="text-center py-10 text-gray-400">No managed instances found for this data schema.</div>
            ) : (
              <div className="divide-y dark:divide-gray-800">
                {listData.map((item) => (
                  <div key={item.id || item.recipe_id} className="py-4 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                    
                    <div className="min-w-0 flex-1">
                      {activeTab === 'users' && (
                        <>
                          <h4 className="font-bold text-base truncate">{item.display_name || item.username}</h4>
                          <p className="text-xs text-gray-400">{item.email} • Current Role: <span className="font-bold text-orange-500 capitalize">{item.role}</span></p>
                        </>
                      )}
                      {activeTab === 'recipes' && (
                        <>
                          <h4 className="font-bold text-base truncate">{item.title}</h4>
                          <p className="text-xs text-gray-400">Author Account: {item.username || 'Anonymous'} • Total Review Tags: {item.review_count}</p>
                        </>
                      )}
                      {activeTab === 'reviews' && (
                        <>
                          <h4 className="font-bold text-base truncate">"{item.comment || 'No written input text'}"</h4>
                          <p className="text-xs text-gray-400">User: {item.username || 'Anonymous'} • Given Rating: <span className="text-yellow-500 font-bold">★ {item.rating}</span></p>
                        </>
                      )}
                    </div>

                    {/* Action Operations Column */}
                    <div className="flex items-center gap-2 shrink-0">
                      {activeTab === 'users' && (
                        <button
                          onClick={() => handleRoleToggle(item.id, item.role)}
                          className="px-2.5 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-xs font-bold rounded-lg transition"
                        >
                          Make {item.role === 'admin' ? 'User' : 'Admin'}
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteItem(item.id || item.recipe_id)}
                        className="px-2.5 py-1.5 bg-red-600/10 hover:bg-red-600 text-red-600 hover:text-white text-xs font-bold rounded-lg transition"
                      >
                        Delete
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )
          )}

        </div>
      </div>
    </div>
  );
}