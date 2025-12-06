import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React from 'react';
import { ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';

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

export default function Home() {
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
          <Tile title="Atmung" icon={<Ionicons name="leaf-outline" size={28} color="#2B2B2B" />} />
          <Tile title="Achtsamkeit" icon={<MaterialCommunityIcons name="meditation" size={28} color="#2B2B2B" />} />
          <Tile
            title={'Progressive\nMuskelentspannung'}
            icon={<MaterialCommunityIcons name="human-male-board" size={28} color="#2B2B2B" />}
          />
          <Tile title="Meditation" icon={<Ionicons name="flower-outline" size={28} color="#2B2B2B" />} />
        </View>

        {/* Termin CTA */}
        <Pressable style={styles.apptBtn}>
          <Text style={styles.apptBtnText}>Neuen Termin vereinbaren</Text>
        </Pressable>

        <View style={{ flex: 1 }} />

        {/* Don't Panic */}
        <Pressable style={styles.panic}>
          <Ionicons name="megaphone" size={22} color="#1f2937" />
          <Text style={styles.panicText}>DON’T{'\n'}PANIC</Text>
        </Pressable>

        {/* Bottom Tabs (FIXED) */}
        <View style={styles.tabs}>
          <Link href="/home" asChild>
            <Pressable style={styles.tabItem}>
              <Ionicons name="home" size={18} color="#111827" />
              <Text style={styles.tabLabel}>Startseite</Text>
            </Pressable>
          </Link>

          <Link href="/chat" asChild>
            <Pressable style={styles.tabItem}>
              <Ionicons name="chatbubble-ellipses" size={18} color="#111827" />
              <Text style={styles.tabLabel}>Chat</Text>
            </Pressable>
          </Link>

          <Link href="/profile" asChild>
            <Pressable style={styles.tabItem}>
              <Ionicons name="person" size={18} color="#111827" />
              <Text style={styles.tabLabel}>Profil</Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  wrap: { flex: 1, padding: 16, paddingBottom: 90 },
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
  },
  panicText: { fontSize: 18, fontWeight: '900', lineHeight: 20, color: '#1f2937' },

  tabs: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 16,
    backgroundColor: '#F5D8C9',
    borderRadius: 16,
    flexDirection: 'row',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    borderWidth: 1,
    borderColor: '#00000010',
  },
  tabItem: { flex: 1, alignItems: 'center', paddingVertical: 10, gap: 2 },
  tabLabel: { fontSize: 12, color: '#111827' },
});