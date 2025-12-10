import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useUser } from '../../context/UserContext';

const exerciseCards = [
  { title: 'Achtsamkeit', description: 'Fokussierte Awareness-Übungen', icon: 'leaf' },
  { title: 'Atmung', description: 'Geführte Atemsequenzen', icon: 'cloud' },
  { title: 'Meditation', description: 'Geführte Sessions für Ruhe', icon: 'moon' },
  { title: 'PME', description: 'Progressive Muskelentspannung', icon: 'body' },
];

const moods = ['Sehr gut', 'Gut', 'Neutral', 'Eher schlecht', 'Schlecht'];

export default function HomeScreen() {
  const navigation = useNavigation();
  const { user } = useUser();
  const [selectedMood, setSelectedMood] = useState(null);

  const greeting = useMemo(() => {
    const firstName = user?.name?.split(' ')[0] || 'Freund';
    return `Hey ${firstName}, wie schön, dass du da bist`;
  }, [user]);

  // Robust navigation to Panic from Home:
  // 1) try direct navigate('Panic')
  // 2) try navigate into Patient drawer: navigate('Patient', { screen: 'Panic' })
  // 3) try parent navigator
  const goPanic = () => {
    try {
      navigation.navigate('Panic');
      return;
    } catch (e) {
      console.log('goPanic: direct navigate failed', e);
    }

    try {
      navigation.navigate('Patient', { screen: 'Panic' });
      return;
    } catch (e) {
      console.log('goPanic: navigate Patient->Panic failed', e);
    }

    try {
      const parent = navigation.getParent && navigation.getParent();
      if (parent && typeof parent.navigate === 'function') {
        parent.navigate('Panic');
        return;
      }
    } catch (e) {
      console.log('goPanic: parent navigate failed', e);
    }

    console.log('goPanic: all attempts failed');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.greeting}>{greeting}</Text>
          <Text style={styles.subtitle}>Wir begleiten dich Schritt für Schritt.</Text>
        </View>

        <Pressable style={styles.panicButton} onPress={goPanic}>
          <Ionicons name="alert" size={22} color="#DC2626" />
          <Text style={styles.panicText}>Panik</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Wie fühlst du dich heute?</Text>
        <View style={styles.moodRow}>
          {moods.map((mood) => (
            <Pressable
              key={mood}
              style={[styles.chip, selectedMood === mood && styles.chipSelected]}
              onPress={() => setSelectedMood(mood)}
            >
              <Text style={[styles.chipText, selectedMood === mood && styles.chipTextSelected]}>{mood}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.sectionTitle}>Übungen für dich</Text>
          <Pressable onPress={() => navigation.navigate('Exercises')}>
            <Text style={styles.linkText}>Alle ansehen</Text>
          </Pressable>
        </View>
        {exerciseCards.map((exercise) => (
          <Pressable
            key={exercise.title}
            style={styles.exerciseCard}
            onPress={() => navigation.navigate('Exercises')}
          >
            <View style={styles.exerciseIcon}>
              <Ionicons name={exercise.icon} size={22} color="#1D4ED8" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.exerciseTitle}>{exercise.title}</Text>
              <Text style={styles.exerciseDescription}>{exercise.description}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
          </Pressable>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Nächster Schritt</Text>
        <Pressable style={styles.primaryButton} onPress={() => navigation.navigate('Terms')}>
          <Text style={styles.primaryButtonText}>Therapie-Termin planen</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 32,
  },
  subtitle: {
    color: '#475569',
    marginTop: 4,
  },
  panicButton: {
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  panicText: {
    color: '#B91C1C',
    fontWeight: '700',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#0F172A',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },
  moodRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F8FAFC',
  },
  chipSelected: {
    backgroundColor: '#1D4ED8',
    borderColor: '#1D4ED8',
  },
  chipText: {
    color: '#0F172A',
    fontWeight: '600',
  },
  chipTextSelected: {
    color: '#FFFFFF',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  linkText: {
    color: '#1D4ED8',
    fontWeight: '600',
  },
  exerciseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  exerciseIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#E0E7FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  exerciseTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  exerciseDescription: {
    color: '#475569',
    marginTop: 2,
  },
  primaryButton: {
    backgroundColor: '#1D4ED8',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});