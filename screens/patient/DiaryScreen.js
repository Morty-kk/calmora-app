import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const DiaryScreen = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Tagebuch</Text>
    <Text style={styles.subtitle}>Schreibe deine Gedanken, Emotionen und Fortschritte.</Text>
  </View>
);

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
    marginBottom: 8,
  },
  subtitle: {
    color: '#64748b',
  },
});

export default DiaryScreen;
