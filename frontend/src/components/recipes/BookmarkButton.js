import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../../config';
import { useAuth } from '../../contexts/AuthContext';

const BookmarkButton = ({ recipeId, externalRecipeId, onBookmarkChange }) => {
  const { user } = useAuth();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [collections, setCollections] = useState([]);
  const [showCollections, setShowCollections] = useState(false);
  const [loading, setLoading] = useState(false);
  const [defaultCollection, setDefaultCollection] = useState(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (user) {
      checkBookmarkStatus();
      fetchCollections();
    }
  }, [recipeId, externalRecipeId, user]);

  const checkBookmarkStatus = async () => {
    try {
      const query = recipeId 
        ? `?recipeId=${recipeId}`
        : `?externalRecipeId=${externalRecipeId}`;
      
      const res = await fetch(`${API_BASE_URL}/bookmarks/check${query}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (res.ok) {
        const data = await res.json();
        setIsBookmarked(data.isBookmarked);
      }
    } catch (error) {
      console.error('Check bookmark error:', error);
    }
  };

  const fetchCollections = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/collections`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (res.ok) {
        const data = await res.json();
        setCollections(data);
        // Set first collection as default
        if (data.length > 0) {
          setDefaultCollection(data[0].id);
        }
      }
    } catch (error) {
      console.error('Fetch collections error:', error);
    }
  };

  const handleBookmarkClick = async (collectionId = null) => {
    if (!user) {
      toast.error('Please sign in to bookmark recipes');
      return;
    }

    setLoading(true);
    try {
      const cId = collectionId || defaultCollection;
      
      if (!cId) {
        toast.error('Create a collection first');
        setShowCollections(false);
        setLoading(false);
        return;
      }

      const res = await fetch(`${API_BASE_URL}/collections/${cId}/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          recipeId: recipeId || null,
          externalRecipeId: externalRecipeId || null,
          recipeType: externalRecipeId ? 'edamam' : 'user'
        })
      });

      if (res.ok) {
        setIsBookmarked(true);
        setShowCollections(false);
        toast.success('Added to collection!');
        onBookmarkChange?.(true);
      } else {
        const error = await res.json();
        toast.error(error.error || 'Failed to bookmark');
      }
    } catch (error) {
      console.error('Bookmark error:', error);
      toast.error('Failed to bookmark recipe');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCollection = async () => {
    const name = prompt('Collection name:');
    if (!name) return;

    try {
      const res = await fetch(`${API_BASE_URL}/collections`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ name })
      });

      if (res.ok) {
        const newCollection = await res.json();
        setCollections([...collections, newCollection]);
        setDefaultCollection(newCollection.id);
        toast.success('Collection created!');
        // Auto-bookmark to new collection
        handleBookmarkClick(newCollection.id);
      }
    } catch (error) {
      toast.error('Failed to create collection');
    }
  };

  if (!user) return null;

  return (
    <div className="relative">
      {/* Bookmark Button - Twitter Style */}
      <button
        onClick={() => setShowCollections(!showCollections)}
        disabled={loading}
        className={`p-2 rounded-full transition ${
          isBookmarked
            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-500'
            : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400'
        }`}
        title={isBookmarked ? 'Remove from collection' : 'Add to collection'}
      >
        <svg
          className="w-5 h-5"
          fill={isBookmarked ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth={isBookmarked ? 0 : 2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 5a2 2 0 012-2h6a2 2 0 012 2v16l-7-3.5L5 21V5z"
          />
        </svg>
      </button>

      {/* Collections Dropdown */}
      {showCollections && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-2xl shadow-xl z-50 border border-gray-200 dark:border-gray-700">
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={handleCreateCollection}
              className="w-full px-4 py-2 text-sm font-medium text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition"
            >
              + New Collection
            </button>
          </div>

          <div className="max-h-64 overflow-y-auto">
            {collections.length > 0 ? (
              collections.map((collection) => (
                <button
                  key={collection.id}
                  onClick={() => handleBookmarkClick(collection.id)}
                  disabled={loading}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition border-b border-gray-100 dark:border-gray-700 last:border-0 flex justify-between items-center"
                >
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {collection.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {collection.itemCount} items
                    </div>
                  </div>
                  {isBookmarked && (
                    <span className="text-blue-500">✓</span>
                  )}
                </button>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
                No collections yet
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookmarkButton;
