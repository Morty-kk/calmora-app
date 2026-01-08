import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';

import { login as apiLogin, register as apiRegister } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(true);

  /**
   * Restore session on app start
   */
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        const storedUser = await AsyncStorage.getItem('user');

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          setRole(JSON.parse(storedUser).role);
          setIsVerified(true);
        }
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  /**
   * LOGIN
   */
  const login = useCallback(async ({ email, password }) => {
    setLoading(true);
    try {
      const data = await apiLogin({ email, password });

      const roleName = data.roles?.[0] || 'PATIENT';

      const profile = {
        id: data.user.id,
        email: data.user.email,
        role: roleName === 'THERAPIST' ? 'Therapist' : 'Patient',
      };

      setUser(profile);
      setToken(data.token);
      setRole(profile.role);
      setIsVerified(true);

      await AsyncStorage.setItem('token', data.token);
      await AsyncStorage.setItem('user', JSON.stringify(profile));
    } catch (e) {
      Alert.alert('Login fehlgeschlagen', e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * REGISTER
   */
  const register = useCallback(
    async ({ email, password, profile }) => {
      setLoading(true);
      try {
        const role = profile?.role === 'Therapist' ? 'THERAPIST' : 'PATIENT';

        await apiRegister({ email, password, role });

        // direkt einloggen
        await login({ email, password });
      } catch (e) {
        Alert.alert('Registrierung fehlgeschlagen', e.message);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [login]
  );

  /**
   * LOGOUT
   */
  const logout = useCallback(async () => {
    setUser(null);
    setToken(null);
    setRole(null);
    setIsVerified(false);

    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role,
        isVerified,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
