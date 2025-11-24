import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useUser } from '../../context/UserContext';

const ProfileScreen = () => {
  const { logout, role } = useAuth();
  const { user } = useUser();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profil</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Name</Text>
        <Text style={styles.value}>{user?.name || 'Unbekannt'}</Text>
        <Text style={styles.label}>E-Mail</Text>
        <Text style={styles.value}>{user?.email || 'karl@calmora.app'}</Text>
        <Text style={styles.label}>Rolle</Text>
        <Text style={styles.value}>{role || user?.role || 'patient'}</Text>
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#0f172a',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  label: {
    color: '#94a3b8',
    marginTop: 8,
  },
  value: {
    color: '#0f172a',
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutText: {
    color: '#fff',
    fontWeight: '700',
  },
});

export default ProfileScreen;
