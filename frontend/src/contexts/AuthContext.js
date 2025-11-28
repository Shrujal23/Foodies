import { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import { getCurrentUser as getStoredUser, onAuthStateChanged } from '../services/authService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize from localStorage immediately for snappy UI
    const existing = getStoredUser();
    if (existing) {
      setUser(existing);
    }
    checkAuthStatus();
    // Subscribe to auth changes so navbar updates immediately after login/logout
    const unsubscribe = onAuthStateChanged((nextUser) => {
      setUser(nextUser);
    });
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  const checkAuthStatus = async () => {
    try {
      console.log('Checking auth status...');
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found');
        setUser(null);
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/auth/status`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('Auth status response:', response);
      const data = await response.json();
      console.log('Auth status data:', data);
      if (data && data.user) {
        setUser(data.user);
      } else {
        // Keep existing local user if backend couldn't validate
        const existingUser = getStoredUser();
        setUser(existingUser || null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // Do not aggressively sign out on transient errors
      const existingUser = getStoredUser();
      setUser(existingUser || null);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    checkAuthStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}