import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { useUser } from '../../context/UserContext';

const LoginScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { login, setRole, role } = useAuth();
  const { setUser } = useUser();

  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const activeRole = route.params?.role || role || 'patient';

  const handleChange = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const onSubmit = async () => {
    try {
      setLoading(true);
      setRole(activeRole);
      const { user } = await login({ ...form, role: activeRole });
      setUser(user);
      navigation.reset({ index: 0, routes: [{ name: 'PatientTabs' }] });
    } catch (error) {
      Alert.alert('Fehler', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Willkommen zurück</Text>
      <Text style={styles.subtitle}>Melde dich als {activeRole === 'therapist' ? 'Therapeut' : 'Patient'} an</Text>

      <TextInput
        style={styles.input}
        placeholder="E-Mail"
        placeholderTextColor="#94a3b8"
        keyboardType="email-address"
        autoCapitalize="none"
        value={form.email}
        onChangeText={(text) => handleChange('email', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Passwort"
        placeholderTextColor="#94a3b8"
        secureTextEntry
        value={form.password}
        onChangeText={(text) => handleChange('password', text)}
      />

      <TouchableOpacity style={styles.primaryButton} onPress={onSubmit} disabled={loading}>
        <Text style={styles.primaryText}>{loading ? 'Bitte warten...' : 'Anmelden'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={styles.secondaryText}>Passwort vergessen?</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.navigate('RegisterPatient')}>
          <Text style={styles.link}>Neu hier? Registriere dich als Patient</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('RegisterTherapist')}>
          <Text style={styles.link}>Registriere dich als Therapeut</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    color: '#0f172a',
  },
  primaryButton: {
    backgroundColor: '#2563eb',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  primaryText: {
    color: '#fff',
    fontWeight: '700',
  },
  secondaryButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  secondaryText: {
    color: '#2563eb',
    fontWeight: '600',
  },
  footer: {
    marginTop: 16,
    gap: 8,
  },
  link: {
    color: '#2563eb',
    fontWeight: '600',
  },
});

export default LoginScreen;
