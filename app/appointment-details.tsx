import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Alert,
  ImageBackground,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import CustomDrawer from '../components/Customrawer';

import { BACKEND_URL } from '../constants/backend';

type Params = { id?: string; name?: string; email?: string };

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
  const { name, email } = useLocalSearchParams<Params>();

  const [current, setCurrent] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const days = useMemo(
    () => buildMonth(current.getFullYear(), current.getMonth()),
    [current]
  );

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);

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

  const onConfirm = async () => {
    if (!selectedDate || !slot) {
      Alert.alert('Bitte auswählen', 'Datum und Uhrzeit wählen.');
      return;
    }

    try {
      // ✅ token من AsyncStorage (أنت مخزنه وقت login)
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Login', 'Bitte zuerst anmelden.');
        return;
      }

      // ✅ كوّن startsAt من selectedDate + slot
      const [hh, mm] = slot.split(':').map(Number);
      const startsAt = new Date(selectedDate);
      startsAt.setHours(hh, mm, 0, 0);

      // ✅ الطبيب المختار من الصفحة السابقة
      const therapistEmail = (email ?? 'therapist@example.com').trim();

      console.log('Sending appointment request:', {
        startsAt: startsAt.toISOString(),
        note: notes?.trim() ? notes.trim() : null,
        therapistEmail,
      });

      const res = await fetch(`${BACKEND_URL}/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          startsAt: startsAt.toISOString(),
          note: notes?.trim() ? notes.trim() : null,
          therapistEmail,
        }),
      });

      console.log('Response status:', res.status);
      const data = await res.json();
      console.log('Response data:', data);

      if (!res.ok) {
        Alert.alert(
          'Fehler',
          data?.error || data?.message || 'Buchung fehlgeschlagen'
        );
        return;
      }

      // ✅ نجاح → روح على success مثل ما عندك
      const d = selectedDate.toLocaleDateString('de-DE');
      console.log('Navigating to success page...');
      router.push({
        pathname: '/appointment-success',
        params: { date: d, time: slot, name: name ?? 'Therapeut' },
      });
    } catch (e) {
      console.error('Error in onConfirm:', e);
      Alert.alert('Fehler', 'Server nicht erreichbar: ' + e.message);
    }
  };

  return (
    <ImageBackground
      source={require('../assets/bg.png')}
      style={s.bg}
      resizeMode="cover"
    >
      <ScrollView style={s.wrap} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={s.header}>
          <TouchableOpacity onPress={() => router.push('/menu')} style={s.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#9E86B9" />
          </TouchableOpacity>
          <Text style={s.brand}>Calmora</Text>
          <TouchableOpacity onPress={() => setDrawerOpen(true)}>
            <Ionicons name="menu" size={28} color="#9E86B9" />
          </TouchableOpacity>
        </View>

        {/* Hero Section */}
        <View style={s.hero}>
          <View style={s.heroIcon}>
            <Ionicons name="calendar-outline" size={40} color="#9E86B9" />
          </View>
          <Text style={s.heroTitle}>Termin für {name || 'Therapeut'}</Text>
          <Text style={s.heroSubtitle}>
            Wähle ein Datum und eine Uhrzeit für deinen Termin
          </Text>
        </View>

        {/* Calendar Card */}
        <View style={s.calendarCard}>
          {/* Monat */}
          <View style={s.monthRow}>
            <TouchableOpacity
              onPress={() =>
                setCurrent((c) => new Date(c.getFullYear(), c.getMonth() - 1, 1))
              }
              style={s.monthBtn}
            >
              <Ionicons name="chevron-back" size={20} color="#9E86B9" />
            </TouchableOpacity>
            <Text style={s.monthTitle}>
              {monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1)}
            </Text>
            <TouchableOpacity
              onPress={() =>
                setCurrent((c) => new Date(c.getFullYear(), c.getMonth() + 1, 1))
              }
              style={s.monthBtn}
            >
              <Ionicons name="chevron-forward" size={20} color="#9E86B9" />
            </TouchableOpacity>
          </View>

        {/* Wochentage */}
        <View style={s.weekRow}>
          {WEEK.map((w) => (
            <Text key={w} style={s.weekCell}>
              {w}
            </Text>
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
                  onPress={() => {
                    setSelectedDate(new Date(d));
                    setSlot(null);
                  }}
                  style={[
                    s.dayCell,
                    !inMonth && { opacity: 0.35 },
                    isSelected && s.daySelected,
                    isToday && !isSelected && s.dayToday,
                  ]}
                >
                  <Text style={[s.dayText, isSelected && { color: '#fff' }]}>
                    {d.getDate()}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Selected Date Info */}
        {selectedDate && (
          <View style={s.dateInfoCard}>
            <Ionicons name="calendar" size={20} color="#9E86B9" />
            <Text style={s.dateInfoText}>
              {selectedDate.toLocaleDateString('de-DE', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Text>
          </View>
        )}

        {/* Time Slots */}
        <View style={s.slotsSection}>
          <View style={s.sectionHeader}>
            <Ionicons name="time-outline" size={22} color="#9E86B9" />
            <Text style={s.sectionTitle}>Verfügbare Zeiten</Text>
          </View>
          <View style={s.slotRow}>
            {(selectedDate ? slotsForDay(selectedDate) : BASE_SLOTS).map((t) => (
              <Pressable
                key={t}
                onPress={() => setSlot(t)}
                style={[s.slotChip, slot === t && s.slotActive]}
              >
                <Ionicons 
                  name="time" 
                  size={16} 
                  color={slot === t ? '#fff' : '#9E86B9'} 
                />
                <Text style={[s.slotText, slot === t && { color: '#fff' }]}>
                  {t}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Notizen */}
        <View style={s.notesSection}>
          <View style={s.sectionHeader}>
            <Ionicons name="create-outline" size={22} color="#9E86B9" />
            <Text style={s.sectionTitle}>Notizen (optional)</Text>
          </View>
          <TextInput
            placeholder="Füge Notizen für deinen Therapeuten hinzu..."
            placeholderTextColor="#9CA3AF"
            value={notes}
            onChangeText={setNotes}
            multiline
            style={s.notes}
          />
        </View>

        {/* Bestätigen */}
        <TouchableOpacity 
          style={[s.primaryBtn, (!selectedDate || !slot) && { opacity: 0.5 }]} 
          onPress={onConfirm}
          disabled={!selectedDate || !slot}
          activeOpacity={0.8}
        >
          <Text style={s.primaryText}>Termin bestätigen</Text>
          <Ionicons name="checkmark-circle" size={22} color="#fff" />
        </TouchableOpacity>
      </ScrollView>

      {/* Drawer Modal */}
      <Modal
        visible={drawerOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setDrawerOpen(false)}
      >
        <View style={s.drawerContainer}>
          <TouchableOpacity 
            style={s.drawerOverlay}
            activeOpacity={1}
            onPress={() => setDrawerOpen(false)}
          />
          <View style={s.drawerContent}>
            <CustomDrawer 
              navigation={{ navigate: (route: string) => { router.push(route as any); setDrawerOpen(false); } } as any}
              onLogout={() => { setDrawerOpen(false); router.push("/login-patient"); }}
            />
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
}

const s = StyleSheet.create({
  bg: { flex: 1 },
  wrap: { flex: 1, padding: 20 },

  /* HEADER */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  brand: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1F2937',
    letterSpacing: 0.5,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  /* HERO */
  hero: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  heroIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F3E8FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 280,
  },

  /* CALENDAR CARD */
  calendarCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  monthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  monthBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3E8FF',
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    textTransform: 'capitalize',
  },

  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  weekCell: {
    width: 40,
    textAlign: 'center',
    color: '#9CA3AF',
    fontWeight: '600',
    fontSize: 12,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between',
  },
  dayCell: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
  },
  daySelected: { 
    backgroundColor: '#9E86B9',
    shadowColor: '#9E86B9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  dayToday: { 
    borderWidth: 2, 
    borderColor: '#9E86B9',
    backgroundColor: '#fff',
  },
  dayText: { 
    color: '#1F2937', 
    fontWeight: '600',
    fontSize: 14,
  },

  /* DATE INFO */
  dateInfoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F3E8FF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  dateInfoText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },

  /* SLOTS SECTION */
  slotsSection: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  slotRow: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 12,
  },
  slotChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  slotActive: { 
    backgroundColor: '#9E86B9',
    shadowColor: '#9E86B9',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  slotText: { 
    color: '#1F2937', 
    fontWeight: '700',
    fontSize: 14,
  },

  /* NOTES */
  notesSection: {
    marginBottom: 24,
  },
  notes: {
    minHeight: 100,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    fontSize: 14,
    color: '#1F2937',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    textAlignVertical: 'top',
  },

  /* BUTTON */
  primaryBtn: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#9E86B9',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginBottom: 32,
    shadowColor: '#9E86B9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryText: { 
    fontWeight: '800', 
    color: '#fff',
    fontSize: 16,
  },

  /* DRAWER */
  drawerContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  drawerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  drawerContent: {
    width: 280,
    height: '100%',
  },
});
