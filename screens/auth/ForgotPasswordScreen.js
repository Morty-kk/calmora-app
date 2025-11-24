import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [info, setInfo] = useState('');

  const handleSubmit = () => {
    if (!email) {
      setInfo('Bitte gib deine E-Mail ein.');
      return;
    }
    setInfo('Wenn ein Konto existiert, senden wir dir einen Reset-Link.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Passwort vergessen</Text>
      <Text style={styles.subtitle}>Wir senden dir Anweisungen per E-Mail.</Text>

      <Text style={styles.label}>E-Mail</Text>
      <TextInput
        style={styles.input}
        placeholder="dein.name@mail.de"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      {info ? <Text style={styles.info}>{info}</Text> : null}

      <Pressable style={styles.primaryButton} onPress={handleSubmit}>
        <Text style={styles.primaryText}>Anfrage senden</Text>
      </Pressable>
      <Pressable style={styles.secondaryButton} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.secondaryText}>Zurück</Text>
      </Pressable>
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
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
  },
  subtitle: {
    color: '#475569',
    marginBottom: 16,
    marginTop: 6,
  },
  label: {
    color: '#334155',
    marginTop: 12,
    marginBottom: 6,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#0F172A',
  },
  info: {
    color: '#334155',
    marginTop: 10,
  },
  primaryButton: {
    backgroundColor: '#1D4ED8',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  primaryText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#1D4ED8',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 12,
  },
  secondaryText: {
    color: '#1D4ED8',
    fontWeight: '700',
    fontSize: 16,
  },
});
