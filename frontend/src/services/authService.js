import toast from 'react-hot-toast';
import { API_BASE_URL } from '../config';

// User state management
let currentUser = null;
const listeners = new Set();

// Notify all listeners of user state changes
const notifyListeners = () => {
  listeners.forEach(listener => listener(currentUser));
};

// Subscribe to user state changes
export const onAuthStateChanged = (callback) => {
  listeners.add(callback);
  callback(currentUser);
  return () => listeners.delete(callback);
};

// Set the current user and token
export const setCurrentUser = (user, token) => {
  currentUser = user;
  if (user && token) {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }
  notifyListeners();
};

// Get the current user
export const getCurrentUser = () => {
  if (!currentUser) {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      currentUser = JSON.parse(storedUser);
      notifyListeners();
    }
  }
  return currentUser;
};

// Get the auth token
export const getToken = () => {
  return localStorage.getItem('token');
};

// Check authentication status with backend
export const checkAuthStatus = async () => {
  const token = getToken();
  if (!token) {
    console.log('No token found');
    setCurrentUser(null);
    return null;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/status`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      if (data.user) {
        setCurrentUser(data.user, token);
        return data.user;
      } else {
        setCurrentUser(null);
        return null;
      }
    } else {
      setCurrentUser(null);
      return null;
    }
  } catch (error) {
    console.error('Auth status check failed:', error);
    setCurrentUser(null);
    return null;
  }
};

// Login function
export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      setCurrentUser(data.user, data.token);
      toast.success('Successfully logged in!');
      return data.user;
    } else {
      const errorText = await response.text();
      console.error('Login response:', errorText);
      let errorMessage = 'Login failed';
      try {
        const error = JSON.parse(errorText);
        errorMessage = error.message || errorMessage;
      } catch (e) {
        errorMessage = errorText || errorMessage;
      }
      throw new Error(errorMessage);
    }
  } catch (error) {
    console.error('Login error:', error);
    toast.error(error.message || 'Login failed. Please try again.');
    throw error;
  }
};

// Register function
export const register = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (response.ok) {
      const data = await response.json();
      // Don't set current user after registration
      toast.success('Successfully registered!');
      return data;
    } else {
      const errorText = await response.text();
      console.error('Register response:', errorText);
      let errorMessage = 'Registration failed';
      try {
        const error = JSON.parse(errorText);
        errorMessage = error.message || errorMessage;
      } catch (e) {
        errorMessage = errorText || errorMessage;
      }
      throw new Error(errorMessage);
    }
  } catch (error) {
    console.error('Register error:', error);
    toast.error(error.message || 'Registration failed. Please try again.');
    throw error;
  }
};

// Logout function
export const logout = async () => {
  try {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      setCurrentUser(null);
      toast.success('Successfully logged out!', { duration: 3000 });
      return true;
    } else {
      const errorText = await response.text();
      console.error('Logout response:', errorText);
      throw new Error('Logout failed');
    }
  } catch (error) {
    console.error('Logout error:', error);
    toast.error('Failed to log out. Please try again.');
    throw error;
  }
};

// Initialize auth state from localStorage and check with backend
getCurrentUser();
checkAuthStatus();
