import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AuthWarningModal from './AuthWarningModal';

/**
 * ProtectedRoute - Wraps pages that require authentication
 * Shows warning modal if user is not authenticated, then redirects to login
 */
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      setShowWarning(true);
    }
  }, [user, loading]);

  const handleRedirect = () => {
    navigate('/login', { state: { from: window.location.pathname } });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <AuthWarningModal
        isOpen={showWarning}
        onClose={handleRedirect}
        onSignIn={handleRedirect}
      />
    );
  }

  return children;
}
