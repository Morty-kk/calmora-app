import React, { createContext, useContext, useState } from 'react';
import { useUser } from './UserContext';

const AuthContext = createContext();

const mockUserByRole = (role, overrides = {}) => ({
  id: Date.now().toString(),
  name: overrides.name || (role === 'therapist' ? 'Dr. Müller' : 'Karl'),
  email: overrides.email || `${role}@calmora.app`,
  role,
});

export const AuthProvider = ({ children }) => {
  const { setUser } = useUser();
  const [authState, setAuthState] = useState({
    token: null,
    role: null,
    user: null,
  });

  const login = async ({ email, password, role = 'patient' }) => {
    // Placeholder for Supabase: supabase.auth.signInWithPassword({ email, password });
    if (!email || !password) {
      throw new Error('E-Mail und Passwort werden benötigt.');
    }
    const token = 'mock-token';
    const user = mockUserByRole(role, { email });
    setUser(user);
    setAuthState({ token, role, user });
    return { token, user };
  };

  const register = async ({ role = 'patient', ...payload }) => {
    // Placeholder for Supabase: supabase.auth.signUp(payload)
    const required = ['firstName', 'lastName', 'email', 'password'];
    const missing = required.filter((key) => !payload[key]);
    if (missing.length) {
      throw new Error('Bitte alle erforderlichen Felder ausfüllen.');
    }
    const token = 'mock-token';
    const user = mockUserByRole(role, {
      name: `${payload.firstName} ${payload.lastName}`.trim(),
      email: payload.email,
    });
    setUser(user);
    setAuthState({ token, role, user });
    return { token, user };
  };

  const verifyOTP = async (code) => {
    // Placeholder for Supabase: supabase.auth.verifyOTP({ code })
    if (!code || !(code.length === 4 || code.length === 6)) {
      throw new Error('Bitte gebe einen gültigen Code ein.');
    }
    return true;
  };

  const logout = () => {
    setUser({ name: '', email: '', role: null });
    setAuthState({ token: null, role: null, user: null });
  };

  return (
    <AuthContext.Provider value={{
      user: authState.user,
      token: authState.token,
      role: authState.role,
      login,
      logout,
      register,
      verifyOTP,
      setRole: (role) => setAuthState((prev) => ({ ...prev, role })),
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
