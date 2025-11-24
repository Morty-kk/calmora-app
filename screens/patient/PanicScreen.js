import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const PanicScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Panik-Hilfe</Text>
      <Text style={styles.subtitle}>
        Atme tief ein und aus. Folge den angeleiteten Schritten, um dich zu beruhigen.
      </Text>
      <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.goBack()}>
        <Text style={styles.primaryText}>Zurück</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    color: '#64748b',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  primaryButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  primaryText: {
    color: '#fff',
    fontWeight: '700',
  },
});

export default PanicScreen;
