import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import BottomTabs from '../components/BottomTabs';

function Tile({ title, icon, onPress }: { title: string; icon: React.ReactNode; onPress?: () => void }) {
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
  const [menuOpen, setMenuOpen] = useState(false);
  const [userName, setUserName] = useState("...");

  // 🔥 الموعد القادم
  const [appointment, setAppointment] = useState<{
    date: string;
    time: string;
    name?: string;
  } | null>(null);

  // 📌 جلب اسم المستخدم + الموعد من AsyncStorage
  useEffect(() => {
    const loadData = async () => {
      try {
        // جلب المستخدم
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          const user = JSON.parse(storedUser);
          setUserName(user.name || "Gast");
        }

        // جلب الموعد
        const storedAppointment = await AsyncStorage.getItem("nextAppointment");
        if (storedAppointment) {
          setAppointment(JSON.parse(storedAppointment));
        }
      } catch (e) {
        console.log("Fehler beim Laden:", e);
      }
    };

    loadData();
  }, []);

  // 🔥 Logout
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("user");
      await AsyncStorage.removeItem("nextAppointment");

      setMenuOpen(false);

      router.replace("/login-patient");
    } catch (e) {
      console.log("Logout Fehler:", e);
    }
  };

  return (
    <ImageBackground
      source={require('../assets/bg.png')}
      style={styles.bg}
      resizeMode="cover"
    >
      <View style={styles.wrap}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.brand}>Calmora</Text>

          <Pressable onPress={() => setMenuOpen(true)}>
            <Ionicons name="menu" size={22} color="#2B2B2B" />
          </Pressable>
        </View>

        {/* Greeting */}
        <Text style={styles.greeting}>
          Hey {userName}, wie schön,{'\n'}
          dass du da bist
        </Text>

        <View style={styles.divider} />

        {/* Reminder */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Remind:</Text>

          {appointment ? (
            <Text style={styles.cardText}>
              Die nächste Sitzung:{' '}
              <Text style={styles.cardStrong}>
                {appointment.date}, {appointment.time}
              </Text>
              {appointment.name ? ` (mit ${appointment.name})` : ""}
            </Text>
          ) : (
            <Text style={styles.cardText}>Kein Termin geplant</Text>
          )}
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
            onPress={() => router.push('/achtsamkeit')}
          />

          <Tile
            title={'Progressive\nMuskelentspannung'}
            icon={<MaterialCommunityIcons name="human-male-board" size={28} color="#2B2B2B" />}
            onPress={() => router.push('/pme')}
          />

          <Tile
            title="Meditation"
            icon={<Ionicons name="flower-outline" size={28} color="#2B2B2B" />}
            onPress={() => router.push('/meditation')}
          />
        </View>

        {/* Termin CTA */}
        <Pressable style={styles.apptBtn} onPress={() => router.push('/appointment')}>
          <Text style={styles.apptBtnText}>Neuen Termin vereinbaren</Text>
        </Pressable>

        {/* DON’T PANIC */}
        <Pressable style={styles.panic} onPress={() => router.push('/panic')}>
          <Ionicons name="megaphone" size={22} color="#1f2937" />
          <Text style={styles.panicText}>
            DON’T{'\n'}PANIC
          </Text>
        </Pressable>

        <View style={{ flex: 1 }} />

        <BottomTabs />
      </View>

      {/* MENU OVERLAY */}
      {menuOpen && (
        <View style={styles.menuOverlay}>
          <Pressable style={styles.backdrop} onPress={() => setMenuOpen(false)} />

          <View style={styles.menuCard}>
            <Text style={styles.menuTitle}>Menü:</Text>
            <View style={styles.menuDivider} />

            <Pressable style={styles.menuItem} onPress={() => setMenuOpen(false)}>
              <Text style={styles.menuText}>Home</Text>
            </Pressable>

            <Pressable style={styles.menuItem}>
              <Text style={styles.menuText}>Meine Therapie</Text>
            </Pressable>

            <View style={{ marginLeft: 16 }}>
              <Pressable style={styles.menuItem}>
                <Text style={styles.subMenuText}>Sitzungen</Text>
              </Pressable>

              <Pressable style={styles.menuItem} onPress={() => router.push('/appointment')}>
                <Text style={styles.subMenuText}>Termine</Text>
              </Pressable>

              <Pressable
                style={styles.menuItem}
                onPress={() => {
                  setMenuOpen(false);
                  router.push('/chat');
                }}
              >
                <Text style={styles.subMenuText}>Chat</Text>
              </Pressable>
            </View>

            <Pressable style={styles.menuItem} onPress={() => router.push('/profile')}>
              <Text style={styles.menuText}>Mein Profil</Text>
            </Pressable>

            <Pressable style={styles.menuItem} onPress={() => router.push('/mindfulness')}>
              <Text style={styles.menuText}>Übungen</Text>
            </Pressable>

            <Pressable style={styles.menuItem} onPress={() => router.push('/diary')}>
              <Text style={styles.menuText}>Tagebuch</Text>
            </Pressable>

            <View style={styles.menuDivider} />

            {/* LOGOUT */}
            <Pressable style={styles.menuItem} onPress={handleLogout}>
              <Text style={styles.logoutText}>abmelden</Text>
            </Pressable>
          </View>
        </View>
      )}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  wrap: { flex: 1, padding: 16, paddingBottom: 120 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brand: { fontSize: 20, fontWeight: '700', opacity: 0.85, color: '#2B2B2B' },

  greeting: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3b4b7a',
    marginTop: 8,
  },

  divider: { height: 1, backgroundColor: '#00000022', marginVertical: 12 },

  card: {
    backgroundColor: '#ffffffcc',
    borderRadius: 14,
    padding: 14,
    gap: 6,
  },
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
  panicText: {
    fontSize: 18,
    fontWeight: '900',
    lineHeight: 20,
    color: '#1f2937',
  },

  menuOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#00000040',
  },
  menuCard: {
    position: 'absolute',
    right: 20,
    top: 80,
    bottom: 80,
    width: '70%',
    backgroundColor: '#FADDC8',
    borderRadius: 32,
    padding: 22,
  },

  menuTitle: { fontSize: 20, fontWeight: '700', marginBottom: 8 },
  menuDivider: { height: 1, backgroundColor: '#00000040', marginVertical: 10 },

  menuItem: { paddingVertical: 6 },

  menuText: { fontSize: 16, color: '#111827' },
  subMenuText: { fontSize: 14, color: '#475569' },

  logoutText: { fontSize: 16, color: '#B91C1C', fontWeight: '700' },
});


