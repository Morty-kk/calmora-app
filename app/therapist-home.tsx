import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

import { api, Appointment } from "./appointmentsApi";

export default function TherapistHome() {
  const [menuOpen, setMenuOpen] = useState(false);

  const therapistName = "Herr Bellamy";


  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loadingNext, setLoadingNext] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoadingNext(true);
        const data = await api.fetchAppointments();
        setAppointments(data);
      } finally {
        setLoadingNext(false);
      }
    })();
  }, []);

  // ✅ أقرب موعد قادم (حسب التاريخ + الوقت)
  const nextAppointment = useMemo(() => {
    const now = new Date();

    const sorted = [...appointments].sort((a, b) => {
      const da = `${a.date}T${a.time}:00`;
      const db = `${b.date}T${b.time}:00`;
      return da.localeCompare(db);
    });

    return sorted.find((a) => new Date(`${a.date}T${a.time}:00`) >= now) || null;
  }, [appointments]);

  const patientPreview = {
    name: "Alex wirtz",
    info: "22 Jahre · ABA-Therapie",
  };

  const go = (path: string) => {
    setMenuOpen(false);
    router.replace(path as any);
  };

  const openNextInAppointments = () => {
    if (!nextAppointment) {
      router.replace("/therapist-appointments");
      return;
    }
    // ✅ يفتح صفحة Termine وبنفس اليوم تلقائيًا
    router.push(`/therapist-appointments?date=${nextAppointment.date}` as any);
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

      {/* ✅ Next session card */}
      <Pressable style={styles.cardLarge} onPress={openNextInAppointments}>
        <Text style={styles.cardTitle}>
          {loadingNext
            ? "Lade nächste Sitzung..."
            : nextAppointment
            ? `Nächste Sitzung von ${nextAppointment.patient}:`
            : "Keine kommenden Termine"}
        </Text>

        <View style={styles.cardDivider} />

        {nextAppointment ? (
          <View style={styles.cardRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Datum</Text>
              <Text style={styles.value}>{nextAppointment.date}</Text>
            </View>

            <View style={{ flex: 1, alignItems: "flex-end" }}>
              <Text style={styles.label}>Uhrzeit</Text>
              <Text style={styles.value}>{nextAppointment.time}</Text>
            </View>
          </View>
        ) : (
          <Text style={[styles.value, { marginTop: 6 }]}>
            Tippe hier, um Termine zu verwalten
          </Text>
        )}
      </Pressable>

      {/* Patients card */}
      <View style={styles.cardPatients}>
        <View style={styles.patientsHeader}>
          <Text style={styles.cardTitle}>Meine Patienten</Text>

          <Pressable onPress={() => router.push("/therapist-patients")}>
            <Text style={styles.link}>Alle ansehen</Text>
          </Pressable>
        </View>

        <View style={styles.patientRow}>
          <View>
            <Text style={styles.patientName}>{patientPreview.name}</Text>
            <Text style={styles.patientInfo}>{patientPreview.info}</Text>
          </View>

          <View style={styles.avatar} />
        </View>
      </View>

      <View style={{ flex: 1 }} />

      {/* Bottom Tabs */}
      <View style={styles.tabs}>
        <Pressable style={styles.tab} onPress={() => router.replace("/therapist-home")}>
          <Ionicons name="home" size={22} color="#111" />
          <Text style={styles.tabTextActive}>Startseite</Text>
        </Pressable>

        <Pressable style={styles.tab} onPress={() => router.push("/therapist-chat")}>
          <Ionicons name="chatbubbles-outline" size={22} color="#111" />
          <Text style={styles.tabText}>Chat</Text>
        </Pressable>

        <Pressable style={styles.tab} onPress={() => router.push("/therapist-patients")}>
          <Ionicons name="people-outline" size={22} color="#111" />
          <Text style={styles.tabText}>Patienten</Text>
        </Pressable>

        <Pressable style={styles.tab} onPress={() => router.replace("/therapist-profile")}>
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

            <Pressable style={styles.menuItem} onPress={() => go("/therapist-home")}>
              <Text style={styles.menuText}>Home</Text>
            </Pressable>

            <Pressable style={styles.menuItem} onPress={() => go("/therapist-patients")}>
              <Text style={styles.menuText}>Meine Patienten</Text>
            </Pressable>

            <Pressable style={styles.menuItem} onPress={() => go("/therapist-appointments")}>
              <Text style={styles.menuText}>Termine</Text>
            </Pressable>

            <Pressable style={styles.menuItem} onPress={() => go("/therapist-chat")}>
              <Text style={styles.menuText}>Chat</Text>
            </Pressable>

            <Pressable style={styles.menuItem} onPress={() => go("/therapist-profile")}>
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

  cardPatients: {
    backgroundColor: "#D9D9D9",
    borderRadius: 16,
    padding: 14,
  },

  cardTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111",
  },

  cardDivider: {
    height: 1,
    backgroundColor: "#BDBDBD",
    marginVertical: 10,
  },

  cardRow: {
    flexDirection: "row",
  },

  label: {
    fontSize: 14,
    color: "#7A4A4A",
    fontWeight: "600",
  },

  value: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
    marginTop: 2,
  },

  patientsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  link: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
  },

  patientRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  patientName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
  },

  patientInfo: {
    fontSize: 13,
    color: "#555",
    marginTop: 2,
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#9E9E9E",
  },

  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#E0E0E0",
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },

  tab: {
    alignItems: "center",
    width: 78,
    gap: 4,
  },

  tabText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#111",
    opacity: 0.85,
  },

  tabTextActive: {
    fontSize: 12,
    fontWeight: "800",
    color: "#111",
  },

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

  menuTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111",
    marginBottom: 10,
  },

  menuDivider: {
    height: 1,
    backgroundColor: "#111",
    opacity: 0.4,
    marginVertical: 10,
  },

  menuItem: {
    paddingVertical: 8,
  },

  menuText: {
    fontSize: 16,
    color: "#111",
    fontWeight: "600",
  },

  logoutBtn: {
    paddingVertical: 10,
  },

  logoutText: {
    color: "#B00000",
    fontSize: 16,
    fontWeight: "700",
  },
});
