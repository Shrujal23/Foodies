import { createContext, useContext, useState, useEffect } from 'react';
import {
  getCurrentUser as getStoredUser,
  onAuthStateChanged,
  checkAuthStatus as verifySession,
} from '../services/authService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const existing = getStoredUser();
    if (existing) {
      setUser(existing);
    }

    // Verifies httpOnly cookie session with the API (no token in JS)
    (async () => {
      try {
        await verifySession();
      } finally {
        setLoading(false);
      }
    })();

    const unsubscribe = onAuthStateChanged((nextUser) => {
      setUser(nextUser);
    });

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  const value = {
    user,
    loading,
    checkAuthStatus: verifySession,
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
