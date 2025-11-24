import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

const appointments = [
  { id: '1', date: 'Mo, 12. Mai', time: '10:00', type: 'Online', status: 'Bestätigt' },
  { id: '2', date: 'Do, 22. Mai', time: '14:30', type: 'Vor Ort', status: 'Geplant' },
];

export default function TermsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Termine</Text>
      <Text style={styles.subtitle}>Plane oder verwalte deine Sitzungen.</Text>
      <FlatList
        data={appointments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{`${item.date} • ${item.time}`}</Text>
              <Text style={styles.meta}>{`${item.type} • ${item.status}`}</Text>
            </View>
            <Pressable style={styles.secondaryButton}>
              <Text style={styles.secondaryText}>Details</Text>
            </Pressable>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListFooterComponent={() => (
          <Pressable style={[styles.primaryButton, { marginTop: 16 }]}>
            <Text style={styles.primaryText}>Neuen Termin vereinbaren</Text>
          </Pressable>
        )}
      />
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
    marginBottom: 6,
  },
  subtitle: {
    color: '#475569',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  meta: {
    color: '#64748B',
    marginTop: 4,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#1D4ED8',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  secondaryText: {
    color: '#1D4ED8',
    fontWeight: '700',
  },
  primaryButton: {
    backgroundColor: '#1D4ED8',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
});
