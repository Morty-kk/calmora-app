import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";


import { Msg, getChat, setChat } from "./chatStore";
import { PATIENTS, Patient } from "./patientsApi";



const seedByPatient: Record<string, Msg[]> = {
  p1: [
    { id: "1", from: "patient", text: "Hallo Herr Bellamy, ich fühle mich in letzter Zeit sehr gestresst.", time: "10:13" },
    { id: "2", from: "therapist", text: "Danke. Was belastet dich im Moment am meisten?", time: "10:14" },
  ],
  p3: [
    { id: "3", from: "patient", text: "Kann ich die Übung von gestern wiederholen?", time: "Gestern" },
  ],
};

export default function TherapistChatList() {
  const [q, setQ] = useState("");


  // New chat modal
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerSearch, setPickerSearch] = useState("");

  
  useEffect(() => {
    
    for (const [pid, msgs] of Object.entries(seedByPatient)) {
      const existing = getChat(pid);
      if (!existing || existing.length === 0) {
        setChat(pid, msgs);
      }
    }
  }, []);

  const openChat = (patient: Patient) => {
    setPickerOpen(false);
    setPickerSearch("");

    router.push({
      pathname: "/therapist-chat",
      params: { patientId: patient.id, name: patient.name },
    });
  };


  const activePatients = useMemo(() => {
    const withChats = PATIENTS.filter((p) => getChat(p.id).length > 0);

    const t = q.trim().toLowerCase();
    if (!t) return withChats;

    return withChats.filter((p) => p.name.toLowerCase().includes(t));
  }, [q]);

  
  const pickerPatients = useMemo(() => {
    const t = pickerSearch.trim().toLowerCase();
    if (!t) return PATIENTS;
    return PATIENTS.filter((p) => p.name.toLowerCase().includes(t));
  }, [pickerSearch]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Chat</Text>
        </View>

        {/* New Chat */}
        <Pressable onPress={() => setPickerOpen(true)} hitSlop={10} style={styles.iconBtn}>
          <Ionicons name="create-outline" size={20} color="#111" />
        </Pressable>
      </View>

    
      <View style={styles.searchRow}>
        <Ionicons name="search" size={18} color="#111" />
        <TextInput
          style={styles.searchInput}
          placeholder="Chat suchen..."
          value={q}
          onChangeText={setQ}
        />
      </View>

      {/* Chat List */}
      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {activePatients.map((p) => {
          const msgs = getChat(p.id);
          const last = msgs[msgs.length - 1]; // 

        
          const unreadCount = 0;

          return (
            <Pressable key={p.id} onPress={() => openChat(p)} style={styles.item}>
              <View style={styles.avatar} />

              <View style={styles.mid}>
                <View style={styles.topRow}>
                  <Text style={styles.name}>{p.name}</Text>
                  <Text style={styles.time}>{last.time}</Text>
                </View>

                <Text style={styles.preview} numberOfLines={1}>
                  {last.text}
                </Text>

                <Text style={styles.meta} numberOfLines={1}>
                  {p.gender} • {p.age}
                </Text>
              </View>

              {unreadCount > 0 ? (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{unreadCount}</Text>
                </View>
              ) : (
                <View style={{ width: 24 }} />
              )}
            </Pressable>
          );
        })}

        {activePatients.length === 0 ? (
          <Text style={styles.emptyMain}>
            Keine aktiven Chats. Tippe oben rechts auf ✎, um einen neuen Chat zu starten.
          </Text>
        ) : null}

        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Tabs */}
      <View style={styles.tabs}>
        <Pressable style={styles.tab} onPress={() => router.replace("/therapist-home")}>
          <Ionicons name="home-outline" size={22} color="#111" />
          <Text style={styles.tabText}>Startseite</Text>
        </Pressable>

        <Pressable style={styles.tab} onPress={() => router.push("/therapist-chatlist")}>
          <Ionicons name="chatbubbles" size={22} color="#111" />
          <Text style={styles.tabTextActive}>Chat</Text>
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

      {/* ===== New Chat Modal ===== */}
      <Modal
        visible={pickerOpen}
        animationType="fade"
        transparent
        onRequestClose={() => setPickerOpen(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setPickerOpen(false)}>
          <Pressable style={styles.sheet} onPress={() => {}}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Neuen Chat starten</Text>
              <Pressable onPress={() => setPickerOpen(false)} hitSlop={10} style={styles.sheetClose}>
                <Ionicons name="close" size={20} color="#111" />
              </Pressable>
            </View>

            <View style={styles.modalSearchRow}>
              <Ionicons name="search" size={18} color="#111" />
              <TextInput
                style={styles.modalSearchInput}
                placeholder="Patient suchen..."
                value={pickerSearch}
                onChangeText={setPickerSearch}
              />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 10 }}>
              {pickerPatients.map((p) => (
                <Pressable key={p.id} style={styles.pickItem} onPress={() => openChat(p)}>
                  <View style={styles.pickAvatar} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.pickName}>{p.name}</Text>
                    <Text style={styles.pickMeta} numberOfLines={1}>
                      {p.gender} • {p.age} • {p.registered}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#111" style={{ opacity: 0.6 }} />
                </Pressable>
              ))}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  header: {
    height: 74,
    backgroundColor: "#BDBDBD",
    paddingHorizontal: 14,
    paddingTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerTitle: { fontSize: 18, fontWeight: "900", color: "#111" },
  headerSub: { marginTop: 2, fontSize: 12, fontWeight: "700", color: "#111", opacity: 0.65 },

  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#EDEDED",
    justifyContent: "center",
    alignItems: "center",
  },

  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    margin: 14,
    paddingHorizontal: 12,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#EDEDED",
  },
  searchInput: { flex: 1, fontSize: 14, fontWeight: "600", color: "#111" },

  list: { paddingHorizontal: 14, paddingBottom: 0 },

  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EFEFEF",
  },

  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: "#9E9E9E" },

  mid: { flex: 1 },
  topRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },

  name: { fontSize: 15, fontWeight: "900", color: "#111" },
  time: { fontSize: 12, color: "#3B5BA9", opacity: 0.85, fontWeight: "800" },

  preview: { marginTop: 4, fontSize: 13, color: "#111", opacity: 0.75, fontWeight: "600" },
  meta: { marginTop: 3, fontSize: 12, color: "#111", opacity: 0.55, fontWeight: "700" },

  badge: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#3B5BA9",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  badgeText: { color: "#fff", fontWeight: "900", fontSize: 12 },

  emptyMain: {
    marginTop: 16,
    textAlign: "center",
    color: "#111",
    opacity: 0.65,
    fontWeight: "700",
    paddingHorizontal: 10,
  },

  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#E0E0E0",
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginHorizontal: 14,
    marginBottom: 18,
  },

  tab: { alignItems: "center", width: 78, gap: 4 },
  tabText: { fontSize: 12, fontWeight: "600", color: "#111", opacity: 0.85 },
  tabTextActive: { fontSize: 12, fontWeight: "800", color: "#111" },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "flex-end",
  },

  sheet: {
    backgroundColor: "#BDBDBD",
    padding: 14,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    maxHeight: "75%",
  },

  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  sheetTitle: { fontSize: 18, fontWeight: "900", color: "#111" },

  sheetClose: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#EDEDED",
    justifyContent: "center",
    alignItems: "center",
  },

  modalSearchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 12,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#EDEDED",
    marginBottom: 10,
  },
  modalSearchInput: { flex: 1, fontSize: 14, fontWeight: "600", color: "#111" },

  pickItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  pickAvatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: "#9E9E9E" },
  pickName: { fontSize: 15, fontWeight: "900", color: "#111" },
  pickMeta: { marginTop: 2, fontSize: 12, fontWeight: "700", color: "#111", opacity: 0.75 },
});
