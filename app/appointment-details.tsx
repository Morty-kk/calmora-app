import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Alert, ImageBackground, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

type Params = { id?: string; name?: string };

const WEEK = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const BASE_SLOTS = ['09:00', '09:30', '10:15', '12:15', '13:00']; // demo

function buildMonth(year: number, month: number) {
  const first = new Date(year, month, 1);
  const start = new Date(first);
  start.setDate(first.getDate() - ((first.getDay() + 6) % 7)); // Montag als Start
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

export default function AppointmentDetails() {
  const { name } = useLocalSearchParams<Params>();
  const [current, setCurrent] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const days = useMemo(() => buildMonth(current.getFullYear(), current.getMonth()), [current]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [notes, setNotes] = useState('');

  const monthLabel = current.toLocaleString('de-DE', { month: 'long' });

  const today = new Date();
  const sameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  // simple demo-availability: weekends weniger Slots
  const slotsForDay = (d: Date) => {
    const day = d.getDay(); // 0=So 6=Sa
    if (day === 0) return []; // Sonntag geschlossen
    if (day === 6) return BASE_SLOTS.slice(0, 2);
    return BASE_SLOTS;
  };

 const onConfirm = () => {
  if (!selectedDate || !slot) {
    Alert.alert('Bitte auswählen', 'Datum und Uhrzeit wählen.');
    return;
  }
  const d = selectedDate.toLocaleDateString('de-DE'); // z.B. 28.02.2025
  router.push({ pathname: '/appointment-success', params: { date: d, time: slot, name: name ?? 'Therapeut' } });
};

  return (
    <ImageBackground source={require('../assets/bg.png')} style={s.bg} resizeMode="cover">
      <View style={s.wrap}>
        {/* Header */}
        <View style={s.headerRow}>
          <Pressable onPress={() => router.back()} style={s.backBtn}>
            <Ionicons name="chevron-back" size={20} color="#111827" />
          </Pressable>
          <Text style={s.title}>wähle ein tag und uhrzeit</Text>
        </View>
        <View style={s.line} />

        {/* Monat */}
        <View style={s.monthRow}>
          <Pressable onPress={() => setCurrent(c => new Date(c.getFullYear(), c.getMonth() - 1, 1))} style={s.monthBtn}>
            <Ionicons name="chevron-back" size={16} />
          </Pressable>
          <Text style={s.monthTitle}>{monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1)}</Text>
          <Pressable onPress={() => setCurrent(c => new Date(c.getFullYear(), c.getMonth() + 1, 1))} style={s.monthBtn}>
            <Ionicons name="chevron-forward" size={16} />
          </Pressable>
        </View>

        {/* Wochentage */}
        <View style={s.weekRow}>
          {WEEK.map(w => (
            <Text key={w} style={s.weekCell}>{w}</Text>
          ))}
        </View>

        {/* Kalender */}
        <View style={s.grid}>
          {days.map((d, i) => {
            const inMonth = d.getMonth() === current.getMonth();
            const isToday = sameDay(d, today);
            const isSelected = selectedDate ? sameDay(d, selectedDate) : false;
            return (
              <Pressable
                key={i}
                onPress={() => { setSelectedDate(new Date(d)); setSlot(null); }}
                style={[
                  s.dayCell,
                  !inMonth && { opacity: 0.35 },
                  isSelected && s.daySelected,
                  isToday && !isSelected && s.dayToday,
                ]}
              >
                <Text style={[s.dayText, isSelected && { color: '#fff' }]}>{d.getDate()}</Text>
              </Pressable>
            );
          })}
        </View>

        {/* Datum */}
        <Text style={s.dateLine}>
          {selectedDate ? selectedDate.toLocaleDateString('de-DE') : new Date().toLocaleDateString('de-DE')}
        </Text>

        {/* Slots */}
        <View style={s.slotRow}>
          {(selectedDate ? slotsForDay(selectedDate) : BASE_SLOTS).map(t => (
            <Pressable key={t} onPress={() => setSlot(t)} style={[s.slotChip, slot === t && s.slotActive]}>
              <Text style={[s.slotText, slot === t && { color: '#fff' }]}>{t}</Text>
            </Pressable>
          ))}
        </View>

        {/* Notizen */}
        <TextInput
          placeholder="Notizen"
          value={notes}
          onChangeText={setNotes}
          multiline
          style={s.notes}
        />

        {/* Bestätigen */}
        <Pressable style={s.primaryBtn} onPress={onConfirm}>
          <Text style={s.primaryText}>Termin bestätigen</Text>
        </Pressable>
      </View>
    </ImageBackground>
  );
}

const s = StyleSheet.create({
  bg: { flex: 1 },
  wrap: { flex: 1, padding: 16, paddingBottom: 24 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
  backBtn: { width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: '#e5e7eb', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
  title: { fontSize: 16, fontWeight: '700', color: '#111827' },
  line: { height: 1, backgroundColor: '#00000030', marginVertical: 10 },

  monthRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 6 },
  monthBtn: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffffcc' },
  monthTitle: { fontSize: 16, letterSpacing: 2, textTransform: 'capitalize', color: '#6b7280', fontWeight: '700' },

  weekRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 6, marginBottom: 4 },
  weekCell: { width: 36, textAlign: 'center', color: '#6b7280', fontWeight: '700' },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, justifyContent: 'space-between', marginBottom: 10 },
  dayCell: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffffcc' },
  daySelected: { backgroundColor: '#f43f5e' },
  dayToday: { borderWidth: 1, borderColor: '#9ca3af' },
  dayText: { color: '#111827', fontWeight: '700' },

  dateLine: { marginTop: 4, marginBottom: 6, color: '#6b7280' },

  slotRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 10 },
  slotChip: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 14, backgroundColor: '#e5e7eb' },
  slotActive: { backgroundColor: '#f43f5e' },
  slotText: { color: '#111827', fontWeight: '700' },

  notes: { minHeight: 80, borderWidth: 1, borderColor: '#9ca3af', borderRadius: 10, padding: 10, backgroundColor: '#ffffffaa', marginBottom: 12 },

  primaryBtn: { alignSelf: 'center', backgroundColor: '#F8E3D7', borderRadius: 12, paddingVertical: 12, paddingHorizontal: 18 },
  primaryText: { fontWeight: '800', color: '#111827' },
});