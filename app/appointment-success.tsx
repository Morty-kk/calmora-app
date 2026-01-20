import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ImageBackground, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BottomTabs from '../components/BottomTabs';
import CustomDrawer from '../components/Customrawer';

type Params = { date?: string; time?: string; name?: string };

export default function AppointmentSuccess() {
  const { date, time, name } = useLocalSearchParams<Params>();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // 🔥 عند فتح الصفحة يتم حفظ الموعد الجديد تلقائياً
  useEffect(() => {
    if (!date || !time) return;

    const saveAppointment = async () => {
      try {
        await AsyncStorage.setItem(
          "nextAppointment",
          JSON.stringify({ date, time, name })
        );
      } catch (e) {
        console.log("Fehler beim Speichern des Termins", e);
      }
    };

    saveAppointment();
  }, [date, time, name]);

  return (
    <ImageBackground source={require('../assets/bg.png')} style={s.bg} resizeMode="cover">
      <ScrollView style={s.wrap} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        
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

        {/* Big Check Icon */}
        <View style={s.center}>
          <View style={s.circleOuter}>
            <View style={s.circleInner}>
              <Ionicons name="checkmark" size={80} color="#9E86B9" />
            </View>
          </View>
        </View>

        {/* Success Text */}
        <Text style={s.successTitle}>Termin bestätigt!</Text>
        <Text style={s.msg}>
          Sie haben erfolgreich einen Termin am{" "}
          <Text style={s.strong}>{date ?? '—'}</Text> um{" "}
          <Text style={s.strong}>{time ?? '—'}</Text> vereinbart
          {name ? ` mit ${name}` : ''}.
        </Text>

        {/* Info Card */}
        <View style={s.infoCard}>
          <View style={s.infoRow}>
            <Ionicons name="calendar" size={24} color="#9E86B9" />
            <View style={s.infoText}>
              <Text style={s.infoLabel}>Datum</Text>
              <Text style={s.infoValue}>{date ?? '—'}</Text>
            </View>
          </View>
          <View style={s.infoDivider} />
          <View style={s.infoRow}>
            <Ionicons name="time" size={24} color="#9E86B9" />
            <View style={s.infoText}>
              <Text style={s.infoLabel}>Uhrzeit</Text>
              <Text style={s.infoValue}>{time ?? '—'}</Text>
            </View>
          </View>
          {name && (
            <>
              <View style={s.infoDivider} />
              <View style={s.infoRow}>
                <Ionicons name="person" size={24} color="#9E86B9" />
                <View style={s.infoText}>
                  <Text style={s.infoLabel}>Therapeut</Text>
                  <Text style={s.infoValue}>{name}</Text>
                </View>
              </View>
            </>
          )}
        </View>

        {/* Action Button */}
        <TouchableOpacity 
          style={s.primaryBtn}
          onPress={() => router.push('/menu')}
          activeOpacity={0.8}
        >
          <Text style={s.primaryBtnText}>Zurück zum Menü</Text>
          <Ionicons name="home" size={20} color="#fff" />
        </TouchableOpacity>

        <BottomTabs />
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
  wrap: { flex: 1 },
  content: { padding: 20, paddingBottom: 120 },

  /* HEADER */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    marginBottom: 24,
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

  /* SUCCESS ICON */
  center: {
    alignItems: 'center',
    marginVertical: 32,
  },
  circleOuter: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#F3E8FF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#9E86B9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  circleInner: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* TEXT */
  successTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 12,
  },
  msg: {
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  strong: {
    fontWeight: '800',
    color: '#9E86B9',
  },

  /* INFO CARD */
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  infoText: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  infoDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 16,
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
  primaryBtnText: {
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
