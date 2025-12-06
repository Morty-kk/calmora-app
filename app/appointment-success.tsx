import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import BottomTabs from '../components/BottomTabs';

type Params = { date?: string; time?: string; name?: string };

export default function AppointmentSuccess() {
  const { date, time, name } = useLocalSearchParams<Params>();

  return (
    <ImageBackground source={require('../assets/bg.png')} style={s.bg} resizeMode="cover">
      <View style={s.wrap}>
        {/* Mini-Header */}
        <View style={s.header}>
          <Ionicons name="chevron-back" size={22} color="#111827" onPress={() => router.back()} />
          <Ionicons name="menu" size={22} color="#111827" />
        </View>
        <View style={s.divider} />

        {/* Big Check */}
        <View style={s.center}>
          <View style={s.circleOuter}>
            <View style={s.circleInner}>
              <Ionicons name="checkmark" size={72} color="#111827" />
            </View>
          </View>
        </View>

        {/* Text */}
        <Text style={s.msg}>
          Sie haben ein Termin am <Text style={s.strong}>{date ?? '—'}</Text> um{' '}
          <Text style={s.strong}>{time ?? '—'}</Text> vereinbart
          {name ? ` (mit ${name})` : ''}.
        </Text>

        <BottomTabs />
      </View>
    </ImageBackground>
  );
}

const s = StyleSheet.create({
  bg: { flex: 1 },
  wrap: { flex: 1, padding: 16, paddingBottom: 120 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  divider: { height: 1, backgroundColor: '#00000022', marginVertical: 10 },
  center: { alignItems: 'center', marginTop: 40, marginBottom: 24 },
  circleOuter: {
    width: 220, height: 220, borderRadius: 110, backgroundColor: '#FFE7DE',
    alignItems: 'center', justifyContent: 'center', borderWidth: 6, borderColor: '#fff',
  },
  circleInner: {
    width: 180, height: 180, borderRadius: 90, backgroundColor: '#FFEDE6',
    alignItems: 'center', justifyContent: 'center',
  },
  msg: { textAlign: 'center', marginTop: 12, color: '#111827' },
  strong: { fontWeight: '800' },
});