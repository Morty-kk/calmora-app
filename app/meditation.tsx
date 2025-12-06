// app/meditation.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
export default function Meditation() {
  return (
    <View style={s.wrap}>
      <Text style={s.h1}>Meditation</Text>
      <Text>Geführte Meditation.</Text>
    </View>
  );
}
const s = StyleSheet.create({ wrap:{flex:1,padding:16,paddingTop:60}, h1:{fontSize:22,fontWeight:'700',marginBottom:8} });
