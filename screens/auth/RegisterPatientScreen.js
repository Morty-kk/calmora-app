import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';

const RegisterPatientScreen = () => {
  const navigation = useNavigation();
  const { register, setRole } = useAuth();
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    gender: '',
    dateOfBirth: '',
    phone: '',
  });

  const handleChange = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const validate = () => {
    const newErrors = {};
    const required = ['firstName', 'lastName', 'email', 'password', 'gender', 'dateOfBirth', 'phone'];
    required.forEach((field) => {
      if (!form[field]) newErrors[field] = 'Pflichtfeld';
    });
    if (!consent) newErrors.consent = 'Bitte stimme der Verarbeitung zu';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async () => {
    if (!validate()) return;
    try {
      setRole('patient');
      await register({ ...form, role: 'patient' });
      navigation.navigate('OTPVerification', { role: 'patient' });
    } catch (error) {
      Alert.alert('Fehler', error.message);
    }
  };

  const renderInput = (key, placeholder, options = {}) => (
    <View style={styles.inputWrapper} key={key}>
      <TextInput
        style={[styles.input, errors[key] && styles.inputError]}
        placeholder={placeholder}
        placeholderTextColor="#94a3b8"
        value={form[key]}
        onChangeText={(text) => handleChange(key, text)}
        {...options}
      />
      {errors[key] && <Text style={styles.errorText}>{errors[key]}</Text>}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registriere dich als Patient</Text>
      <Text style={styles.subtitle}>Erstelle deinen Zugang für Calmora</Text>

      {renderInput('firstName', 'Vorname')}
      {renderInput('lastName', 'Nachname')}
      {renderInput('email', 'E-Mail', { keyboardType: 'email-address', autoCapitalize: 'none' })}
      {renderInput('password', 'Passwort', { secureTextEntry: true })}
      {renderInput('gender', 'Geschlecht')}
      {renderInput('dateOfBirth', 'Geburtsdatum (TT.MM.JJJJ)')}
      {renderInput('phone', 'Telefonnummer', { keyboardType: 'phone-pad' })}

      <TouchableOpacity style={styles.checkboxRow} onPress={() => setConsent((prev) => !prev)}>
        <View style={[styles.checkbox, consent && styles.checkboxChecked]} />
        <Text style={styles.checkboxLabel}>
          Ich stimme der Verarbeitung meiner personenbezogenen und Gesundheitsdaten zu
        </Text>
      </TouchableOpacity>
      {errors.consent && <Text style={styles.errorText}>{errors.consent}</Text>}

      <TouchableOpacity style={styles.primaryButton} onPress={onSubmit}>
        <Text style={styles.primaryText}>Registrieren</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.secondaryText}>Zurück zur Anmeldung</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 24,
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
  inputWrapper: {
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 14,
    padding: 14,
    color: '#0f172a',
  },
  inputError: {
    borderColor: '#ef4444',
  },
  primaryButton: {
    backgroundColor: '#2563eb',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryText: {
    color: '#fff',
    fontWeight: '700',
  },
  secondaryButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  secondaryText: {
    color: '#2563eb',
    fontWeight: '600',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 8,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#2563eb',
    backgroundColor: '#fff',
  },
  checkboxChecked: {
    backgroundColor: '#2563eb',
  },
  checkboxLabel: {
    flex: 1,
    color: '#0f172a',
  },
  errorText: {
    color: '#ef4444',
    marginTop: 4,
  },
});

export default RegisterPatientScreen;
