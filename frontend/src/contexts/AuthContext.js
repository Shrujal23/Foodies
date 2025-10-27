import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
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

      const response = await fetch('http://localhost:5000/api/auth/status', {
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('Auth status response:', response);
      const data = await response.json();
      console.log('Auth status data:', data);
      setUser(data.user || null);
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
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