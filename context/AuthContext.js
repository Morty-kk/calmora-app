import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { fetchCurrentUser, loginUser, registerUser } from '../services/api';
import { useUser } from './UserContext';

const AuthContext = createContext(null);
const TOKEN_KEY = 'calmora-auth-token';

async function storeToken(token) {
  await AsyncStorage.setItem(TOKEN_KEY, token);
}

async function readToken() {
  return AsyncStorage.getItem(TOKEN_KEY);
}

async function clearToken() {
  await AsyncStorage.removeItem(TOKEN_KEY);
}

export function AuthProvider({ children }) {
  const { setUser } = useUser();
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [loading, setLoading] = useState(false);

  const syncUser = useCallback(
    async (activeToken) => {
      const response = await fetchCurrentUser(activeToken);
      setUser(response.user);
      setRole(response.user.role);
      return response.user;
    },
    [setUser]
  );

  useEffect(() => {
    const bootstrap = async () => {
      const storedToken = await readToken();
      if (storedToken) {
        setToken(storedToken);
        try {
          await syncUser(storedToken);
        } catch (error) {
          await clearToken();
          setToken(null);
        }
      }
      setInitializing(false);
    };

    bootstrap();
  }, [syncUser]);

  const handleAuthSuccess = useCallback(
    async (payload) => {
      await storeToken(payload.token);
      setToken(payload.token);
      setUser(payload.user);
      setRole(payload.user.role);
      return payload.user;
    },
    [setUser]
  );

  const register = useCallback(
    async ({ email, password, phoneNumber, role: desiredRole }) => {
      setLoading(true);
      try {
        const payload = await registerUser({
          email,
          password,
          phoneNumber,
          role: desiredRole || role || 'PATIENT',
        });
        await handleAuthSuccess(payload);
        return payload.user;
      } catch (error) {
        Alert.alert('Registrierung fehlgeschlagen', error.message || 'Bitte erneut versuchen.');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [handleAuthSuccess, role]
  );

  const login = useCallback(
    async ({ email, password }) => {
      setLoading(true);
      try {
        const payload = await loginUser({ email, password });
        await handleAuthSuccess(payload);
        return payload.user;
      } catch (error) {
        Alert.alert('Anmeldung fehlgeschlagen', error.message || 'Bitte erneut versuchen.');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [handleAuthSuccess]
  );

  const logout = useCallback(async () => {
    await clearToken();
    setToken(null);
    setRole(null);
    setUser({ id: null, email: '', phoneNumber: null, role: null });
  }, [setUser]);

  const value = useMemo(
    () => ({
      loading,
      initializing,
      token,
      role,
      isAuthenticated: Boolean(token),
      login,
      logout,
      register,
      refreshUser: syncUser,
    }),
    [loading, initializing, token, role, login, logout, register, syncUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
