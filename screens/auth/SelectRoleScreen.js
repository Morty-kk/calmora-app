import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../../context/AuthContext';

const roles = [
  {
    key: 'Patient',
    title: 'Patient:in',
    description: 'Erhalte Übungen, Trackings und sichere Kommunikation mit deinem Therapeuten.',
    icon: 'heart',
  },
  {
    key: 'Therapist',
    title: 'Therapeut:in',
    description: 'Verwalte deine Klient:innen, Termine und sichere Dokumente.',
    icon: 'medkit',
  },
];

export default function SelectRoleScreen({ navigation }) {
  const { role, setRole } = useAuth();
  const [selectedRole, setSelectedRole] = useState(role || 'Patient');

  const selectedTitle = useMemo(
    () => roles.find((r) => r.key === selectedRole)?.title || 'Patient:in',
    [selectedRole]
  );

  const handleContinue = (target) => {
    setRole(selectedRole);
    navigation.navigate(target, { selectedRole });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Willkommen bei Calmora</Text>
      <Text style={styles.subtitle}>Wähle deine Rolle, um fortzufahren.</Text>
      <View style={styles.roleList}>
        {roles.map((item) => (
          <Pressable
            key={item.key}
            style={[styles.card, selectedRole === item.key && styles.cardSelected]}
            onPress={() => setSelectedRole(item.key)}
          >
            <View style={styles.iconWrap}>
              <Ionicons name={item.icon} size={22} color="#1D4ED8" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDesc}>{item.description}</Text>
            </View>
            {selectedRole === item.key && <Ionicons name="checkmark-circle" size={22} color="#2563EB" />}
          </Pressable>
        ))}
      </View>
      <Text style={styles.helper}>Ausgewählt: {selectedTitle}</Text>
      <Pressable style={styles.primaryButton} onPress={() => handleContinue('Login')}>
        <Text style={styles.primaryText}>Weiter zur Anmeldung</Text>
      </Pressable>
      <Pressable style={styles.secondaryButton} onPress={() => handleContinue(selectedRole === 'Patient' ? 'RegisterPatient' : 'RegisterTherapist')}>
        <Text style={styles.secondaryText}>Neu registrieren</Text>
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
    marginTop: 8,
    marginBottom: 20,
  },
  roleList: {
    gap: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  cardSelected: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  cardDesc: {
    color: '#475569',
    marginTop: 4,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#E0E7FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  helper: {
    color: '#334155',
    marginVertical: 16,
    fontWeight: '600',
  },
  primaryButton: {
    backgroundColor: '#1D4ED8',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 10,
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
  },
  secondaryText: {
    color: '#1D4ED8',
    fontWeight: '700',
    fontSize: 16,
  },
});
