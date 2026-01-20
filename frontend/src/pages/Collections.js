import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../config';
import { useAuth } from '../contexts/AuthContext';
import RecipeCardEnhanced from '../components/recipes/RecipeCardEnhanced';

const Collections = () => {
  const { user } = useAuth();
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewCollection, setShowNewCollection] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');

  useEffect(() => {
    if (user) {
      fetchCollections();
    }
  }, [user]);

  const fetchCollections = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/collections`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (res.ok) {
        const data = await res.json();
        setCollections(data);
        if (data.length > 0) {
          loadCollectionRecipes(data[0].id);
          setSelectedCollection(data[0].id);
        }
      }
    } catch (error) {
      console.error('Error fetching collections:', error);
      toast.error('Failed to load collections');
    } finally {
      setLoading(false);
    }
  };

  const loadCollectionRecipes = async (collectionId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/collections/${collectionId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (res.ok) {
        const data = await res.json();
        setRecipes(data.items || []);
      }
    } catch (error) {
      console.error('Error loading collection recipes:', error);
      toast.error('Failed to load collection');
    }
  };

  const handleCreateCollection = async (e) => {
    e.preventDefault();
    if (!newCollectionName.trim()) {
      toast.error('Collection name is required');
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/collections`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ name: newCollectionName })
      });

      if (res.ok) {
        const newCollection = await res.json();
        setCollections([...collections, newCollection]);
        setNewCollectionName('');
        setShowNewCollection(false);
        toast.success('Collection created!');
      } else {
        const error = await res.json();
        toast.error(error.error || 'Failed to create collection');
      }
    } catch (error) {
      toast.error('Failed to create collection');
    }
  };

  const handleDeleteCollection = async (collectionId) => {
    if (!window.confirm('Delete this collection?')) return;

    try {
      const res = await fetch(`${API_BASE_URL}/collections/${collectionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (res.ok) {
        const updatedCollections = collections.filter(c => c.id !== collectionId);
        setCollections(updatedCollections);
        if (selectedCollection === collectionId) {
          setSelectedCollection(updatedCollections[0]?.id || null);
          if (updatedCollections.length > 0) {
            loadCollectionRecipes(updatedCollections[0].id);
          } else {
            setRecipes([]);
          }
        }
        toast.success('Collection deleted');
      }
    } catch (error) {
      toast.error('Failed to delete collection');
    }
  };

  const handleRemoveRecipe = async (collectionId, itemId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/collections/${collectionId}/items/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (res.ok) {
        setRecipes(recipes.filter(r => r.id !== itemId));
        toast.success('Recipe removed from collection');
      }
    } catch (error) {
      toast.error('Failed to remove recipe');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-20">
        <div className="max-w-7xl mx-auto text-center p-6">
          <p className="text-gray-600 dark:text-gray-400">Please sign in to view your collections</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            📚 My Collections
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Organize and save your favorite recipes
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Collections List */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 h-fit">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Collections</h2>
              <button
                onClick={() => setShowNewCollection(!showNewCollection)}
                className="text-orange-500 hover:text-orange-600 font-bold text-2xl"
              >
                +
              </button>
            </div>

            {/* New Collection Form */}
            {showNewCollection && (
              <form onSubmit={handleCreateCollection} className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                <input
                  type="text"
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                  placeholder="Collection name..."
                  className="w-full px-4 py-2 mb-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-semibold"
                  >
                    Create
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNewCollection(false)}
                    className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Collections List */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {collections.length > 0 ? (
                collections.map((collection) => (
                  <div key={collection.id}>
                    <button
                      onClick={() => {
                        setSelectedCollection(collection.id);
                        loadCollectionRecipes(collection.id);
                      }}
                      className={`w-full text-left px-4 py-3 rounded-lg transition ${
                        selectedCollection === collection.id
                          ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 font-semibold'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <div className="font-medium">{collection.name}</div>
                      <div className="text-xs opacity-75">{collection.itemCount} recipes</div>
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">No collections yet</p>
              )}
            </div>
          </div>

          {/* Main Content - Collection Recipes */}
          <div className="lg:col-span-3">
            {selectedCollection ? (
              <>
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {collections.find(c => c.id === selectedCollection)?.name}
                  </h2>
                  <button
                    onClick={() => handleDeleteCollection(selectedCollection)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold"
                  >
                    Delete Collection
                  </button>
                </div>

                {recipes.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {recipes.map((recipe) => (
                      <div key={recipe.id} className="relative">
                        <RecipeCardEnhanced recipe={recipe} />
                        <button
                          onClick={() => handleRemoveRecipe(selectedCollection, recipe.id)}
                          className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition shadow-lg z-10"
                          title="Remove from collection"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl">
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      No recipes in this collection yet
                    </p>
                    <p className="text-sm text-gray-400 dark:text-gray-500">
                      Bookmark recipes from the Recipes tab to add them here
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl">
                <p className="text-gray-500 dark:text-gray-400">No collections to display</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collections;
