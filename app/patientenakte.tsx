import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

type PatientData = {
  name: string;
  gender: string;
  age: string;
  dob: string;
  email: string;
  phone: string;
  registered: string;
};

export default function Patientenakte() {
  const [menuOpen, setMenuOpen] = useState(false);
  const params = useLocalSearchParams<{ name?: string }>();

  const name = params.name ?? "Karl Heinz";

  const patient: PatientData = useMemo(() => {
    const safe = name.replace(/\s+/g, ".").toLowerCase();
    return {
      name,
      gender: "Männlich",
      age: "28 Jahre alt",
      dob: "DD MM YYYY",
      email: `${safe}@gmail.com`,
      phone: "+49 0171 583429",
      registered: "Registriert seit dem 27.07.2024",
    };
  }, [name]);

  const go = (path: string) => {
    setMenuOpen(false);
    router.replace(path as any);
  };

  return (
    <View style={styles.container}>
      {/* ===== SCROLLABLE CONTENT ===== */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.brand}>Calmora</Text>

        {/* Header */}
        <View style={styles.headerRow}>
          <Text style={styles.title}>Patientenakte</Text>

          <Pressable onPress={() => setMenuOpen(true)} hitSlop={10}>
            <Ionicons name="menu" size={26} color="#333" />
          </Pressable>
        </View>

        <View style={styles.divider} />

        {/* Avatar */}
        <View style={styles.avatarWrap}>
          <View style={styles.avatar}>
            <Ionicons name="image-outline" size={44} color="#bdbdbd" />
          </View>
        </View>

        {/* Name */}
        <Text style={styles.patientName}>{patient.name}</Text>

        {/* Section */}
        <Text style={styles.sectionTitle}>Persönliche Informationen</Text>

        {/* Fields */}
        <View style={styles.field}>
          <Text style={styles.label}>Geschlecht</Text>
          <Text style={styles.value}>{patient.gender}</Text>
        </View>

        <View style={styles.fieldRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Alter</Text>
            <Text style={styles.value}>{patient.age}</Text>
          </View>
          <Ionicons
            name="pencil"
            size={18}
            color="#111"
            style={{ opacity: 0.7 }}
          />
        </View>

        <View style={styles.fieldRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Geburtsdatum</Text>
            <Text style={styles.value}>{patient.dob}</Text>
          </View>
          <Ionicons
            name="pencil"
            size={18}
            color="#111"
            style={{ opacity: 0.7 }}
          />
        </View>

        <View style={styles.fieldRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>E-Mail</Text>
            <Text style={styles.value}>{patient.email}</Text>
          </View>
          <Ionicons
            name="pencil"
            size={18}
            color="#111"
            style={{ opacity: 0.7 }}
          />
        </View>

        <View style={styles.fieldRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Telefonnummer</Text>
            <Text style={styles.value}>{patient.phone}</Text>
          </View>
          <Ionicons
            name="pencil"
            size={18}
            color="#111"
            style={{ opacity: 0.7 }}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.value}>{patient.registered}</Text>
        </View>

        {/* Button */}
        <Pressable
  style={styles.bigBtn}
  onPress={() =>
    router.push({
      pathname: "/therapist-chat",
      params: { name: patient.name },
    })
  }
>
  <Text style={styles.bigBtnText}>Chat öffnen</Text>
</Pressable>

      </ScrollView>

      {/* ===== BOTTOM TABS (FIXED) ===== */}
      <View style={styles.tabs}>
        <Pressable
          style={styles.tab}
          onPress={() => router.replace("/therapist-home")}
        >
          <Ionicons name="home-outline" size={22} color="#111" />
          <Text style={styles.tabText}>Startseite</Text>
        </Pressable>

        <Pressable style={styles.tab} onPress={() => router.push("/chat-list")}>
          <Ionicons name="chatbubbles-outline" size={22} color="#111" />
          <Text style={styles.tabText}>Chat</Text>
        </Pressable>

        <Pressable
          style={styles.tabActive}
          onPress={() => router.replace("/therapist-patients")}
        >
          <Ionicons name="people" size={22} color="#111" />
          <Text style={styles.tabTextActive}>Patienten</Text>
        </Pressable>

        <Pressable
          style={styles.tab}
          onPress={() => router.replace("/therapist-profile")}
        >
          <Ionicons name="person-outline" size={22} color="#111" />
          <Text style={styles.tabText}>Profil</Text>
        </Pressable>
      </View>

      {/* ===== MENU DRAWER ===== */}
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
    paddingHorizontal: 22,
    paddingBottom: 0,
  },

  // ✅ WICHTIG: Platz unten für Tabs
  scrollContent: {
    paddingBottom: 120,
  },

  brand: {
    textAlign: "center",
    fontSize: 30,
    fontWeight: "600",
    color: "#6a4a7d",
    marginBottom: 8,
  },

  headerRow: {
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
    marginBottom: 12,
  },

  avatarWrap: {
    alignItems: "center",
    marginTop: 4,
    marginBottom: 6,
  },

  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#E6E6E6",
    justifyContent: "center",
    alignItems: "center",
  },

  patientName: {
    textAlign: "center",
    fontSize: 22,
    fontWeight: "700",
    color: "#111",
    marginBottom: 6,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111",
    marginBottom: 10,
  },

  field: {
    backgroundColor: "#BDBDBD",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },

  fieldRow: {
    backgroundColor: "#BDBDBD",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  label: {
    fontSize: 12,
    fontWeight: "800",
    color: "#111",
    opacity: 0.85,
    marginBottom: 6,
  },

  value: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111",
  },

  bigBtn: {
    backgroundColor: "#BDBDBD",
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: "center",
    marginTop: 18,
  },

  bigBtnText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111",
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

  menuTitle: { fontSize: 22, fontWeight: "800", color: "#111", marginBottom: 10 },

  menuDivider: {
    height: 1,
    backgroundColor: "#111",
    opacity: 0.4,
    marginVertical: 10,
  },

  menuItem: { paddingVertical: 8 },

  menuText: { fontSize: 16, color: "#111", fontWeight: "600" },

  logoutBtn: { paddingVertical: 10 },

  logoutText: { color: "#B00000", fontSize: 16, fontWeight: "700" },
});
