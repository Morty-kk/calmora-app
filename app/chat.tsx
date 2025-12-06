// app/chat.tsx  (Minimal + Tabs)
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import BottomTabs from '../components/BottomTabs';

export default function Chat() {
  return (
    <View style={s.wrap}>
      <Text style={s.h1}>Chat</Text>
      <Text>Hier kommt später der Chat.</Text>
      <BottomTabs />
    </View>
  );
}
const s = StyleSheet.create({
  wrap: { flex: 1, padding: 16, paddingTop: 60, paddingBottom: 90 },
  h1: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
});
