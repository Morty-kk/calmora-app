import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export default function DiaryScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tagebuch</Text>
      <Text style={styles.subtitle}>Halte deine Gedanken und Fortschritte fest.</Text>
      <TextInput
        multiline
        numberOfLines={6}
        placeholder="Was möchtest du heute notieren?"
        placeholderTextColor="#94A3B8"
        style={styles.input}
      />
      <Pressable style={styles.primaryButton}>
        <Text style={styles.primaryText}>Eintrag speichern</Text>
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
    marginBottom: 6,
  },
  subtitle: {
    color: '#475569',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    textAlignVertical: 'top',
    minHeight: 160,
    fontSize: 16,
    color: '#0F172A',
    marginBottom: 16,
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
