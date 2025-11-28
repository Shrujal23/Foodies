import { useState, useEffect } from 'react';
import { BookmarkIcon } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolid } from '@heroicons/react/24/solid';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../../config';

export default function SaveButton({ recipe }) {
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    checkSaveStatus();
  }, [recipe.uri, user]);

  const checkSaveStatus = async () => {
    if (!user) {
      setIsSaved(false);
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/recipes/favorites/${encodeURIComponent(recipe.uri)}/status`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (res.ok) {
        const data = await res.json();
        setIsSaved(data.isFavorite || false);
      }
    } catch (err) {
      console.error('Failed to check save status:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveClick = async () => {
    if (!user) {
      toast.error('Please log in to save recipes');
      navigate('/login');
      return;
    }

    if (isLoading) return;

    setIsLoading(true);
    try {
      const method = isSaved ? 'DELETE' : 'POST';
      const url = isSaved
        ? `${API_BASE_URL}/recipes/favorites/${encodeURIComponent(recipe.uri)}`
        : `${API_BASE_URL}/recipes/favorites`;

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: !isSaved ? JSON.stringify({ recipe }) : undefined
      });

      if (!res.ok) throw new Error('Failed');

      setIsSaved(!isSaved);
      toast.success(isSaved ? 'Removed from favorites' : 'Saved to favorites');
    } catch (err) {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleSaveClick}
      disabled={isLoading}
      className={`
        group relative p-4 rounded-2xl shadow-lg backdrop-blur-md transition-all duration-300 transform
        ${isSaved
          ? 'bg-gradient-to-br from-orange-500 to-pink-600 text-white shadow-orange-500/30 hover:shadow-orange-500/50'
          : 'bg-white/90 dark:bg-gray-800/90 text-orange-600 hover:bg-white dark:hover:bg-gray-700 hover:shadow-xl'
        }
        ${isLoading ? 'opacity-70 cursor-wait' : 'hover:scale-110 active:scale-95'}
      `}
      title={isSaved ? 'Remove from favorites' : 'Save to favorites'}
    >
      {/* Icon with smooth transition */}
      <div className="relative w-7 h-7">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        ) : isSaved ? (
          <BookmarkSolid className="w-7 h-7 drop-shadow-md" />
        ) : (
          <BookmarkIcon className="w-7 h-7" />
        )}
      </div>

      {/* Subtle pulse when saved */}
      {isSaved && (
        <div className="absolute inset-0 rounded-2xl bg-white/20 animate-ping" />
      )}

      {/* Glow on hover (only when not saved) */}
      {!isSaved && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-400/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      )}
    </button>
  );
}