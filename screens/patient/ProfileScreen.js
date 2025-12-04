import React, { useMemo } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { useAuth } from '../../context/AuthContext';
import { useUser } from '../../context/UserContext';

export default function ProfileScreen() {
  const { logout, role } = useAuth();
  const { user } = useUser();

  const qrValue = useMemo(() => {
    const payload = {
      id: user?.id ?? 'demo-patient',
      name: user?.name ?? 'Patient',
      email: user?.email ?? 'patient@example.com',
      role: role || 'Patient',
    };

    return encodeURIComponent(JSON.stringify(payload));
  }, [role, user]);

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${qrValue}`;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profil</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Name</Text>
        <Text style={styles.value}>{user?.name || 'Unbekannt'}</Text>
        <Text style={styles.label}>E-Mail</Text>
        <Text style={styles.value}>{user?.email || '-'}</Text>
        <Text style={styles.label}>Rolle</Text>
        <Text style={styles.value}>{role || 'Patient'}</Text>
      </View>
      <View style={styles.qrCard}>
        <Text style={styles.qrTitle}>Check-in QR-Code</Text>
        <Text style={styles.qrSubtitle}>Zum Test scannen oder teilen</Text>
        <Image source={{ uri: qrUrl }} style={styles.qr} resizeMode="contain" />
        <Text style={styles.qrHint}>Enthält deine Patient-ID für schnelle Termine.</Text>
      </View>
      <Pressable style={styles.secondaryButton} onPress={logout}>
        <Text style={styles.secondaryText}>Abmelden</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  label: {
    color: '#64748B',
    marginTop: 8,
  },
  value: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 2,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#1D4ED8',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  secondaryText: {
    color: '#1D4ED8',
    fontWeight: '700',
  },
  qrCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 16,
    alignItems: 'center',
  },
  qrTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  qrSubtitle: {
    color: '#64748B',
    marginTop: 4,
  },
  qr: {
    width: 200,
    height: 200,
    marginTop: 12,
    marginBottom: 8,
  },
  qrHint: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
  },
});
