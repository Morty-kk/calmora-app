import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ImageBackground, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

const THERAPISTS = [
  { id: '1', name: 'Herr Bellamy N', rating: 4.5, reviews: 135 },
  { id: '2', name: 'Herr Aziz D', rating: 4.3, reviews: 130 },
  { id: '3', name: 'Frau Marc M', rating: 4.3, reviews: 140 },
  { id: '4', name: 'Herr O’Boyle J', rating: 4.5, reviews: 135 },
  { id: '5', name: 'Herr Klimisch', rating: 4.2, reviews: 110 },
  { id: '6', name: 'Herr Martinez', rating: 4.4, reviews: 128 },
];

function TherapistCard({
  t, selected, onPress,
}: { t: { id: string; name: string; rating: number; reviews: number }; selected: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={a.cardTherapist}>
      <View style={{ height: 90, borderRadius: 12, backgroundColor: '#e5e7eb' }} />
      {selected && <View style={a.dot} />}
      <Text style={a.tName}>{t.name}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
        <Ionicons name="star" size={14} color="#f59e0b" />
        <Text style={a.tRating}>{t.rating.toFixed(1)} ({t.reviews} reviews)</Text>
      </View>
    </Pressable>
  );
}

export default function Appointment() {
  const [q, setQ] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return THERAPISTS;
    return THERAPISTS.filter(x => x.name.toLowerCase().includes(s));
  }, [q]);

  return (
    <ImageBackground source={require('../assets/bg.png')} style={a.bg} resizeMode="cover">
      <View style={a.wrap}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <Pressable onPress={() => router.back()} style={a.backBtn}>
            <Ionicons name="chevron-back" size={20} color="#111827" />
          </Pressable>
          <Text style={a.title}>Wähle den Therapeuten, den du möchtest</Text>
        </View>
        <View style={a.headerLine} />

        <View style={a.searchBox}>
          <Ionicons name="search" size={16} color="#6b7280" />
          <TextInput placeholder="suchen" value={q} onChangeText={setQ} style={{ flex: 1, paddingVertical: 8 }} autoCapitalize="none" />
        </View>

        <View style={a.grid}>
          {list.map(t => (
            <TherapistCard key={t.id} t={t} selected={selected === t.id} onPress={() => setSelected(t.id)} />
          ))}
        </View>

        <Pressable
          style={[a.primaryBtn, !selected && { opacity: 0.5 }]}
          disabled={!selected}
          onPress={() => {
            if (!selected) return;
            const t = THERAPISTS.find(x => x.id === selected)!;
            router.push({ pathname: '/appointment-details', params: { id: t.id, name: t.name } });
          }}
        >
          <Text style={a.primaryBtnText}>Weiter</Text>
        </Pressable>
      </View>
    </ImageBackground>
  );
}

const a = StyleSheet.create({
  bg: { flex: 1 },
  wrap: { flex: 1, padding: 16, paddingBottom: 24 },
  backBtn: { width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: '#e5e7eb', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
  title: { flex: 1, fontSize: 16, fontWeight: '700', color: '#111827' },
  headerLine: { height: 1, backgroundColor: '#00000020', marginBottom: 12 },
  searchBox: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#ffffffcc', borderRadius: 12, paddingHorizontal: 12, marginBottom: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12 },
  cardTherapist: { width: '48%', backgroundColor: '#F8E3D7', borderRadius: 16, padding: 12, gap: 8, position: 'relative' },
  dot: { position: 'absolute', top: 8, right: 8, width: 10, height: 10, borderRadius: 5, backgroundColor: '#3b82f6' },
  tName: { fontWeight: '700', color: '#111827' },
  tRating: { fontSize: 12, color: '#374151' },
  primaryBtn: { alignSelf: 'center', marginTop: 16, backgroundColor: '#9E86B9', paddingVertical: 12, paddingHorizontal: 22, borderRadius: 14 },
  primaryBtnText: { color: '#fff', fontWeight: '800' },
});