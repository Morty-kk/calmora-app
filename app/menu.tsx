import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";

import {
  ImageBackground,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import BottomTabs from "../components/BottomTabs";
import CustomDrawer from "../components/Customrawer";
import { BACKEND_URL } from "../constants/backend";
import { useNotify } from "../context/NotifyContext";

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
    <TouchableOpacity onPress={onPress} style={styles.tile} activeOpacity={0.7}>
      <View style={{ alignItems: "center", gap: 6 }}>
        {icon}
        <Text style={styles.tileTitle}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
}

type NextAppointment = {
  date: string;
  time: string;
  name?: string;
};

export default function Menu() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userName, setUserName] = useState("...");

  const { unreadChats } = useNotify();

  // ✅ الموعد القادم (من الباك-إند)
  const [appointment, setAppointment] = useState<NextAppointment | null>(null);

  // ✅ جلب اسم المستخدم + جلب أقرب موعد من Backend
  useEffect(() => {
    const loadData = async () => {
      try {
        // ---- user name ----
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          const user = JSON.parse(storedUser);
          setUserName(user.name || "Gast");
        } else {
          setUserName("Gast");
        }

        // ---- token ----
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          setAppointment(null);
          return;
        }

        // ---- fetch appointments ----
        const res = await fetch(`${BACKEND_URL}/appointments/mine`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) {
          console.log("appointments/mine error:", data);
          setAppointment(null);
          return;
        }

        const items = data.items ?? [];
        const now = new Date();

        // خذ أقرب موعد قادم
        const upcoming = items
          .map((a: any) => ({
            ...a,
            _d: new Date(a.startsAt),
          }))
          .filter((a: any) => a._d.getTime() > now.getTime())
          .sort((a: any, b: any) => a._d.getTime() - b._d.getTime())[0];

        if (!upcoming) {
          setAppointment(null);
          return;
        }

        const d = new Date(upcoming.startsAt);
        const date = d.toLocaleDateString("de-DE");
        const time = d.toLocaleTimeString("de-DE", {
          hour: "2-digit",
          minute: "2-digit",
        });

        // إذا الباك-إند بيرجع therapist/email
        const therapistName =
          upcoming?.therapist?.name ||
          upcoming?.therapist?.email ||
          upcoming?.therapistEmail ||
          undefined;

        setAppointment({
          date,
          time,
          name: therapistName,
        });
      } catch (e) {
        console.log("Fehler beim Laden:", e);
        setAppointment(null);
      }
    };

    loadData();
  }, []);

  // 🔥 Logout
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("user");
      await AsyncStorage.removeItem("token");

      setMenuOpen(false);
      setAppointment(null);

      router.replace("/login-patient");
    } catch (e) {
      console.log("Logout Fehler:", e);
    }
  };

  return (
    <ImageBackground
      source={require("../assets/bg.png")}
      style={styles.bg}
      resizeMode="cover"
    >
      <ScrollView style={styles.wrap} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.brand}>Calmora</Text>

          <TouchableOpacity onPress={() => setMenuOpen(true)} activeOpacity={0.7}>
            <Ionicons name="menu" size={24} color="#2B2B2B" />
          </TouchableOpacity>
        </View>

        {/* Hero Section */}
        <View style={styles.hero}>
          <View style={styles.heroIconContainer}>
            <Ionicons name="home" size={36} color="#9E86B9" />
          </View>
          <Text style={styles.heroTitle}>
            Hey {userName},{"\n"}wie schön, dass du da bist
          </Text>
        </View>

        {/* Reminder Card */}
        {appointment && (
          <View style={styles.reminderCard}>
            <View style={styles.reminderHeader}>
              <Ionicons name="calendar" size={20} color="#9E86B9" />
              <Text style={styles.reminderLabel}>Nächster Termin</Text>
            </View>
            <View style={styles.reminderContent}>
              <View style={styles.reminderRow}>
                <Ionicons name="time-outline" size={18} color="#666" />
                <Text style={styles.reminderText}>
                  {appointment.date} um {appointment.time}
                </Text>
              </View>
              {appointment.name && (
                <View style={styles.reminderRow}>
                  <Ionicons name="person-outline" size={18} color="#666" />
                  <Text style={styles.reminderText}>{appointment.name}</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {!appointment && (
          <View style={styles.noAppointmentCard}>
            <Ionicons name="calendar-outline" size={24} color="#999" />
            <Text style={styles.noAppointmentText}>Kein Termin geplant</Text>
          </View>
        )}

        {/* Übungen */}
        <Text style={styles.sectionTitle}>Übungen</Text>
        <View style={styles.grid}>
          <Tile
            title="Atmung"
            icon={<Ionicons name="leaf" size={32} color="#9E86B9" />}
            onPress={() => router.push("/breath")}
          />

          <Tile
            title="Achtsamkeit"
            icon={
              <MaterialCommunityIcons
                name="meditation"
                size={32}
                color="#9E86B9"
              />
            }
            onPress={() => router.push("/achtsamkeit")}
          />

          <Tile
            title={"Progressive\nMuskelentspannung"}
            icon={
              <MaterialCommunityIcons
                name="human-male-board"
                size={32}
                color="#9E86B9"
              />
            }
            onPress={() => router.push("/pme")}
          />

          <Tile
            title="Meditation"
            icon={<Ionicons name="flower" size={32} color="#9E86B9" />}
            onPress={() => router.push("/meditation")}
          />
        </View>

        {/* Termin CTA */}
        <TouchableOpacity
          style={styles.apptBtn}
          onPress={() => router.push("/appointment")}
          activeOpacity={0.7}
        >
          <Ionicons name="add-circle" size={20} color="#fff" />
          <Text style={styles.apptBtnText}>Neuen Termin vereinbaren</Text>
        </TouchableOpacity>

        {/* DON'T PANIC */}
        <TouchableOpacity 
          style={styles.panic} 
          onPress={() => router.push("/panic")}
          activeOpacity={0.7}
        >
          <Ionicons name="heart" size={28} color="#fff" />
          <Text style={styles.panicText}>
            DON'T PANIC{"\n"}Atemübung starten
          </Text>
        </TouchableOpacity>

        <View style={{ height: 120 }} />
      </ScrollView>

      <BottomTabs />

      {/* MENU OVERLAY */}
      {menuOpen && (
        <Modal
          visible={menuOpen}
          transparent
          animationType="fade"
          onRequestClose={() => setMenuOpen(false)}
        >
          <View style={styles.drawerContainer}>
            <Pressable
              style={styles.drawerOverlay}
              onPress={() => setMenuOpen(false)}
            />
            <View style={styles.drawerContent}>
              <CustomDrawer
                navigation={{
                  navigate: (route: string) => {
                    router.push(route as any);
                    setMenuOpen(false);
                  },
                }}
                onLogout={() => {
                  setMenuOpen(false);
                  handleLogout();
                }}
              />
            </View>
          </View>
        </Modal>
      )}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  wrap: { flex: 1, padding: 16 },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 8,
  },
  brand: { fontSize: 22, fontWeight: "700", color: "#2B2B2B" },

  hero: {
    alignItems: "center",
    paddingVertical: 24,
    gap: 12,
  },
  heroIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#F3E8FF",
    alignItems: "center",
    justifyContent: "center",
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2B2B2B",
    textAlign: "center",
    lineHeight: 28,
  },

  reminderCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reminderHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  reminderLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2B2B2B",
  },
  reminderContent: {
    gap: 8,
  },
  reminderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  reminderText: {
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
  },

  noAppointmentCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    gap: 8,
    marginBottom: 20,
  },
  noAppointmentText: {
    fontSize: 15,
    color: "#999",
    fontWeight: "500",
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2B2B2B",
    marginBottom: 12,
  },

  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 20 },

  tile: {
    width: "47%",
    backgroundColor: "#fff",
    paddingVertical: 24,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  tileTitle: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    color: "#2B2B2B",
  },

  apptBtn: {
    backgroundColor: "#9E86B9",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  apptBtnText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },

  panic: {
    backgroundColor: "#EF4444",
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    marginTop: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  panicText: {
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 20,
    color: "#fff",
    textAlign: "center",
  },

  /* DRAWER */
  drawerContainer: {
    flex: 1,
    flexDirection: "row",
  },
  drawerOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  drawerContent: {
    width: 280,
    height: "100%",
  },
});
