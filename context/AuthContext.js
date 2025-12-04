import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { Alert } from 'react-native';

import { useUser } from './UserContext';

const AuthContext = createContext();

const mockUserProfile = (overrides = {}) => ({
  id: 'mock-user-id',
  name: 'Karl Beispiel',
  email: overrides.email || 'karl@example.com',
  role: overrides.role || 'Patient',
  ...overrides,
});

export function AuthProvider({ children }) {
  const { setUser } = useUser();
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAuthSuccess = useCallback(
    (userProfile) => {
      const profile = mockUserProfile(userProfile);
      setUser(profile);
      setToken('mock-token');
      setRole(profile.role);
    },
    [setUser]
  );

  const login = useCallback(
    async ({ email, password, selectedRole }) => {
      setLoading(true);
      try {
        if (!email || !password) {
          throw new Error('Bitte fülle alle erforderlichen Felder aus.');
        }

        // Placeholder for supabase.auth.signInWithPassword()
        handleAuthSuccess({ email, role: selectedRole || role || 'Patient' });
        setIsVerified(true);
      } catch (error) {
        Alert.alert('Anmeldung fehlgeschlagen', error.message);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [handleAuthSuccess, role]
  );

  const register = useCallback(
    async ({ email, password, profile }) => {
      setLoading(true);
      try {
        if (!email || !password) {
          throw new Error('Bitte gib eine gültige E-Mail und ein Passwort ein.');
        }

        // Placeholder for supabase.auth.signUp()
        handleAuthSuccess({ email, role: profile?.role || role || 'Patient', ...profile });
        setIsVerified(false);
      } catch (error) {
        Alert.alert('Registrierung fehlgeschlagen', error.message);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [handleAuthSuccess, role]
  );

  const verifyOTP = useCallback(
    async (code) => {
      setLoading(true);
      try {
        if (!code || (code.length !== 4 && code.length !== 6)) {
          throw new Error('Der Code muss 4 oder 6 Stellen haben.');
        }

        // Placeholder for supabase.auth.verifyOTP()
        setIsVerified(true);
      } catch (error) {
        Alert.alert('Verifizierung fehlgeschlagen', error.message);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const logout = useCallback(() => {
    setToken(null);
    setRole(null);
    setIsVerified(false);
    setUser({ id: null, name: '', email: '' });
  }, [setUser]);

  const value = useMemo(
    () => ({
      loading,
      token,
      role,
      isVerified,
      isAuthenticated: Boolean(token && isVerified),
      setRole,
      login,
      logout,
      register,
      verifyOTP,
    }),
    [loading, token, role, isVerified, login, logout, register, verifyOTP]
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
