// app/menu.tsx
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
// Update the import path if BottomTabs is in a different location, e.g.:
import BottomTabs from '../components/BottomTabs';
// Or create the file at '../src/components/BottomTabs.tsx' if it does not exist.

function Tile({
  title,
  icon,
  onPress,
}: {
  title: string;
  icon: React.ReactNode;
  onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.tile}>
      <View style={{ alignItems: 'center', gap: 6 }}>
        {icon}
        <Text style={styles.tileTitle}>{title}</Text>
      </View>
    </Pressable>
  );
}

export default function Menu() {
  const name = 'Karl';

  return (
    <ImageBackground source={require('../assets/bg.png')} style={styles.bg} resizeMode="cover">
      <View style={styles.wrap}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.brand}>Calmora</Text>
          <Ionicons name="menu" size={22} color="#2B2B2B" />
        </View>
        <Text style={styles.greeting}>Hey {name}, wie schön,{'\n'}dass du da bist</Text>
        <View style={styles.divider} />

        {/* Reminder */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Remind:</Text>
          <Text style={styles.cardText}>
            Die nächste Sitzung: <Text style={styles.cardStrong}>28.02.25, 09:30</Text>
          </Text>
        </View>

        {/* Übungen */}
        <Text style={styles.sectionTitle}>Übungen:</Text>
        <View style={styles.grid}>
           <Tile
    title="Atmung"
    icon={<Ionicons name="leaf-outline" size={28} color="#2B2B2B" />}
    onPress={() => router.push('/breath')}
  />
          <Tile
  title="Achtsamkeit"
  icon={<MaterialCommunityIcons name="meditation" size={28} color="#2B2B2B" />}
  onPress={() => router.push("/achtsamkeit")}
/>
          <Tile
            title={'Progressive\nMuskelentspannung'}
            icon={<MaterialCommunityIcons name="human-male-board" size={28} color="#2B2B2B" />}
          />
          <Tile title="Meditation" icon={<Ionicons name="flower-outline" size={28} color="#2B2B2B" />} />
        </View>

        {/* Termin CTA */}
        <Pressable style={styles.apptBtn} onPress={() => router.push('/appointment')}>
          <Text style={styles.apptBtnText}>Neuen Termin vereinbaren</Text>
        </Pressable>

        <View style={{ flex: 1 }} />

        {/* Don't Panic */}
        <Pressable style={styles.panic}>
          <Ionicons name="megaphone" size={22} color="#1f2937" />
          <Text style={styles.panicText}>DON’T{'\n'}PANIC</Text>
        </Pressable>

        {/* Bottom Tabs */}
        <BottomTabs />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  wrap: { flex: 1, padding: 16, paddingBottom: 120 }, // why: Platz für Tabs
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  brand: { fontSize: 20, fontWeight: '700', opacity: 0.85, color: '#2B2B2B' },
  greeting: { fontSize: 18, fontWeight: '700', color: '#3b4b7a', marginTop: 8 },
  divider: { height: 1, backgroundColor: '#00000022', marginVertical: 12 },

  card: { backgroundColor: '#ffffffcc', borderRadius: 14, padding: 14, gap: 6 },
  cardLabel: { fontWeight: '700', opacity: 0.6 },
  cardText: { fontSize: 14, color: '#222' },
  cardStrong: { fontWeight: '800' },

  sectionTitle: { fontSize: 20, fontWeight: '800', marginVertical: 10 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  tile: {
    width: '47%',
    backgroundColor: '#F8E3D7',
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileTitle: { fontWeight: '600', textAlign: 'center', color: '#2B2B2B' },

  apptBtn: {
    alignSelf: 'center',
    marginTop: 12,
    backgroundColor: '#E3ECF7',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 14,
    zIndex: 2,
  },
  apptBtnText: { fontWeight: '700', color: '#111827' },

  panic: {
    backgroundColor: '#F7B9AE',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 16,
    marginBottom: 150, // why: Tabs überdecken nicht
  },
  panicText: { fontSize: 18, fontWeight: '900', lineHeight: 20, color: '#1f2937' },
});
