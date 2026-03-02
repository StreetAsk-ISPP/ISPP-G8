import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext(null);
const TOKEN_STORAGE_KEY = 'auth_token';

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  useEffect(() => {
    const bootstrapAuth = async () => {
      const token = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
      setIsAuthenticated(Boolean(token));
      setIsLoadingAuth(false);
    };

    bootstrapAuth();
  }, []);

  const login = async (token) => {
    await AsyncStorage.setItem(TOKEN_STORAGE_KEY, token);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
    setIsAuthenticated(false);
  };

  const value = useMemo(
    () => ({
      isAuthenticated,
      isLoadingAuth,
      login,
      logout,
    }),
    [isAuthenticated, isLoadingAuth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}
