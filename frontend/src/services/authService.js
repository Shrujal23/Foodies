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

const getStorageForRemember = (remember) => {
  if (remember === true) return localStorage;
  if (remember === false) return sessionStorage;
  if (localStorage.getItem('token')) return localStorage;
  return sessionStorage;
};

// Set the current user and token
export const setCurrentUser = (user, token, remember = null) => {
  currentUser = user;
  const storage = getStorageForRemember(remember);

  if (user && token) {
    storage.setItem('user', JSON.stringify(user));
    storage.setItem('token', token);
    const otherStorage = storage === localStorage ? sessionStorage : localStorage;
    otherStorage.removeItem('user');
    otherStorage.removeItem('token');
  } else {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
  }

  notifyListeners();
};

// Get the current user
export const getCurrentUser = () => {
  if (!currentUser) {
    const storedUser = sessionStorage.getItem('user') || localStorage.getItem('user');
    if (storedUser) {
      currentUser = JSON.parse(storedUser);
      notifyListeners();
    }
  }
  return currentUser;
};

// Get the auth token
export const getToken = () => {
  return sessionStorage.getItem('token') || localStorage.getItem('token');
};

// Check authentication status with backend
export const checkAuthStatus = async () => {
  const token = getToken();
  if (!token) {
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
export const login = async (identifier, password, rememberMe = false) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ identifier, password }),
    });

    if (response.ok) {
      const data = await response.json();
      setCurrentUser(data.user, data.token, rememberMe);
      return data.user;
    } else {
      const errorText = await response.text();
      console.error('Login response:', errorText);
      let errorMessage = 'Login failed. Please check your email and password.';
      try {
        const error = JSON.parse(errorText);
        if (error.message) errorMessage = error.message;
        if (Array.isArray(error.errors) && error.errors.length > 0) {
          errorMessage = error.errors.map(err => err.message).join(' ');
        }
      } catch (e) {
        errorMessage = errorText || errorMessage;
      }
      throw new Error(errorMessage);
    }
  } catch (error) {
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
      return data;
    } else {
      const errorText = await response.text();
      console.error('Register response:', errorText);
      let errorMessage = 'Registration failed. Please check your information.';
      try {
        const error = JSON.parse(errorText);
        if (error.message) errorMessage = error.message;
        if (Array.isArray(error.errors) && error.errors.length > 0) {
          errorMessage = error.errors.map(err => err.message).join(' ');
        }
      } catch (e) {
        errorMessage = errorText || errorMessage;
      }
      throw new Error(errorMessage);
    }
  } catch (error) {
    throw error;
  }
};

export const updateProfile = async (profileData) => {
  try {
    const token = getToken();
    const formData = new FormData();

    if (profileData.username !== undefined) {
      formData.append('username', profileData.username);
    }
    if (profileData.display_name !== undefined) {
      formData.append('display_name', profileData.display_name);
    }
    if (profileData.email !== undefined) {
      formData.append('email', profileData.email);
    }
    if (profileData.avatarFile) {
      formData.append('avatar', profileData.avatarFile);
    } else if (profileData.avatar_url !== undefined) {
      formData.append('avatar_url', profileData.avatar_url);
    }

    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (response.ok) {
      const data = await response.json();
      if (data.user) {
        setCurrentUser(data.user, token);
      }
      return data.user;
    }

    const errorText = await response.text();
    console.error('Update profile response:', errorText);
    let errorMessage = 'Profile update failed. Please check your input.';
    try {
      const error = JSON.parse(errorText);
      if (error.message) errorMessage = error.message;
      if (Array.isArray(error.errors) && error.errors.length > 0) {
        errorMessage = error.errors.map(err => err.message).join(' ');
      }
    } catch (e) {
      errorMessage = errorText || errorMessage;
    }
    throw new Error(errorMessage);
  } catch (error) {
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
    toast.error('Failed to log out. Please try again.', { duration: 1000 });
    throw error;
  }
};

// Initialize auth state from localStorage and check with backend
getCurrentUser();
checkAuthStatus();
