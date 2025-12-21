import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function TherapistHome() {
  const [menuOpen, setMenuOpen] = useState(false);

  const therapistName = "Herr Bellamy";
  const nextSession = {
    patient: "Alex",
    date: "Do – 04. März",
    time: "12:30",
  };

  const patientPreview = {
    name: "Alex wirtz",
    info: "22 Jahre · ABA-Therapie",
  };

  const go = (path: string) => {
    setMenuOpen(false);
    router.replace(path as any);
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

      {/* Next session card */}
      <View style={styles.cardLarge}>
        <Text style={styles.cardTitle}>
          Nächste Sitzung von {nextSession.patient}:
        </Text>

        <View style={styles.cardDivider} />

        <View style={styles.cardRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Datum</Text>
            <Text style={styles.value}>{nextSession.date}</Text>
          </View>

          <View style={{ flex: 1, alignItems: "flex-end" }}>
            <Text style={styles.label}>Uhrzeit</Text>
            <Text style={styles.value}>{nextSession.time}</Text>
          </View>
        </View>
      </View>

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

        <Pressable style={styles.tab} onPress={() => router.push("/chat-list")}>
          <Ionicons name="chatbubbles-outline" size={22} color="#111" />
          <Text style={styles.tabText}>Chat</Text>
        </Pressable>

        <Pressable style={styles.tab} onPress={() => router.push("/chat-list")}>
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
        {/* Overlay: click to close */}
        <Pressable style={styles.overlay} onPress={() => setMenuOpen(false)}>
          {/* Drawer: stop propagation */}
          <Pressable style={styles.drawer} onPress={() => {}}>
            <Text style={styles.menuTitle}>Menü:</Text>
            <View style={styles.menuDivider} />

            <Pressable style={styles.menuItem} onPress={() => go("/therapist-home")}>
              <Text style={styles.menuText}>Home</Text>
            </Pressable>

            <Pressable style={styles.menuItem} onPress={() => go("/chat-list")}>
              <Text style={styles.menuText}>Meine Patienten</Text>
            </Pressable>

            <Pressable style={styles.menuItem} onPress={() => go("/therapist-appointments")}>
              <Text style={styles.menuText}>Termine</Text>
            </Pressable>

            <Pressable style={styles.menuItem} onPress={() => go("/chat-list")}>
              <Text style={styles.menuText}>Chat</Text>
            </Pressable>

            <Pressable style={styles.menuItem} onPress={() => go("/chat-list")}>
              <Text style={styles.menuText}>Patientliste</Text>
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

  /* MENU MODAL */
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
