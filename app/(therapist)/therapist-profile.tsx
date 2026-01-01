import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function TherapistProfile() {
  const [name, setName] = useState("Bellamy Nour");
  const [phone, setPhone] = useState("+49 0171 583429");
  const [dob, setDob] = useState("DD MM YYYY");
  const [gender, setGender] = useState("Add Details");

  // Simple edit toggles (wie Stift-Icon)
  const [editPhone, setEditPhone] = useState(false);
  const [editDob, setEditDob] = useState(false);

  // MENU
  const [menuOpen, setMenuOpen] = useState(false);

  const go = (path: string) => {
    setMenuOpen(false);
    router.replace(path as any);
  };

  const onSave = () => {
    // später: speichern via Backend/Context
    setEditPhone(false);
    setEditDob(false);
  };

  return (
    <View style={styles.container}>
      {/* Header brand */}
      <Text style={styles.brand}>Calmora</Text>

      {/* Titel + Menu */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>Profil</Text>

        {/* ✅ بدل router.push("/menu") */}
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

        <Pressable style={styles.cameraBtn} onPress={() => {}}>
          <Ionicons name="camera" size={18} color="#fff" />
        </Pressable>
      </View>

      <View style={styles.dividerThin} />

      {/* Section */}
      <Text style={styles.sectionTitle}>Persönliche Informationen</Text>

      {/* Name (nicht editierbar wie im Mock) */}
      <View style={styles.field}>
        <Text style={styles.label}>Name</Text>
        <Text style={styles.value}>{name}</Text>
      </View>

      {/* Telefon (editierbar) */}
      <View style={styles.field}>
        <View style={styles.fieldTopRow}>
          <Text style={styles.label}>Telefonnummer</Text>
          <Pressable onPress={() => setEditPhone((v) => !v)} hitSlop={10}>
            <Ionicons name="pencil" size={18} color="#6b7280" />
          </Pressable>
        </View>

        {editPhone ? (
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        ) : (
          <Text style={styles.value}>{phone}</Text>
        )}
      </View>

      {/* Geburtsdatum (editierbar) */}
      <View style={styles.field}>
        <View style={styles.fieldTopRow}>
          <Text style={styles.label}>Geburtsdatum</Text>
          <Pressable onPress={() => setEditDob((v) => !v)} hitSlop={10}>
            <Ionicons name="pencil" size={18} color="#6b7280" />
          </Pressable>
        </View>

        {editDob ? (
          <TextInput
            style={styles.input}
            value={dob}
            onChangeText={setDob}
            placeholder="DD MM YYYY"
          />
        ) : (
          <Text style={styles.value}>{dob}</Text>
        )}
      </View>

      {/* Geschlecht */}
      <View style={styles.field}>
        <Text style={styles.label}>Geschlecht</Text>
        <Pressable onPress={() => {}}>
          <Text style={styles.value}>{gender}</Text>
        </Pressable>
      </View>

      {/* Save */}
      <Pressable style={styles.saveBtn} onPress={onSave}>
        <Text style={styles.saveText}>Speichern</Text>
      </Pressable>

      {/* Bottom Tabs (Therapeut) */}
      <View style={styles.tabs}>
        <Pressable
          style={styles.tab}
          onPress={() => router.replace("/therapist-home")}
        >
          <Ionicons name="home-outline" size={22} color="#111" />
          <Text style={styles.tabText}>Startseite</Text>
        </Pressable>

        <Pressable style={styles.tab} onPress={() => router.push("/therapist-chat")}>
          <Ionicons name="chatbubbles-outline" size={22} color="#111" />
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
          style={styles.tabActive}
          onPress={() => router.replace("/therapist-profile")}
        >
          <Ionicons name="person" size={22} color="#111" />
          <Text style={styles.tabTextActive}>Profile</Text>
        </Pressable>
      </View>

      {/* ===================== MENU MODAL (نفس TherapistHome) ===================== */}
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
    paddingHorizontal: 22,
    paddingBottom: 16,
  },

  brand: {
    textAlign: "center",
    fontSize: 30,
    fontWeight: "600",
    color: "#6a4a7d",
    marginBottom: 10,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "#111",
  },

  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 12,
  },

  avatarWrap: {
    alignSelf: "center",
    width: 110,
    height: 110,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
    marginBottom: 14,
  },

  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#E6E6E6",
    justifyContent: "center",
    alignItems: "center",
  },

  cameraBtn: {
    position: "absolute",
    right: 10,
    bottom: 8,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#7b7b8a",
    justifyContent: "center",
    alignItems: "center",
  },

  dividerThin: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginBottom: 14,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
    marginBottom: 10,
  },

  field: {
    backgroundColor: "#BDBDBD",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },

  fieldTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  label: {
    fontSize: 12,
    fontWeight: "700",
    color: "#111",
    opacity: 0.85,
    marginBottom: 6,
  },

  value: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111",
  },

  input: {
    backgroundColor: "#EDEDED",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    fontWeight: "600",
    color: "#111",
  },

  saveBtn: {
    backgroundColor: "#BDBDBD",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 14,
  },

  saveText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111",
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

  tabActive: {
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
