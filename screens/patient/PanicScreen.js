import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function PanicScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Ionicons name="alert-circle" size={64} color="#DC2626" />
      </View>
      <Text style={styles.title}>Panikmodus</Text>
      <Text style={styles.subtitle}>
        Atme tief durch. Wir begleiten dich mit ruhigen Atemübungen und Soforthilfe.
      </Text>
      <Pressable style={styles.primaryButton}>
        <Text style={styles.primaryText}>Geführte Atemübung starten</Text>
      </Pressable>
      <Pressable style={styles.secondaryButton} onPress={() => navigation.goBack()}>
        <Text style={styles.secondaryText}>Zurück</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF1F2',
    padding: 24,
    justifyContent: 'center',
  },
  iconWrap: {
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#7F1D1D',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    color: '#9F1239',
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 16,
    lineHeight: 22,
  },
  primaryButton: {
    backgroundColor: '#BE123C',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  secondaryButton: {
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F43F5E',
  },
  secondaryText: {
    color: '#BE123C',
    fontWeight: '700',
  },
});
