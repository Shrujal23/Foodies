import { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import { getCurrentUser as getStoredUser, onAuthStateChanged } from '../services/authService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const existing = getStoredUser();
    if (existing) {
      setUser(existing);
    }
    
    checkAuthStatus();
    
    const unsubscribe = onAuthStateChanged((nextUser) => {
      setUser(nextUser);
    });
    
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/auth/status`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (data && data.user) {
        setUser(data.user);
      } else {
        const existingUser = getStoredUser();
        setUser(existingUser || null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
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