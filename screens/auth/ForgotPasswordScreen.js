import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ForgotPasswordScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');

  const onSubmit = () => {
    if (!email) {
      Alert.alert('Hinweis', 'Bitte trage deine E-Mail ein.');
      return;
    }
    Alert.alert('E-Mail gesendet', 'Bitte prüfe deinen Posteingang.');
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Passwort vergessen?</Text>
      <Text style={styles.subtitle}>Wir senden dir einen Link zum Zurücksetzen</Text>

      <TextInput
        style={styles.input}
        placeholder="E-Mail"
        placeholderTextColor="#94a3b8"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TouchableOpacity style={styles.primaryButton} onPress={onSubmit}>
        <Text style={styles.primaryText}>Link senden</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 14,
    padding: 14,
    color: '#0f172a',
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: '#2563eb',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryText: {
    color: '#fff',
    fontWeight: '700',
  },
});

export default ForgotPasswordScreen;
