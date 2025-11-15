import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

const AuthContext = createContext({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

const TOKEN_KEY = '@smart_home_token';
const USER_KEY = '@smart_home_user';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load stored auth data on mount
  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem(TOKEN_KEY);
      const storedUser = await AsyncStorage.getItem(USER_KEY);

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        api.setToken(storedToken);
      }
    } catch (error) {
      console.error('Error loading stored auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = useCallback(async (username, password) => {
    try {
      const response = await api.login(username, password);
      const { token: authToken, ...userData } = response;

      setToken(authToken);
      setUser(userData);
      api.setToken(authToken);

      await AsyncStorage.setItem(TOKEN_KEY, authToken);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  }, []);

  const register = useCallback(async (username, password, fullName) => {
    try {
      const response = await api.register(username, password, fullName);
      const { token: authToken, ...userData } = response;

      setToken(authToken);
      setUser(userData);
      api.setToken(authToken);

      await AsyncStorage.setItem(TOKEN_KEY, authToken);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));

      return { success: true };
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, error: error.message };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
      await AsyncStorage.removeItem(USER_KEY);
      setToken(null);
      setUser(null);
      api.clearToken();
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, []);

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

