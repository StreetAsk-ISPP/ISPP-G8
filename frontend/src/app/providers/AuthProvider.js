import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { setAuthToken } from '../../shared/services/http/apiClient';

const AuthContext = createContext(null);
const TOKEN_STORAGE_KEY = 'auth_token';
const USER_STORAGE_KEY = 'auth_user';

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const bootstrapAuth = async () => {
      const storedToken = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
      const userData = await AsyncStorage.getItem(USER_STORAGE_KEY);

      setToken(storedToken);
      setIsAuthenticated(Boolean(storedToken));
      setAuthToken(storedToken);

      if (userData) {
        try {
          setUser(JSON.parse(userData));
        } catch (e) {
          console.error('Error parsing user data:', e);
        }
      }

      setIsLoadingAuth(false);
    };

    bootstrapAuth();
  }, []);

  const login = async (newToken, userData) => {
    await AsyncStorage.setItem(TOKEN_STORAGE_KEY, newToken);
    setToken(newToken);
    setAuthToken(newToken);

    if (userData) {
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
      setUser(userData);
    }

    setIsAuthenticated(true);
  };

  const logout = async () => {
    await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
    await AsyncStorage.removeItem(USER_STORAGE_KEY);
    setAuthToken(null);
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = useMemo(
    () => ({
      isAuthenticated,
      isLoadingAuth,
      user,
      token,
      login,
      logout,
    }),
    [isAuthenticated, isLoadingAuth, user, token]
  );

  if (isLoadingAuth) {
    return null;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}