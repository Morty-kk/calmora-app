import React, { useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { useAuth } from '../../context/AuthContext';

const OTP_LENGTH = 6;

export default function OTPVerificationScreen({ route }) {
  const { verifyOTP, role, loading } = useAuth();
  const targetRole = useMemo(() => route?.params?.role || role || 'Patient', [route?.params, role]);
  const [code, setCode] = useState(Array(OTP_LENGTH).fill(''));
  const [error, setError] = useState('');
  const inputs = useRef([]);

  const handleChange = (value, index) => {
    const sanitized = value.slice(-1);
    const updated = [...code];
    updated[index] = sanitized;
    setCode(updated);

    if (sanitized && index < OTP_LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const joined = code.join('');
    if (joined.length !== 4 && joined.length !== 6) {
      setError('Bitte gib einen 4- oder 6-stelligen Code ein.');
      return;
    }
    setError('');
    try {
      await verifyOTP(joined);
    } catch (err) {
      // handled in context
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Code eingeben</Text>
      <Text style={styles.subtitle}>
        Wir haben einen Code an deine E-Mail gesendet. Rolle: {targetRole}
      </Text>

      <View style={styles.otpRow}>
        {code.map((digit, index) => (
          <TextInput
            key={index}
            ref={(el) => (inputs.current[index] = el)}
            style={styles.otpBox}
            keyboardType="number-pad"
            maxLength={1}
            value={digit}
            onChangeText={(value) => handleChange(value, index)}
          />
        ))}
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Pressable style={styles.primaryButton} onPress={handleVerify} disabled={loading}>
        <Text style={styles.primaryText}>{loading ? 'Prüfe…' : 'Verifizieren'}</Text>
      </Pressable>
      <Pressable style={styles.secondaryButton}>
        <Text style={styles.secondaryText}>Code erneut senden</Text>
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
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  otpBox: {
    width: 50,
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
  },
  error: {
    color: '#DC2626',
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: '#1D4ED8',
    borderRadius: 12,
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
    borderWidth: 1,
    borderColor: '#1D4ED8',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondaryText: {
    color: '#1D4ED8',
    fontWeight: '700',
    fontSize: 16,
  },
});
