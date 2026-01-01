import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { Appointment, api as apptApi } from "./appointmentsApi";
import { PATIENTS, Patient } from "./patientsApi";

type PatientRow = {
  id: string;
  name: string;
  sub: string;
};

const pad2 = (n: number) => String(n).padStart(2, "0");

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function parseISODateTime(date: string, time: string) {
  // "YYYY-MM-DD" + "HH:MM"
  return new Date(`${date}T${time}:00`);
}

function diffDays(from: Date, to: Date) {
  const a = startOfDay(from).getTime();
  const b = startOfDay(to).getTime();
  return Math.round((b - a) / (1000 * 60 * 60 * 24));
}

function makeSubForPatient(patientName: string, appts: Appointment[], now: Date) {
  const list = appts
    .filter((a) => a.patientId === patientName)
    .sort((a, b) => {
      const da = `${a.date}T${a.time}`;
      const db = `${b.date}T${b.time}`;
      return da.localeCompare(db);
    });

  if (list.length === 0) return "";

  const upcoming = list.find((a) => parseISODateTime(a.date, a.time) >= now);
  if (upcoming) {
    const days = diffDays(now, parseISODateTime(upcoming.date, upcoming.time));
    const dTxt = days === 1 ? "Tag" : "Tagen";
    return `Nächster Termin in ${days} ${dTxt}`;
  }

  const last = list[list.length - 1];
  const daysAgo = Math.abs(diffDays(parseISODateTime(last.date, last.time), now));
  const dTxt = daysAgo === 1 ? "Tag" : "Tagen";
  return `Letzter Termin vor ${daysAgo} ${dTxt}`;
}

export default function TherapistPatients() {
  const [menuOpen, setMenuOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await apptApi.fetchAppointments();
        setAppointments(data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const patients: PatientRow[] = useMemo(() => {
    const now = new Date();

    return PATIENTS.map((p: Patient) => ({
      id: p.id,
      name: p.name,
      sub: makeSubForPatient(p.name, appointments, now),
    }));
  }, [appointments]);

  const go = (path: string) => {
    setMenuOpen(false);
    router.replace(path as any);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.brand}>Calmora</Text>

      <View style={styles.headerRow}>
        <Text style={styles.title}>Patientenliste</Text>

        <Pressable onPress={() => setMenuOpen(true)} hitSlop={10}>
          <Ionicons name="menu" size={26} color="#333" />
        </Pressable>
      </View>

      <View style={styles.divider} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.loadingBox}>
            <Text style={styles.loadingText}>Lade Patienten & Termine...</Text>
          </View>
        ) : (
          patients.map((p) => (
            <Pressable
              key={p.id}
              style={styles.row}
              onPress={() =>
                router.push({
                  pathname: "/patientenakte",
                  params: { id: p.id }, 
                })
              }
            >
              <View style={styles.avatar} />
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{p.name}</Text>
                {!!p.sub && <Text style={styles.sub}>{p.sub}</Text>}
              </View>
            </Pressable>
          ))
        )}

        <View style={{ height: 80 }} />
      </ScrollView>

      <View style={styles.tabs}>
        <Pressable style={styles.tab} onPress={() => router.replace("/therapist-home")}>
          <Ionicons name="home-outline" size={22} color="#111" />
          <Text style={styles.tabText}>Startseite</Text>
        </Pressable>

        <Pressable style={styles.tab} onPress={() => router.push("/therapist-chat")}>
          <Ionicons name="chatbubbles-outline" size={22} color="#111" />
          <Text style={styles.tabText}>Chat</Text>
        </Pressable>

        <Pressable style={styles.tabActive} onPress={() => router.replace("/therapist-patients")}>
          <Ionicons name="people" size={22} color="#111" />
          <Text style={styles.tabTextActive}>Patienten</Text>
        </Pressable>

        <Pressable style={styles.tab} onPress={() => router.replace("/therapist-profile")}>
          <Ionicons name="person-outline" size={22} color="#111" />
          <Text style={styles.tabText}>Profil</Text>
        </Pressable>
      </View>

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
    paddingTop: 58,
    paddingHorizontal: 0,
    paddingBottom: 0,
  },

  brand: {
    textAlign: "center",
    fontSize: 30,
    fontWeight: "600",
    color: "#6a4a7d",
    marginBottom: 8,
  },

  headerRow: {
    paddingHorizontal: 22,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 10,
  },

  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111",
  },

  divider: {
    height: 1,
    backgroundColor: "#CFCFCF",
    marginBottom: 4,
  },

  loadingBox: {
    marginTop: 18,
    marginHorizontal: 22,
    backgroundColor: "#E5E5E5",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
  },
  loadingText: { fontWeight: "800", color: "#111" },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 22,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#CFCFCF",
  },

  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#D9D9D9",
  },

  name: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111",
  },

  sub: {
    marginTop: 6,
    fontSize: 12,
    color: "#111",
    opacity: 0.8,
  },

  tabs: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#BDBDBD",
    paddingVertical: 10,
    paddingHorizontal: 10,
  },

  tab: { alignItems: "center", width: 78, gap: 4 },
  tabActive: { alignItems: "center", width: 78, gap: 4 },

  tabText: { fontSize: 12, fontWeight: "600", color: "#111", opacity: 0.85 },
  tabTextActive: { fontSize: 12, fontWeight: "800", color: "#111" },

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

  menuItem: { paddingVertical: 8 },

  menuText: {
    fontSize: 16,
    color: "#111",
    fontWeight: "600",
  },

  logoutBtn: { paddingVertical: 10 },

  logoutText: {
    color: "#B00000",
    fontSize: 16,
    fontWeight: "700",
  },
});
