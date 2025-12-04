import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function TherapistHomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Therapeut Übersicht</Text>
      <Text style={styles.subtitle}>Hier folgt die spezifische Ansicht für Therapeut:innen.</Text>
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
    fontSize: 28,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#334155',
  },
});
