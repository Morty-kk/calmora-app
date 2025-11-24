import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../../context/UserContext';

const exercises = [
  { id: 'mindfulness', label: 'Achtsamkeit' },
  { id: 'breathing', label: 'Atmung' },
  { id: 'meditation', label: 'Meditation' },
  { id: 'pme', label: 'PME' },
];

const HomeScreen = () => {
  const navigation = useNavigation();
  const { user } = useUser();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.greeting}>Hey {user?.name || 'Gast'},</Text>
      <Text style={styles.subGreeting}>wie schön, dass du da bist</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Verfügbare Übungen</Text>
        <View style={styles.exerciseGrid}>
          {exercises.map((item) => (
            <TouchableOpacity key={item.id} style={styles.exerciseItem}>
              <Text style={styles.exerciseText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Wie fühlst du dich heute?</Text>
        <View style={styles.moodRow}>
          {['😊', '😐', '😟', '😢'].map((emoji) => (
            <TouchableOpacity key={emoji} style={styles.moodButton}>
              <Text style={styles.moodEmoji}>{emoji}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={[styles.button, styles.panicButton]}
        onPress={() => navigation.navigate('Panic')}
      >
        <Text style={[styles.buttonText, styles.panicText]}>Panik-Knopf</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.primaryButton]}
        onPress={() => navigation.navigate('Terms')}
      >
        <Text style={styles.buttonText}>Therapie-Termin vereinbaren</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 20,
  },
  greeting: {
    fontSize: 26,
    fontWeight: '700',
    color: '#0f172a',
  },
  subGreeting: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#0f172a',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 12,
  },
  exerciseGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  exerciseItem: {
    backgroundColor: '#e0f2fe',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  exerciseText: {
    color: '#0369a1',
    fontWeight: '600',
  },
  moodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  moodButton: {
    backgroundColor: '#f1f5f9',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moodEmoji: {
    fontSize: 24,
  },
  button: {
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 14,
  },
  primaryButton: {
    backgroundColor: '#2563eb',
  },
  panicButton: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
  panicText: {
    color: '#ef4444',
  },
});

export default HomeScreen;
