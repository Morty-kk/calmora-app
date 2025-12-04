import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { useAuth } from '../../context/AuthContext';

const genders = ['Weiblich', 'Männlich', 'Divers'];

export default function RegisterPatientScreen({ navigation, route }) {
  const { register, setRole, loading } = useAuth();
  const selectedRole = useMemo(() => route?.params?.selectedRole || 'Patient', [route?.params]);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    gender: '',
    dob: '',
    phone: '',
  });
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setRole(selectedRole);
  }, [selectedRole, setRole]);

  const updateField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const validate = () => {
    if (Object.values(form).some((value) => !value)) {
      setError('Bitte fülle alle Pflichtfelder aus.');
      return false;
    }
    if (!consent) {
      setError('Bitte stimme der Datenverarbeitung zu.');
      return false;
    }
    setError('');
    return true;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    try {
      await register({
        email: form.email,
        password: form.password,
        profile: {
          role: 'Patient',
          name: `${form.firstName} ${form.lastName}`,
          gender: form.gender,
          dob: form.dob,
          phone: form.phone,
        },
      });
      navigation.navigate('OTPVerification', { role: 'Patient' });
    } catch (err) {
      // handled in context
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
      <Text style={styles.title}>Registrierung Patient:in</Text>
      <Text style={styles.subtitle}>Lege deinen Account an.</Text>

      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Vorname</Text>
          <TextInput
            style={styles.input}
            placeholder="Karl"
            value={form.firstName}
            onChangeText={(text) => updateField('firstName', text)}
          />
        </View>
        <View style={{ width: 12 }} />
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Nachname</Text>
          <TextInput
            style={styles.input}
            placeholder="Beispiel"
            value={form.lastName}
            onChangeText={(text) => updateField('lastName', text)}
          />
        </View>
      </View>

      <Text style={styles.label}>E-Mail</Text>
      <TextInput
        style={styles.input}
        placeholder="dein.name@mail.de"
        autoCapitalize="none"
        keyboardType="email-address"
        value={form.email}
        onChangeText={(text) => updateField('email', text)}
      />

      <Text style={styles.label}>Passwort</Text>
      <TextInput
        style={styles.input}
        placeholder="••••••••"
        secureTextEntry
        value={form.password}
        onChangeText={(text) => updateField('password', text)}
      />

      <Text style={styles.label}>Geschlecht</Text>
      <View style={styles.chipRow}>
        {genders.map((gender) => (
          <Pressable
            key={gender}
            style={[styles.chip, form.gender === gender && styles.chipSelected]}
            onPress={() => updateField('gender', gender)}
          >
            <Text style={[styles.chipText, form.gender === gender && styles.chipTextSelected]}>{gender}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.label}>Geburtsdatum</Text>
      <TextInput
        style={styles.input}
        placeholder="TT.MM.JJJJ"
        value={form.dob}
        onChangeText={(text) => updateField('dob', text)}
      />

      <Text style={styles.label}>Telefonnummer</Text>
      <TextInput
        style={styles.input}
        placeholder="+49 151 1234567"
        keyboardType="phone-pad"
        value={form.phone}
        onChangeText={(text) => updateField('phone', text)}
      />

      <Pressable style={styles.checkboxRow} onPress={() => setConsent((prev) => !prev)}>
        <View style={[styles.checkbox, consent && styles.checkboxChecked]} />
        <Text style={styles.checkboxText}>
          Ich stimme der Verarbeitung meiner personenbezogenen und Gesundheitsdaten zu
        </Text>
      </Pressable>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Pressable style={styles.primaryButton} onPress={handleRegister} disabled={loading}>
        <Text style={styles.primaryText}>{loading ? 'Laden…' : 'Registrieren'}</Text>
      </Pressable>
      <Pressable style={styles.secondaryButton} onPress={() => navigation.navigate('Login', { selectedRole })}>
        <Text style={styles.secondaryText}>Zurück zur Anmeldung</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 24,
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
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
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
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
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 16,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
  },
  checkboxChecked: {
    backgroundColor: '#1D4ED8',
    borderColor: '#1D4ED8',
  },
  checkboxText: {
    flex: 1,
    color: '#0F172A',
  },
  error: {
    color: '#DC2626',
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
