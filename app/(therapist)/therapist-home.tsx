import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

import { BACKEND_URL } from "../../constants/backend"; // ✅ تأكد من المسار عندك
import { useNotify } from "../../context/NotifyContext";

type BackendAppointment = {
  id: number | string;
  startsAt: string; // ISO date from backend
  note?: string | null;
  patient?: { id: number | string; name?: string | null; email?: string | null };
};

export default function TherapistHome() {
  const [menuOpen, setMenuOpen] = useState(false);

  const therapistName = "Herr Bellamy";
  const { unreadChats, setUnreadChats } = useNotify();

  const [appointments, setAppointments] = useState<BackendAppointment[]>([]);
  const [loadingNext, setLoadingNext] = useState(true);

  // ✅ تحميل مواعيد الطبيب من الباك-إند كل مرة الصفحة تنفتح
  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        try {
          setLoadingNext(true);

          const token = await AsyncStorage.getItem("token");
          if (!token) {
            setAppointments([]);
            return;
          }

          const res = await fetch(`${BACKEND_URL}/appointments/therapist`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          const data = await res.json();
          if (!res.ok) {
            console.log("appointments/therapist error:", data);
            setAppointments([]);
            return;
          }

          setAppointments(data.items ?? []);
        } catch (e) {
          console.log("TherapistHome load error:", e);
          setAppointments([]);
        } finally {
          setLoadingNext(false);
        }
      };

      load();
    }, [])
  );

  // ✅ أقرب موعد قادم
  const nextAppointment = useMemo(() => {
    const now = new Date();

    const upcoming = [...appointments]
      .map((a) => ({ ...a, d: new Date(a.startsAt) }))
      .filter((a) => a.d.getTime() >= now.getTime())
      .sort((a, b) => a.d.getTime() - b.d.getTime())[0];

    return upcoming ?? null;
  }, [appointments]);

  const nextPatientName = useMemo(() => {
    if (!nextAppointment) return "";
    return (
      nextAppointment?.patient?.name ||
      nextAppointment?.patient?.email ||
      "Patient"
    );
  }, [nextAppointment]);

  const nextDate = useMemo(() => {
    if (!nextAppointment) return null;
    // نفس شكل الصورة: 2026-02-05
    return new Date(nextAppointment.startsAt).toISOString().slice(0, 10);
  }, [nextAppointment]);

  const nextTime = useMemo(() => {
    if (!nextAppointment) return null;
    return new Date(nextAppointment.startsAt).toLocaleTimeString("de-DE", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }, [nextAppointment]);

  const go = (path: string) => {
    setMenuOpen(false);
    router.replace(path as any);
  };

  // ✅ لما يكبس على كرت الموعد → يروح لصفحة therapist-appointments مع التاريخ
  const openNextInAppointments = () => {
    if (!nextDate) {
      router.replace("/therapist-appointments");
      return;
    }
    router.push(`/therapist-appointments?date=${nextDate}` as any);
  };

  const openChatList = () => {
    setUnreadChats(0);
    router.push("/therapist-chatlist");
  };

  return (
    <View style={styles.container}>
      {/* Brand */}
      <Text style={styles.brand}>Calmora</Text>

      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.greeting}>Hallo {therapistName}!</Text>

        <Pressable onPress={() => setMenuOpen(true)} hitSlop={10}>
          <Ionicons name="menu" size={26} color="#333" />
        </Pressable>
      </View>

      <View style={styles.divider} />

      {/*  Next session card */}
      <Pressable style={styles.cardLarge} onPress={openNextInAppointments}>
        <Text style={styles.cardTitle}>
          {loadingNext
            ? "Lade nächste Sitzung..."
            : nextAppointment
            ? `Nächste Sitzung von ${nextPatientName}:`
            : "Keine kommenden Termine"}
        </Text>

        <View style={styles.cardDivider} />

        {nextAppointment ? (
          <View style={styles.cardRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Datum</Text>
              <Text style={styles.value}>{nextDate}</Text>
            </View>

            <View style={{ flex: 1, alignItems: "flex-end" }}>
              <Text style={styles.label}>Uhrzeit</Text>
              <Text style={styles.value}>{nextTime}</Text>
            </View>
          </View>
        ) : (
          <Text style={[styles.value, { marginTop: 6 }]}>
            Tippe hier, um Termine zu verwalten
          </Text>
        )}
      </Pressable>

      {/* Schnellzugriff */}
      <View style={styles.cardQuick}>
        <Text style={styles.cardTitle}>Schnellzugriff</Text>

        <View style={styles.quickRow}>
          <Pressable
            style={styles.quickBtn}
            onPress={() => router.push("/therapist-appointments")}
          >
            <Ionicons name="calendar-outline" size={22} color="#111" />
            <Text style={styles.quickText}>Termin erstellen</Text>
          </Pressable>

          <Pressable
            style={styles.quickBtn}
            onPress={() => router.push("/sitzungverlauf")}
          >
            <Ionicons name="document-text-outline" size={22} color="#111" />
            <Text style={styles.quickText}>Sitzungsverlauf</Text>
          </Pressable>

          <Pressable
            style={styles.quickBtn}
            onPress={() => router.push("/therapist-patients")}
          >
            <Ionicons name="people-outline" size={22} color="#111" />
            <Text style={styles.quickText}>Patientenliste</Text>
          </Pressable>
        </View>
      </View>

      {/* Bottom Tabs */}
      <View style={styles.tabs}>
        <Pressable
          style={styles.tab}
          onPress={() => router.replace("/therapist-home")}
        >
          <Ionicons name="home" size={22} color="#111" />
          <Text style={styles.tabTextActive}>Startseite</Text>
        </Pressable>

        <Pressable style={styles.tab} onPress={openChatList}>
          <View style={styles.iconWrap}>
            <Ionicons name="chatbubbles-outline" size={22} color="#111" />
            {unreadChats > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {unreadChats > 99 ? "99+" : String(unreadChats)}
                </Text>
              </View>
            )}
          </View>
          <Text style={styles.tabText}>Chat</Text>
        </Pressable>

        <Pressable
          style={styles.tab}
          onPress={() => router.push("/therapist-patients")}
        >
          <Ionicons name="people-outline" size={22} color="#111" />
          <Text style={styles.tabText}>Patienten</Text>
        </Pressable>

        <Pressable
          style={styles.tab}
          onPress={() => router.replace("/therapist-profile")}
        >
          <Ionicons name="person-outline" size={22} color="#111" />
          <Text style={styles.tabText}>Profil</Text>
        </Pressable>
      </View>

      {/* ===================== MENU MODAL ===================== */}
      <Modal transparent visible={menuOpen} animationType="fade">
        <Pressable style={styles.overlay} onPress={() => setMenuOpen(false)}>
          <Pressable style={styles.drawer} onPress={() => {}}>
            <Text style={styles.menuTitle}>Menü:</Text>
            <View style={styles.menuDivider} />

            <Pressable
              style={styles.menuItem}
              onPress={() => go("/therapist-home")}
            >
              <Text style={styles.menuText}>Home</Text>
            </Pressable>

            <Pressable
              style={styles.menuItem}
              onPress={() => go("/therapist-patients")}
            >
              <Text style={styles.menuText}>Meine Patienten</Text>
            </Pressable>

            <Pressable
              style={styles.menuItem}
              onPress={() => go("/therapist-appointments")}
            >
              <Text style={styles.menuText}>Termine</Text>
            </Pressable>

            <Pressable
              style={styles.menuItem}
              onPress={() => {
                setMenuOpen(false);
                setUnreadChats(0);
                router.push("/therapist-chatlist");
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <Text style={styles.menuText}>Chat</Text>
                {unreadChats > 0 && (
                  <View style={styles.menuBadge}>
                    <Text style={styles.menuBadgeText}>
                      {unreadChats > 99 ? "99+" : String(unreadChats)}
                    </Text>
                  </View>
                )}
              </View>
            </Pressable>

            <Pressable
              style={styles.menuItem}
              onPress={() => go("/therapist-profile")}
            >
              <Text style={styles.menuText}>Mein Profil</Text>
            </Pressable>

            <View style={styles.menuDivider} />

            <Pressable
              style={styles.logoutBtn}
              onPress={() => {
                setMenuOpen(false);
                router.replace("/login-therapeut");
              }}
            >
              <Text style={styles.logoutText}>abmelden</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 60,
    paddingHorizontal: 22,
    paddingBottom: 18,
  },

  brand: {
    textAlign: "center",
    fontSize: 30,
    fontWeight: "600",
    marginBottom: 12,
    color: "#6a4a7d",
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  greeting: {
    fontSize: 26,
    fontWeight: "600",
    color: "#111",
  },

  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 16,
  },

  cardLarge: {
    backgroundColor: "#E5E5E5",
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
  },

  cardDivider: {
    height: 1,
    backgroundColor: "#BDBDBD",
    marginVertical: 10,
  },

  cardRow: { flexDirection: "row" },

  label: { fontSize: 14, color: "#7A4A4A", fontWeight: "600" },

  value: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
    marginTop: 2,
  },

  cardQuick: {
    backgroundColor: "#D9D9D9",
    borderRadius: 16,
    padding: 14,
    marginTop: 6,
  },

  quickRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },

  quickBtn: {
    flex: 1,
    backgroundColor: "#ECECEC",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    marginHorizontal: 4,
    gap: 6,
  },

  quickText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#111",
    textAlign: "center",
  },

  cardTitle: { fontSize: 17, fontWeight: "700", color: "#111" },

  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#E0E0E0",
    paddingVertical: 10,
    paddingHorizontal: 10,
    position: "absolute",
    bottom: 12,
    left: 12,
    right: 12,
    borderRadius: 16,
  },

  tab: { alignItems: "center", width: 78, gap: 4 },

  tabText: { fontSize: 12, fontWeight: "600", color: "#111", opacity: 0.85 },
  tabTextActive: { fontSize: 12, fontWeight: "800", color: "#111" },

  iconWrap: {
    position: "relative",
    width: 28,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    right: -8,
    top: -6,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#DC2626",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  badgeText: { color: "white", fontSize: 10, fontWeight: "800" },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
  },

  drawer: {
    width: "78%",
    height: "100%",
    backgroundColor: "#BDBDBD",
    paddingTop: 70,
    paddingHorizontal: 26,
  },

  menuTitle: { fontSize: 22, fontWeight: "800", color: "#111", marginBottom: 10 },

  menuDivider: {
    height: 1,
    backgroundColor: "#111",
    opacity: 0.4,
    marginVertical: 10,
  },

  menuItem: { paddingVertical: 8 },

  menuText: { fontSize: 16, color: "#111", fontWeight: "600" },

  menuBadge: {
    minWidth: 22,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#DC2626",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  menuBadgeText: { color: "white", fontSize: 10, fontWeight: "800" },

  logoutBtn: { paddingVertical: 10 },

  logoutText: { color: "#B00000", fontSize: 16, fontWeight: "700" },
});
