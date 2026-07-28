import { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import {
  getCurrentUser as getStoredUser,
  getToken,
  onAuthStateChanged,
  setCurrentUser,
} from '../services/authService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Grab initial snapshot cache to render UI immediately
    const existing = getStoredUser();
    if (existing) {
      setUser(existing);
    }
    
    // 2. Instantly verify live database permissions/roles over the network
    checkAuthStatus();
    
    // 3. Listen to auth state shifts (Login/Logout triggers)
    const unsubscribe = onAuthStateChanged((nextUser) => {
      setUser(nextUser);
    });
    
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = getToken();
      if (!token) {
        setCurrentUser(null);
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/auth/status`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        setCurrentUser(null);
        return;
      }

      const data = await response.json();
      
      if (data && data.user) {
        setCurrentUser(data.user, token);
      } else {
        const existingUser = getStoredUser();
        if (existingUser) {
          setCurrentUser(existingUser, token);
        } else {
          setCurrentUser(null);
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      const existingUser = getStoredUser();
      if (existingUser) {
        setCurrentUser(existingUser, getToken());
      } else {
        setCurrentUser(null);
      }
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