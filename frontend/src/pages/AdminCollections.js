import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { TrashIcon, EyeIcon, EyeSlashIcon, ChevronDownIcon } from '@heroicons/react/24/solid';

const AdminCollections = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState(null);
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
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/admin/collections`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

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
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${API_BASE_URL}/admin/collections/${collectionId}/items`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

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
    if (!window.confirm('Are you sure you want to delete this collection? This will also remove all items in it.')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/admin/collections/${collectionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to delete collection');

      toast.success('Collection deleted successfully');
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
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${API_BASE_URL}/admin/collections/${collectionId}/items/${itemId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) throw new Error('Failed to remove item');

      toast.success('Item removed from collection');
      fetchCollectionItems(collectionId);
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('Failed to remove item');
    }
  };

  const handleToggleVisibility = async (collectionId, currentVisibility) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/admin/collections/${collectionId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isPublic: !currentVisibility })
      });

      if (!response.ok) throw new Error('Failed to update collection');

      toast.success('Collection visibility updated');
      fetchPublicCollections();
    } catch (error) {
      console.error('Error updating collection:', error);
      toast.error('Failed to update collection');
    }
  };

  if (!user || user.role !== 'admin') {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Manage Collections
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Oversee all public collections and their contents
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="text-3xl font-bold text-orange-600">{collections.length}</div>
            <div className="text-gray-600 dark:text-gray-400 text-sm mt-1">Total Collections</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="text-3xl font-bold text-blue-600">
              {collections.reduce((sum, c) => sum + (c.item_count || 0), 0)}
            </div>
            <div className="text-gray-600 dark:text-gray-400 text-sm mt-1">Total Items</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="text-3xl font-bold text-green-600">
              {collections.length > 0 ? Math.round(collections.reduce((sum, c) => sum + (c.item_count || 0), 0) / collections.length) : 0}
            </div>
            <div className="text-gray-600 dark:text-gray-400 text-sm mt-1">Avg Items per Collection</div>
          </div>
        </div>

        {/* Collections List */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading collections...</p>
            </div>
          ) : collections.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-600 dark:text-gray-400">No collections found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              {collections.map((collection) => (
                <div key={collection.id} className="border-b dark:border-gray-700 last:border-b-0">
                  {/* Collection Header */}
                  <div 
                    className="flex items-center justify-between p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition cursor-pointer"
                    onClick={() => toggleExpandCollection(collection.id)}
                  >
                    <div className="flex-1 flex items-center gap-4">
                      <ChevronDownIcon 
                        className={`w-5 h-5 text-gray-400 transition ${expandedCollection === collection.id ? 'rotate-180' : ''}`}
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{collection.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          by {collection.display_name || collection.username}
                        </p>
                        {collection.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{collection.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300">
                          {collection.item_count || 0} items
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleVisibility(collection.id, collection.is_public);
                        }}
                        className={`p-2 rounded-lg transition ${
                          collection.is_public
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                        }`}
                        title={collection.is_public ? 'Collection is public' : 'Collection is private'}
                      >
                        {collection.is_public ? (
                          <EyeIcon className="w-5 h-5" />
                        ) : (
                          <EyeSlashIcon className="w-5 h-5" />
                        )}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCollection(collection.id);
                        }}
                        className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50 transition"
                        title="Delete collection"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Collection Items */}
                  {expandedCollection === collection.id && (
                    <div className="bg-gray-50 dark:bg-gray-700/30 p-6 border-t dark:border-gray-700">
                      {itemsLoading ? (
                        <div className="text-center py-4">
                          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-orange-600"></div>
                        </div>
                      ) : collectionItems.length === 0 ? (
                        <p className="text-gray-600 dark:text-gray-400">No items in this collection</p>
                      ) : (
                        <div className="space-y-3">
                          {collectionItems.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg"
                            >
                              <div className="flex items-center gap-4 flex-1">
                                {item.image && (
                                  <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-12 h-12 rounded object-cover"
                                  />
                                )}
                                <div>
                                  <p className="font-medium text-gray-900 dark:text-white">
                                    {item.title || 'Recipe'}
                                  </p>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Type: {item.recipe_type === 'user' ? 'User Recipe' : 'External'}
                                  </p>
                                </div>
                              </div>
                              <button
                                onClick={() => handleRemoveItem(collection.id, item.id)}
                                className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50 transition"
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
      </div>
    </div>
  );
};

export default AdminCollections;
