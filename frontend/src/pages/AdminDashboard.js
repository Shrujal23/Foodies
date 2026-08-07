import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { apiFetch } from '../services/apiClient';
import toast from 'react-hot-toast';
import {
  ChartBarIcon,
  UserGroupIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  BookmarkIcon,
  FolderIcon,
  MagnifyingGlassIcon,
  TrashIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';

import AdminCollections from './AdminCollections';

const TABS = [
  { id: 'users', name: 'Users', icon: UserGroupIcon, description: 'Accounts and roles' },
  { id: 'recipes', name: 'Recipes', icon: BookmarkIcon, description: 'Community recipes' },
  { id: 'reviews', name: 'Reviews', icon: ChatBubbleOvalLeftEllipsisIcon, description: 'Ratings and comments' },
  { id: 'collections', name: 'Collections', icon: FolderIcon, description: 'Public collections' },
];

export default function AdminDashboard() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab');
  const initialTab = TABS.some((t) => t.id === tabFromUrl) ? tabFromUrl : 'users';

  const [activeTab, setActiveTab] = useState(initialTab);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRecipes: 0,
    totalReviews: 0,
    totalFavorites: 0,
  });
  const [listData, setListData] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [query, setQuery] = useState('');
  const isAdmin = user?.role === 'admin';

  const activeMeta = TABS.find((t) => t.id === activeTab) || TABS[0];

  const fetchStatistics = async () => {
    try {
      const response = await apiFetch('/admin/statistics');
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

  const loadTabList = async (tabName) => {
    if (tabName === 'collections') return;
    setDataLoading(true);
    try {
      const response = await apiFetch(`/admin/${tabName}`);
      const resData = await response.json();
      if (resData.success) {
        setListData(resData.data || []);
      } else {
        setListData([]);
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
    const next = TABS.some((t) => t.id === tabFromUrl) ? tabFromUrl : 'users';
    setActiveTab(next);
    setQuery('');
  }, [tabFromUrl]);

  useEffect(() => {
    loadTabList(activeTab);
  }, [activeTab]);

  const selectTab = (tabId) => {
    setActiveTab(tabId);
    setQuery('');
    setSearchParams(tabId === 'users' ? {} : { tab: tabId });
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Permanently remove this item from the database?')) return;
    try {
      const response = await apiFetch(`/admin/${activeTab}/${itemId}`, {
        method: 'DELETE',
      });
      const resData = await response.json();
      if (resData.success) {
        toast.success('Item deleted');
        setListData((prev) =>
          prev.filter((item) => item.id !== itemId && item.recipe_id !== itemId)
        );
        fetchStatistics();
      } else {
        toast.error(resData.message || 'Deletion failed');
      }
    } catch (err) {
      toast.error('Deletion failed');
    }
  };

  const handleRoleToggle = async (userId, currentRole) => {
    const targetRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      const response = await apiFetch(`/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: targetRole }),
      });
      const resData = await response.json();
      if (resData.success) {
        toast.success(`Role updated to ${targetRole}`);
        setListData((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: targetRole } : u))
        );
      } else {
        toast.error(resData.message || 'Could not update role');
      }
    } catch (err) {
      toast.error('Could not update user role');
    }
  };

  const filteredList = useMemo(() => {
    if (!query.trim()) return listData;
    const q = query.toLowerCase();
    return listData.filter((item) => {
      const haystack = [
        item.display_name,
        item.username,
        item.email,
        item.title,
        item.comment,
        item.role,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [listData, query]);

  if (user && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-gray-950 px-4 py-12">
        <div className="max-w-xl w-full rounded-3xl border border-red-300 dark:border-red-900/60 bg-white dark:bg-gray-900 shadow-lg p-8 text-center">
          <ShieldCheckIcon className="mx-auto h-12 w-12 text-red-600 dark:text-red-500 mb-4" />
          <h1 className="text-2xl font-semibold text-red-800 dark:text-red-300">
            Admin access required
          </h1>
          <p className="mt-3 text-sm text-slate-600 dark:text-gray-400">
            Only users with an admin role can access this dashboard.
          </p>
        </div>
      </div>
    );
  }

  const metricCards = [
    {
      label: 'Accounts',
      count: stats.totalUsers,
      accent: 'border-l-blue-600',
      iconWrap: 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300',
      icon: UserGroupIcon,
    },
    {
      label: 'Recipes',
      count: stats.totalRecipes,
      accent: 'border-l-orange-600',
      iconWrap: 'bg-orange-50 text-orange-700 dark:bg-orange-950/50 dark:text-orange-300',
      icon: BookmarkIcon,
    },
    {
      label: 'Reviews',
      count: stats.totalReviews,
      accent: 'border-l-pink-600',
      iconWrap: 'bg-pink-50 text-pink-700 dark:bg-pink-950/50 dark:text-pink-300',
      icon: ChatBubbleOvalLeftEllipsisIcon,
    },
    {
      label: 'Favorites',
      count: stats.totalFavorites,
      accent: 'border-l-amber-500',
      iconWrap: 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300',
      icon: ChartBarIcon,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-12 text-slate-900 dark:text-white">
        <div className="mb-8 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            Admin Dashboard
          </h1>
          <p className="text-slate-600 dark:text-gray-400 mt-2 text-sm sm:text-base">
            Moderate users, recipes, reviews, and collections from one place.
          </p>
        </div>

        {/* KPI strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-8 sm:mb-10">
          {metricCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className={`bg-white dark:bg-gray-900 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-gray-800 border-l-4 ${card.accent} shadow-sm`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-bold text-slate-600 dark:text-gray-400 uppercase tracking-wider">
                    {card.label}
                  </span>
                  <span className={`inline-flex p-1.5 rounded-lg ${card.iconWrap}`}>
                    <Icon className="h-5 w-5" />
                  </span>
                </div>
                <p className="text-3xl font-black mt-3 text-slate-900 dark:text-white">
                  {loading ? '…' : card.count}
                </p>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Side nav */}
          <div className="w-full lg:w-64 flex lg:flex-col gap-2 overflow-x-auto pb-1 lg:pb-0 shrink-0">
            {TABS.map((btn) => {
              const TabIcon = btn.icon;
              const selected = activeTab === btn.id;
              return (
                <button
                  key={btn.id}
                  type="button"
                  onClick={() => selectTab(btn.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl font-medium text-sm transition whitespace-nowrap border ${
                    selected
                      ? 'bg-orange-600 border-orange-700 text-white shadow-md shadow-orange-600/20'
                      : 'bg-white dark:bg-gray-900 border-slate-200 dark:border-gray-800 text-slate-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <TabIcon
                      className={`h-5 w-5 shrink-0 ${
                        selected ? 'text-white' : 'text-slate-500 dark:text-gray-400'
                      }`}
                    />
                    <span>
                      <span className="block font-semibold">{btn.name}</span>
                      <span
                        className={`block text-xs font-normal mt-0.5 ${
                          selected ? 'text-orange-100' : 'text-slate-500 dark:text-gray-500'
                        }`}
                      >
                        {btn.description}
                      </span>
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Main panel */}
          <div className="flex-1 bg-white dark:bg-gray-900 rounded-2xl border border-slate-200 dark:border-gray-800 shadow-sm min-w-0 overflow-hidden">
            <div className="px-5 sm:px-6 py-5 border-b border-slate-200 dark:border-gray-800 bg-slate-50/80 dark:bg-gray-900/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {activeMeta.name}
                </h2>
                <p className="text-sm text-slate-600 dark:text-gray-400 mt-0.5">
                  {activeMeta.description}
                </p>
              </div>

              {activeTab !== 'collections' && (
                <div className="relative w-full sm:w-72">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 dark:text-gray-400" />
                  <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={`Filter ${activeMeta.name.toLowerCase()}…`}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-slate-900 dark:text-white text-sm placeholder:text-slate-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              )}
            </div>

            <div className="p-5 sm:p-6">
              {activeTab === 'collections' ? (
                <AdminCollections embedded />
              ) : dataLoading ? (
                <div className="text-center py-16 text-slate-600 dark:text-gray-400">
                  <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  Loading {activeMeta.name.toLowerCase()}…
                </div>
              ) : filteredList.length === 0 ? (
                <div className="text-center py-16">
                  <p className="font-medium text-slate-700 dark:text-gray-300">
                    {listData.length === 0
                      ? `No ${activeMeta.name.toLowerCase()} yet`
                      : 'No matches for your filter'}
                  </p>
                  {query && (
                    <button
                      type="button"
                      onClick={() => setQuery('')}
                      className="mt-3 text-sm text-orange-700 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-300 font-semibold"
                    >
                      Clear filter
                    </button>
                  )}
                </div>
              ) : (
                <>
                  <p className="text-xs font-medium text-slate-500 dark:text-gray-400 mb-4">
                    Showing {filteredList.length}
                    {query ? ` of ${listData.length}` : ''} {activeMeta.name.toLowerCase()}
                  </p>
                  <div className="divide-y divide-slate-200 dark:divide-gray-800">
                    {filteredList.map((item) => (
                      <div
                        key={item.id || item.recipe_id}
                        className="py-4 flex items-center justify-between gap-4 first:pt-0 last:pb-0 hover:bg-slate-50/80 dark:hover:bg-gray-800/40 -mx-2 px-2 rounded-lg transition"
                      >
                        <div className="min-w-0 flex-1">
                          {activeTab === 'users' && (
                            <>
                              <h4 className="font-bold text-base text-slate-900 dark:text-white truncate">
                                {item.display_name || item.username}
                              </h4>
                              <p className="text-xs text-slate-600 dark:text-gray-400 mt-0.5">
                                {item.email} ·{' '}
                                <span className="font-bold text-orange-700 dark:text-orange-400 capitalize">
                                  {item.role}
                                </span>
                              </p>
                            </>
                          )}
                          {activeTab === 'recipes' && (
                            <>
                              <h4 className="font-bold text-base text-slate-900 dark:text-white truncate">
                                {item.title}
                              </h4>
                              <p className="text-xs text-slate-600 dark:text-gray-400 mt-0.5">
                                by {item.username || item.display_name || 'Anonymous'} ·{' '}
                                {item.review_count ?? 0} reviews
                              </p>
                            </>
                          )}
                          {activeTab === 'reviews' && (
                            <>
                              <h4 className="font-bold text-base text-slate-900 dark:text-white truncate">
                                &ldquo;{item.comment || item.title || 'No written comment'}&rdquo;
                              </h4>
                              <p className="text-xs text-slate-600 dark:text-gray-400 mt-0.5">
                                {item.username || 'Anonymous'} ·{' '}
                                <span className="text-amber-600 dark:text-yellow-400 font-bold">
                                  ★ {item.rating}
                                </span>
                                {item.recipe_title ? ` · ${item.recipe_title}` : ''}
                              </p>
                            </>
                          )}
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {activeTab === 'users' && (
                            <button
                              type="button"
                              onClick={() => handleRoleToggle(item.id, item.role)}
                              className="px-2.5 py-1.5 bg-slate-100 dark:bg-gray-800 hover:bg-slate-200 dark:hover:bg-gray-700 text-slate-800 dark:text-gray-200 border border-slate-300 dark:border-gray-600 text-xs font-bold rounded-lg transition"
                            >
                              Make {item.role === 'admin' ? 'User' : 'Admin'}
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDeleteItem(item.id || item.recipe_id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-red-50 hover:bg-red-600 text-red-700 hover:text-white border border-red-200 hover:border-red-600 dark:bg-red-950/40 dark:border-red-900/50 dark:text-red-300 dark:hover:bg-red-600 dark:hover:text-white text-xs font-bold rounded-lg transition"
                          >
                            <TrashIcon className="w-3.5 h-3.5" />
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
