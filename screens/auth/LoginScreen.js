import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { useAuth } from '../../context/AuthContext';

export default function LoginScreen({ navigation, route }) {
  const { login, role, setRole, loading } = useAuth();
  const initialRole = useMemo(() => route?.params?.selectedRole || role || 'Patient', [route?.params, role]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const validate = () => {
    if (!email || !password) {
      setError('Bitte fülle E-Mail und Passwort aus.');
      return false;
    }
    setError('');
    return true;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setRole(initialRole);
    try {
      await login({ email, password, selectedRole: initialRole });
    } catch (err) {
      // errors handled in context alert
    }
  };

  const goToRegister = () => {
    navigation.navigate(initialRole === 'Therapist' ? 'RegisterTherapist' : 'RegisterPatient', {
      selectedRole: initialRole,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Anmeldung</Text>
      <Text style={styles.subtitle}>Melde dich mit deiner E-Mail an.</Text>

      <Text style={styles.label}>E-Mail</Text>
      <TextInput
        style={styles.input}
        placeholder="dein.name@mail.de"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <Text style={styles.label}>Passwort</Text>
      <TextInput
        style={styles.input}
        placeholder="••••••••"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Pressable style={styles.primaryButton} onPress={handleLogin} disabled={loading}>
        <Text style={styles.primaryText}>{loading ? 'Laden…' : 'Einloggen'}</Text>
      </Pressable>

      <Pressable style={styles.secondaryButton} onPress={goToRegister}>
        <Text style={styles.secondaryText}>Jetzt registrieren</Text>
      </Pressable>

      <Pressable onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={styles.link}>Passwort vergessen?</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
  },
  subtitle: {
    color: '#475569',
    marginBottom: 16,
    marginTop: 6,
  },
  label: {
    color: '#334155',
    marginTop: 12,
    marginBottom: 6,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#0F172A',
  },
  error: {
    color: '#DC2626',
    marginTop: 8,
  },
  primaryButton: {
    backgroundColor: '#1D4ED8',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  primaryText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#1D4ED8',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 12,
  },
  secondaryText: {
    color: '#1D4ED8',
    fontWeight: '700',
    fontSize: 16,
  },
  link: {
    color: '#2563EB',
    textAlign: 'center',
    marginTop: 16,
    fontWeight: '600',
  },
});
