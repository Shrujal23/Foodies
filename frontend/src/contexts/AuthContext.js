import { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import { getCurrentUser as getStoredUser, onAuthStateChanged } from '../services/authService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper to safely sync state and update local browser storage cache
  const updateUserState = (userData) => {
    setUser(userData);
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData));
    } else {
      localStorage.removeItem('user');
    }
  };

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
      updateUserState(nextUser);
    });
    
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        updateUserState(null);
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
        // 🌟 SUCCESS: Overwrite state with fresh backend model data containing your database 'role'
        updateUserState(data.user);
      } else {
        const existingUser = getStoredUser();
        updateUserState(existingUser || null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      const existingUser = getStoredUser();
      updateUserState(existingUser || null);
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