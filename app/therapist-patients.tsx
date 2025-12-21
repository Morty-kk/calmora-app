import React, { useMemo, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

type Patient = {
  id: string;
  name: string;
  sub: string;
};

export default function TherapistPatients() {
  const [menuOpen, setMenuOpen] = useState(false);

  const patients: Patient[] = useMemo(
    () => [
      { id: "1", name: "Karl Heinz", sub: "Letztes Termin vor 10 tagen" },
      { id: "2", name: "Jürgen Hoffner", sub: "Nächstes Termin in 15 tagen" },
      { id: "3", name: "Lukas Schneider", sub: "Letztes Termin 5 Tagen" },
      { id: "4", name: "Lea Wagner", sub: "Nächstes von 5 Tagen" },
      { id: "5", name: "Johanna Fischer", sub: "Letztes Termin vor 55 Tagen" },
      { id: "6", name: "Thomas Müller", sub: "Nächstes Termin in 10" },
      { id: "7", name: "Nico Stein", sub: "" },
    ],
    []
  );

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
        <Text style={styles.title}>Patientenliste</Text>

        <Pressable onPress={() => setMenuOpen(true)} hitSlop={10}>
          <Ionicons name="menu" size={26} color="#333" />
        </Pressable>
      </View>

      <View style={styles.divider} />

      {/* List */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {patients.map((p) => (
          <Pressable
            key={p.id}
            style={styles.row}
            onPress={() => router.push({ pathname: "/patientenakte", params: { name: p.name } })}
          >
            <View style={styles.avatar} />
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{p.name}</Text>
              {!!p.sub && <Text style={styles.sub}>{p.sub}</Text>}
            </View>
          </Pressable>
        ))}
        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Bottom Tabs */}
      <View style={styles.tabs}>
        <Pressable style={styles.tab} onPress={() => router.replace("/therapist-home")}>
          <Ionicons name="home-outline" size={22} color="#111" />
          <Text style={styles.tabText}>Startseite</Text>
        </Pressable>

        <Pressable style={styles.tab} onPress={() => router.push("/chat-list")}>
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

      {/* Menu Drawer (wie auf Home) */}
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

            <Pressable style={styles.menuItem} onPress={() => go("/appointment")}>
              <Text style={styles.menuText}>Termine</Text>
            </Pressable>

            <Pressable style={styles.menuItem} onPress={() => go("/chat-list")}>
              <Text style={styles.menuText}>Chat</Text>
            </Pressable>

            <Pressable style={styles.menuItem} onPress={() => go("/therapist-patients")}>
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

  /* MENU */
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
