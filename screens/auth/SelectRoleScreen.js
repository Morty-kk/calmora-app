import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';

const SelectRoleScreen = () => {
  const navigation = useNavigation();
  const { setRole } = useAuth();

  const chooseRole = (role) => {
    setRole(role);
    navigation.navigate('Login', { role });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wer bist du?</Text>
      <Text style={styles.subtitle}>Wähle deine Rolle für Calmora</Text>

      <TouchableOpacity style={styles.card} onPress={() => chooseRole('patient')}>
        <Text style={styles.cardTitle}>Patient</Text>
        <Text style={styles.cardText}>Atem- und Achtsamkeitsübungen, Tagebuch und Termine.</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={() => chooseRole('therapist')}>
        <Text style={styles.cardTitle}>Therapeut</Text>
        <Text style={styles.cardText}>Verwalte Klienten, Sitzungen und Zertifikate.</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.secondaryButton, styles.buttonSpacing]}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.secondaryText}>Zur Anmeldung</Text>
      </TouchableOpacity>
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
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#0f172a',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 6,
  },
  cardText: {
    color: '#64748b',
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#2563eb',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondaryText: {
    color: '#2563eb',
    fontWeight: '700',
  },
  buttonSpacing: {
    marginTop: 12,
  },
});

export default SelectRoleScreen;
