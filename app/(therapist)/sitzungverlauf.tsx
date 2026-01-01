import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
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

import { getPatientById } from "./patientsApi";
import { SessionNote, sessionsApi } from "./sessionsApi";

type Draft = {
  id?: string;
  date: string;   // YYYY-MM-DD
  title: string;
  note: string;
};

function sortByDate(a: SessionNote, b: SessionNote) {
  return a.date.localeCompare(b.date);
}

export default function Sitzungverlauf() {
const params = useLocalSearchParams<{ patientId?: string; id?: string; name?: string }>();
const patientId = (params.patientId ?? params.id) as string | undefined;


  const patient = patientId ? getPatientById(patientId) : undefined;
  const name = patient?.name ?? params.name ?? "Patient";

  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<SessionNote[]>([]);

  const [editorOpen, setEditorOpen] = useState(false);
  const [editMode, setEditMode] = useState<"add" | "edit">("add");
  const [draft, setDraft] = useState<Draft>({
    date: "2026-01-01",
    title: "Notiz",
    note: "",
  });

  // ✅ Load sessions for patient
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        if (!patientId) {
          setSessions([]);
          return;
        }
        const data = await sessionsApi.fetchSessionsByPatientId(patientId);
        setSessions(data);
      } finally {
        setLoading(false);
      }
    })();
  }, [patientId]);

  const openAdd = () => {
    setEditMode("add");
    setDraft({
      date: "2026-01-01",
      title: "Notiz",
      note: "",
    });
    setEditorOpen(true);
  };

  const openEdit = (s: SessionNote) => {
    setEditMode("edit");
    setDraft({
      id: s.id,
      date: s.date,
      title: s.title,
      note: s.note,
    });
    setEditorOpen(true);
  };

  const saveDraft = async () => {
    if (!patientId) return;
    if (!draft.date.trim()) return;
    if (!draft.title.trim()) return;
    if (!draft.note.trim()) return;

    if (editMode === "add") {
      const created = await sessionsApi.createSession({
        patientId,
        date: draft.date.trim(),
        title: draft.title.trim(),
        note: draft.note.trim(),
      });
      setSessions((prev) => [...prev, created].sort(sortByDate));
    } else {
      if (!draft.id) return;
      const updated = await sessionsApi.updateSession(draft.id, {
        date: draft.date.trim(),
        title: draft.title.trim(),
        note: draft.note.trim(),
      });
      setSessions((prev) => prev.map((x) => (x.id === updated.id ? updated : x)).sort(sortByDate));
    }

    setEditorOpen(false);
  };

  const deleteSession = async (id: string) => {
    await sessionsApi.deleteSession(id);
    setSessions((prev) => prev.filter((x) => x.id !== id));
  };

  const headerRight = useMemo(() => {
    return (
      <Pressable onPress={openAdd} hitSlop={10} style={styles.addIconBtn}>
        <Ionicons name="add-circle" size={28} color="#111" />
      </Pressable>
    );
  }, [patientId]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Top Row */}
        <View style={styles.topRow}>
          <Pressable onPress={() => router.back()} hitSlop={10} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </Pressable>

          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Sitzungsverlauf</Text>
          </View>

          {headerRight}
        </View>

        <View style={styles.divider} />

        <Text style={styles.patientName}>{name}</Text>

        {!patientId ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>Kein Patient ausgewählt (patientId fehlt).</Text>
          </View>
        ) : loading ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>Lade Sitzungen...</Text>
          </View>
        ) : sessions.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>Noch keine Sitzungen / Notizen.</Text>
            <Pressable style={styles.addBtn} onPress={openAdd}>
              <Text style={styles.addText}>+ Notiz hinzufügen</Text>
            </Pressable>
          </View>
        ) : (
          <>
            {sessions.map((s) => (
              <View key={s.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardTitle}>{s.title}</Text>
                    <Text style={styles.cardDate}>{s.date}</Text>
                  </View>

                  <View style={styles.cardActions}>
                    <Pressable onPress={() => openEdit(s)} hitSlop={10}>
                      <Ionicons name="pencil" size={18} color="#111" />
                    </Pressable>
                    <Pressable onPress={() => deleteSession(s.id)} hitSlop={10}>
                      <Ionicons name="trash" size={18} color="#B00000" />
                    </Pressable>
                  </View>
                </View>

                <Text style={styles.cardNote}>{s.note}</Text>
              </View>
            ))}

            <Pressable style={styles.addBtnStandalone} onPress={openAdd}>
              <Text style={styles.addText}>+ Notiz hinzufügen</Text>
            </Pressable>
          </>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* ===================== ADD / EDIT MODAL ===================== */}
      <Modal transparent visible={editorOpen} animationType="fade">
        <Pressable style={styles.overlay} onPress={() => setEditorOpen(false)}>
          <Pressable style={styles.editorSheet} onPress={() => {}}>
            <Text style={styles.editorTitle}>
              {editMode === "add" ? "Notiz hinzufügen" : "Notiz bearbeiten"}
            </Text>

            <View style={styles.modalDivider} />

            <View style={styles.formField}>
              <Text style={styles.formLabel}>Datum (YYYY-MM-DD)</Text>
              <TextInput
                style={styles.formInput}
                value={draft.date}
                onChangeText={(t) => setDraft((p) => ({ ...p, date: t }))}
                placeholder="2026-01-04"
              />
            </View>

            <View style={styles.formField}>
              <Text style={styles.formLabel}>Titel</Text>
              <TextInput
                style={styles.formInput}
                value={draft.title}
                onChangeText={(t) => setDraft((p) => ({ ...p, title: t }))}
                placeholder="z.B. Follow-up"
              />
            </View>

            <View style={styles.formField}>
              <Text style={styles.formLabel}>Notiz</Text>
              <TextInput
                style={[styles.formInput, { height: 120, textAlignVertical: "top" }]}
                value={draft.note}
                onChangeText={(t) => setDraft((p) => ({ ...p, note: t }))}
                placeholder="Schreiben Sie hier..."
                multiline
              />
            </View>

            <View style={styles.editorButtonsRow}>
              <Pressable style={styles.cancelBtn} onPress={() => setEditorOpen(false)}>
                <Text style={styles.cancelText}>Abbrechen</Text>
              </Pressable>

              <Pressable style={styles.saveBtn} onPress={saveDraft}>
                <Text style={styles.saveText}>Speichern</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingTop: 58, paddingHorizontal: 22 },
  scroll: { paddingBottom: 40 },

  topRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  backBtn: { padding: 6 },
  addIconBtn: { padding: 6 },

  title: { fontSize: 20, fontWeight: "800", color: "#111" },
  divider: { height: 1, backgroundColor: "#CFCFCF", marginVertical: 12 },

  patientName: { fontSize: 18, fontWeight: "800", color: "#111", marginBottom: 12 },

  card: {
    backgroundColor: "#BDBDBD",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },

  cardHeader: { flexDirection: "row", alignItems: "center", gap: 10 },
  cardActions: { flexDirection: "row", gap: 14, alignItems: "center" },

  cardTitle: { fontSize: 16, fontWeight: "800", color: "#111" },
  cardDate: { fontSize: 13, fontWeight: "700", color: "#333", marginTop: 4 },
  cardNote: { fontSize: 13, fontWeight: "600", color: "#111", marginTop: 10 },

  emptyCard: {
    backgroundColor: "#EDEDED",
    borderRadius: 14,
    padding: 14,
  },
  emptyText: { fontSize: 13, fontWeight: "700", color: "#111" },

  addBtn: {
    marginTop: 12,
    backgroundColor: "#DCDCDC",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },

  addBtnStandalone: {
    marginTop: 6,
    backgroundColor: "#E0E0E0",
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
  },

  addText: { fontSize: 14, fontWeight: "900", color: "#111" },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
  },

  editorSheet: {
    width: "92%",
    marginTop: 90,
    marginRight: 12,
    backgroundColor: "#BDBDBD",
    borderRadius: 16,
    padding: 16,
  },

  editorTitle: { fontSize: 18, fontWeight: "800", color: "#111" },
  modalDivider: {
    height: 1,
    backgroundColor: "#111",
    opacity: 0.4,
    marginVertical: 10,
  },

  formField: { marginTop: 10 },
  formLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: "#111",
    opacity: 0.85,
    marginBottom: 6,
  },

  formInput: {
    backgroundColor: "#EDEDED",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    fontWeight: "700",
    color: "#111",
  },

  editorButtonsRow: { flexDirection: "row", gap: 10, marginTop: 14 },

  cancelBtn: {
    flex: 1,
    backgroundColor: "#E0E0E0",
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
  },
  cancelText: { fontSize: 14, fontWeight: "800", color: "#111" },

  saveBtn: {
    flex: 1,
    backgroundColor: "#E0E0E0",
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
  },
  saveText: { fontSize: 14, fontWeight: "900", color: "#111" },
});
