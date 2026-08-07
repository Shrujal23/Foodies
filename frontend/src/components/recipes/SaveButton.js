import { useState, useEffect } from 'react';
import { BookmarkIcon } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolid } from '@heroicons/react/24/solid';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { apiFetch } from '../../services/apiClient';

export default function SaveButton({ recipe }) {
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { user } = useAuth();
  const navigate = useNavigate();

  const recipeId = recipe.uri || recipe._id || recipe.id;

  useEffect(() => {
    checkSaveStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipeId, user]);

  const checkSaveStatus = async () => {
    if (!user) {
      setIsSaved(false);
      setIsLoading(false);
      return;
    }

    try {
      const res = await apiFetch(
        `/recipes/favorites/${encodeURIComponent(recipeId)}/status`
      );

      if (res.status === 401) {
        setIsSaved(false);
        return;
      }

      if (!res.ok) {
        throw new Error('Failed to fetch save status');
      }

      const data = await res.json();
      setIsSaved(data.isFavorite || false);
    } catch (err) {
      console.error('Failed to check save status');
      setIsSaved(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error('Please log in to save recipes', { duration: 1000 });
      navigate('/login');
      return;
    }

    if (isLoading) return;

    setIsLoading(true);

    try {
      const method = isSaved ? 'DELETE' : 'POST';
      const path = isSaved
        ? `/recipes/favorites/${encodeURIComponent(recipeId)}`
        : `/recipes/favorites`;

      const payload = {
        ...recipe,
        uri: recipeId,
        label: recipe.label || recipe.title,
        source: recipe.source || 'user',
      };

      const res = await apiFetch(path, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: !isSaved ? JSON.stringify({ recipe: payload }) : undefined,
      });

      if (!res.ok) {
        throw new Error('Failed');
      }

      setIsSaved(!isSaved);

      toast.success(isSaved ? 'Removed from favorites' : 'Saved to favorites');

      window.dispatchEvent(new Event('favorites:updated'));
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleSaveClick}
      disabled={isLoading}
      className={`group relative flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-200 ${
        isSaved
          ? 'border-orange-500 bg-gradient-to-br from-orange-500 to-pink-600 text-white shadow-md shadow-orange-500/25'
          : 'border-orange-100 bg-white/95 text-orange-600 shadow-sm hover:-translate-y-0.5 hover:border-orange-300 hover:bg-orange-50 hover:shadow-md dark:border-gray-700 dark:bg-gray-800/95 dark:text-orange-300 dark:hover:border-orange-600 dark:hover:bg-gray-700'
      } ${isLoading ? 'cursor-wait opacity-70' : 'active:scale-95'}`}
      title={isSaved ? 'Remove from favorites' : 'Save to favorites'}
    >
      <div className="relative flex h-5 w-5 items-center justify-center">
        {isLoading ? (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current/25 border-t-current" />
        ) : isSaved ? (
          <BookmarkSolid className="h-5 w-5" />
        ) : (
          <BookmarkIcon className="h-5 w-5" />
        )}
      </div>
    </button>
  );
}
