import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

const exercises = [
  { id: '1', title: 'Achtsamkeitsübung', length: '5 min', category: 'Mindfulness' },
  { id: '2', title: 'Geführte Atemtechnik', length: '8 min', category: 'Atmung' },
  { id: '3', title: 'Meditationsreise', length: '12 min', category: 'Meditation' },
  { id: '4', title: 'PME Ganzkörper', length: '10 min', category: 'PME' },
];

export default function ExercisesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Übungen</Text>
      <Text style={styles.subtitle}>Deine Toolbox für mehr Ruhe und Klarheit.</Text>
      <FlatList
        data={exercises}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable style={styles.item}>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.meta}>{`${item.category} • ${item.length}`}</Text>
            </View>
            <Text style={styles.link}>Start</Text>
          </Pressable>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
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
  item: {
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  meta: {
    color: '#64748B',
    marginTop: 4,
  },
  link: {
    color: '#1D4ED8',
    fontWeight: '600',
  },
  separator: {
    height: 1,
    backgroundColor: '#E2E8F0',
  },
});
