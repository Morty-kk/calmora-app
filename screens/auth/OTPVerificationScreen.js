import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';

const OTPVerificationScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { verifyOTP, role } = useAuth();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const inputs = useRef([]);
  const activeRole = route.params?.role || role || 'patient';

  const updateCode = (value, index) => {
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    if (value && index < code.length - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const onSubmit = async () => {
    const joined = code.join('').trim();
    try {
      await verifyOTP(joined);
      navigation.reset({ index: 0, routes: [{ name: activeRole === 'therapist' ? 'Therapist' : 'PatientTabs' }] });
    } catch (error) {
      Alert.alert('Fehler', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>OTP Verifizierung</Text>
      <Text style={styles.subtitle}>Gib den 4- oder 6-stelligen Code ein</Text>

      <View style={styles.otpRow}>
        {code.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputs.current[index] = ref)}
            style={styles.otpInput}
            keyboardType="number-pad"
            maxLength={1}
            value={digit}
            onChangeText={(text) => updateCode(text, index)}
          />
        ))}
      </View>

      <TouchableOpacity style={styles.primaryButton} onPress={onSubmit}>
        <Text style={styles.primaryText}>Bestätigen</Text>
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
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  otpInput: {
    width: 60,
    height: 60,
    borderRadius: 14,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    textAlign: 'center',
    fontSize: 24,
    color: '#0f172a',
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

export default OTPVerificationScreen;
