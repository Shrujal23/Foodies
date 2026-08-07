import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiFetch } from '../services/apiClient';
import toast from 'react-hot-toast';
import { TrashIcon, EyeIcon, EyeSlashIcon, ChevronDownIcon } from '@heroicons/react/24/solid';

/**
 * Admin collections moderation UI.
 * When `embedded` is true, renders without page chrome (used inside AdminDashboard).
 */
const AdminCollections = ({ embedded = false }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [collections, setCollections] = useState([]);
  const [collectionItems, setCollectionItems] = useState([]);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [expandedCollection, setExpandedCollection] = useState(null);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchPublicCollections();
    }
  }, [user]);

  const fetchPublicCollections = async () => {
    try {
      setLoading(true);
      const response = await apiFetch('/admin/collections');

      if (!response.ok) throw new Error('Failed to fetch collections');

      const data = await response.json();
      setCollections(data.data || []);
    } catch (error) {
      console.error('Error fetching collections:', error);
      toast.error('Failed to load collections');
    } finally {
      setLoading(false);
    }
  };

  const fetchCollectionItems = async (collectionId) => {
    try {
      setItemsLoading(true);
      const response = await apiFetch(`/admin/collections/${collectionId}/items`);

      if (!response.ok) throw new Error('Failed to fetch items');

      const data = await response.json();
      setCollectionItems(data.data || []);
    } catch (error) {
      console.error('Error fetching collection items:', error);
      toast.error('Failed to load collection items');
    } finally {
      setItemsLoading(false);
    }
  };

  const toggleExpandCollection = (collectionId) => {
    if (expandedCollection === collectionId) {
      setExpandedCollection(null);
      setCollectionItems([]);
    } else {
      setExpandedCollection(collectionId);
      fetchCollectionItems(collectionId);
    }
  };

  const handleDeleteCollection = async (collectionId) => {
    if (
      !window.confirm(
        'Delete this collection? All items in it will be removed as well.'
      )
    ) {
      return;
    }

    try {
      const response = await apiFetch(`/admin/collections/${collectionId}`, { method: 'DELETE' });

      if (!response.ok) throw new Error('Failed to delete collection');

      toast.success('Collection deleted');
      fetchPublicCollections();

      if (expandedCollection === collectionId) {
        setExpandedCollection(null);
        setCollectionItems([]);
      }
    } catch (error) {
      console.error('Error deleting collection:', error);
      toast.error('Failed to delete collection');
    }
  };

  const handleRemoveItem = async (collectionId, itemId) => {
    if (!window.confirm('Remove this item from the collection?')) {
      return;
    }

    try {
      const response = await apiFetch(`/admin/collections/${collectionId}/items/${itemId}`, { method: 'DELETE' });

      if (!response.ok) throw new Error('Failed to remove item');

      toast.success('Item removed');
      fetchCollectionItems(collectionId);
      setCollections((prev) =>
        prev.map((c) =>
          c.id === collectionId
            ? { ...c, item_count: Math.max(0, Number(c.item_count || 0) - 1) }
            : c
        )
      );
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('Failed to remove item');
    }
  };

  const handleToggleVisibility = async (collectionId, currentVisibility) => {
    try {
      const response = await apiFetch(`/admin/collections/${collectionId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isPublic: !currentVisibility }) });

      if (!response.ok) throw new Error('Failed to update collection');

      toast.success('Visibility updated');
      fetchPublicCollections();
    } catch (error) {
      console.error('Error updating collection:', error);
      toast.error('Failed to update collection');
    }
  };

  if (!user || user.role !== 'admin') {
    if (embedded) {
      return (
        <div className="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 p-4 text-red-700 dark:text-red-300 text-sm">
          Access denied: admin privileges required.
        </div>
      );
    }
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-300">
            Access Denied: Admin privileges required
          </div>
        </div>
      </div>
    );
  }

  const totalItems = collections.reduce(
    (sum, c) => sum + (Number(c.item_count) || 0),
    0
  );
  const avgItems =
    collections.length > 0 ? Math.round(totalItems / collections.length) : 0;

  const body = (
    <>
      {/* Mini stats */}
      <div className={`grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 ${embedded ? 'mb-6' : 'mb-8'}`}>
        <div className="bg-white dark:bg-gray-800/80 rounded-xl p-4 border border-slate-200 dark:border-gray-700 shadow-sm">
          <div className="text-2xl font-bold text-orange-700 dark:text-orange-400">{collections.length}</div>
          <div className="text-slate-600 dark:text-gray-400 text-xs mt-1 uppercase tracking-wide font-semibold">
            Collections
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800/80 rounded-xl p-4 border border-slate-200 dark:border-gray-700 shadow-sm">
          <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">{totalItems}</div>
          <div className="text-slate-600 dark:text-gray-400 text-xs mt-1 uppercase tracking-wide font-semibold">
            Total items
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800/80 rounded-xl p-4 border border-slate-200 dark:border-gray-700 shadow-sm">
          <div className="text-2xl font-bold text-emerald-700 dark:text-green-400">{avgItems}</div>
          <div className="text-slate-600 dark:text-gray-400 text-xs mt-1 uppercase tracking-wide font-semibold">
            Avg items / collection
          </div>
        </div>
      </div>

      {/* List */}
      <div
        className={`rounded-xl overflow-hidden border border-slate-200 dark:border-gray-700 ${
          embedded ? 'bg-slate-50/50 dark:bg-transparent' : 'bg-white dark:bg-gray-800 shadow-lg'
        }`}
      >
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600" />
            <p className="mt-4 text-slate-600 dark:text-gray-400 text-sm font-medium">
              Loading collections…
            </p>
          </div>
        ) : collections.length === 0 ? (
          <div className="p-12 text-center text-slate-600 dark:text-gray-400 font-medium">
            No public collections found
          </div>
        ) : (
          <div className="divide-y divide-slate-200 dark:divide-gray-700">
            {collections.map((collection) => (
              <div key={collection.id} className="bg-white dark:bg-transparent">
                <div
                  className="flex items-center justify-between p-4 sm:p-5 hover:bg-slate-50 dark:hover:bg-gray-800/60 transition cursor-pointer"
                  onClick={() => toggleExpandCollection(collection.id)}
                >
                  <div className="flex-1 flex items-center gap-3 min-w-0">
                    <ChevronDownIcon
                      className={`w-5 h-5 text-slate-500 dark:text-gray-400 shrink-0 transition ${
                        expandedCollection === collection.id ? 'rotate-180' : ''
                      }`}
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-slate-900 dark:text-white truncate">
                        {collection.name}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-gray-400 truncate">
                        by {collection.display_name || collection.username}
                      </p>
                      {collection.description && (
                        <p className="text-sm text-slate-700 dark:text-gray-400 mt-1 line-clamp-1">
                          {collection.description}
                        </p>
                      )}
                    </div>
                    <span className="hidden sm:inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 border border-orange-200 dark:border-orange-900/40 shrink-0">
                      {collection.item_count || 0} items
                    </span>
                  </div>
                  <div className="flex items-center gap-2 ml-3 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleVisibility(collection.id, collection.is_public);
                      }}
                      className={`p-2 rounded-lg border transition ${
                        collection.is_public
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-green-900/30 dark:border-green-800 dark:text-green-300'
                          : 'bg-slate-100 border-slate-300 text-slate-700 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300'
                      }`}
                      title={collection.is_public ? 'Public — click to hide' : 'Private — click to publish'}
                    >
                      {collection.is_public ? (
                        <EyeIcon className="w-5 h-5" />
                      ) : (
                        <EyeSlashIcon className="w-5 h-5" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCollection(collection.id);
                      }}
                      className="p-2 rounded-lg bg-red-50 border border-red-200 text-red-700 dark:bg-red-900/30 dark:border-red-900/50 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/50 transition"
                      title="Delete collection"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {expandedCollection === collection.id && (
                  <div className="bg-slate-100 dark:bg-gray-800/40 px-4 sm:px-6 py-4 border-t border-slate-200 dark:border-gray-700">
                    {itemsLoading ? (
                      <div className="text-center py-4">
                        <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-orange-600" />
                      </div>
                    ) : collectionItems.length === 0 ? (
                      <p className="text-slate-600 dark:text-gray-400 text-sm font-medium">
                        No items in this collection
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {collectionItems.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between p-3 bg-white dark:bg-gray-900 rounded-lg border border-slate-200 dark:border-gray-700 shadow-sm"
                          >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              {item.image && (
                                <img
                                  src={item.image}
                                  alt={item.title || 'Recipe'}
                                  className="w-10 h-10 rounded object-cover shrink-0 border border-slate-200 dark:border-gray-700"
                                />
                              )}
                              <div className="min-w-0">
                                <p className="font-medium text-slate-900 dark:text-white truncate">
                                  {item.title || 'Recipe'}
                                </p>
                                <p className="text-xs text-slate-600 dark:text-gray-400">
                                  {item.recipe_type === 'user' ? 'User recipe' : 'External'}
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(collection.id, item.id)}
                              className="p-2 rounded-lg bg-red-50 border border-red-200 text-red-700 dark:bg-red-900/30 dark:border-red-900/50 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/50 transition shrink-0"
                              title="Remove item"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );

  if (embedded) {
    return <div>{body}</div>;
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-gray-950 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Collections
          </h1>
          <p className="text-slate-600 dark:text-gray-400">
            Moderate public collections and their contents
          </p>
        </div>
        {body}
      </div>
    </div>
  );
};

export default AdminCollections;
