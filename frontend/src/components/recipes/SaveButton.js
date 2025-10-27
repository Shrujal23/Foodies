import { useState, useEffect } from 'react';
import { BookmarkIcon as BookmarkOutline } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolid } from '@heroicons/react/24/solid';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function SaveButton({ recipe }) {
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    checkSaveStatus();
  }, [recipe.uri]);

  const checkSaveStatus = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/recipes/favorites/${recipe.uri}/status`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to check save status');
      
      const data = await response.json();
      setIsSaved(data.isFavorite);
    } catch (error) {
      console.error('Error checking save status:', error);
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

    try {
      setIsLoading(true);
      const url = `http://localhost:5000/api/recipes/favorites${isSaved ? `/${recipe.uri}` : ''}`;
      const method = isSaved ? 'DELETE' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: !isSaved ? JSON.stringify({ recipe }) : undefined
      });

      if (!response.ok) throw new Error('Failed to update save status');

      setIsSaved(!isSaved);
      toast.success(isSaved ? 'Recipe removed from favorites' : 'Recipe saved to favorites');
    } catch (error) {
      console.error('Error updating save status:', error);
      toast.error('Failed to update save status');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleSaveClick}
      disabled={isLoading}
      className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg 
                 transition duration-150 ease-in-out
                 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500
                 disabled:opacity-50 disabled:cursor-not-allowed
                 bg-accent-50 text-accent-700 hover:bg-accent-100"
    >
      {isLoading ? (
        <svg className="animate-spin h-5 w-5 text-accent-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
      ) : isSaved ? (
        <BookmarkSolid className="h-5 w-5" />
      ) : (
        <BookmarkOutline className="h-5 w-5" />
      )}
      {isSaved ? 'Saved' : 'Save'}
    </button>
  );
}