import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ImageBackground,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { BACKEND_URL } from "../../constants/backend";

type Appointment = {
  id: number;
  startsAt: string;
  note?: string | null;
  status?: string | null;
  therapist?: { email?: string; name?: string };
  patient?: { email?: string; name?: string };
};

function fmt(startsAt: string) {
  const d = new Date(startsAt);
  return {
    date: d.toLocaleDateString("de-DE"),
    time: d.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" }),
    ms: d.getTime(),
  };
}

export default function SitzungDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [loading, setLoading] = useState(true);
  const [appt, setAppt] = useState<Appointment | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  const formatted = useMemo(() => (appt ? fmt(appt.startsAt) : null), [appt]);

  const canCancel = useMemo(() => {
    if (!appt) return false;
    const cancelled = (appt.status || "").toUpperCase() === "CANCELLED";
    if (cancelled) return false;
    const future = new Date(appt.startsAt).getTime() > Date.now();
    return future;
  }, [appt]);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = await AsyncStorage.getItem("token");
      if (!token) {
        setError("Kein Token gefunden. Bitte erneut einloggen.");
        setAppt(null);
        return;
      }

      const res = await fetch(`${BACKEND_URL}/appointments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "Fehler beim Laden.");
        setAppt(null);
        return;
      }

      setAppt(data?.appointment ?? null);
    } catch (e) {
      console.log(e);
      setError("Fehler beim Laden.");
      setAppt(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const doCancel = async () => {
    try {
      setCancelLoading(true);

      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Fehler", "Kein Token gefunden. Bitte erneut einloggen.");
        return;
      }

      const res = await fetch(`${BACKEND_URL}/appointments/${id}/cancel`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) {
        Alert.alert("Fehler", data?.error ?? "Absage fehlgeschlagen.");
        return;
      }

      setAppt(data?.appointment ?? appt);
      setConfirmOpen(false);
      Alert.alert("Erfolg", "Der Termin wurde abgesagt.");
    } catch (e) {
      console.log(e);
      Alert.alert("Fehler", "Absage fehlgeschlagen.");
    } finally {
      setCancelLoading(false);
    }
  };

  return (
    <ImageBackground source={require("../../assets/bg.png")} style={s.bg} resizeMode="cover">
      <View style={s.wrap}>
        <View style={s.headerRow}>
          <Pressable onPress={() => router.back()} style={s.iconBtn}>
            <Ionicons name="chevron-back" size={22} color="#111827" />
          </Pressable>
          <Text style={s.title}>Termin</Text>
          <Pressable onPress={load} style={s.iconBtn}>
            <Ionicons name="refresh" size={20} color="#111827" />
          </Pressable>
        </View>

        <View style={s.line} />

        {loading ? (
          <View style={s.center}>
            <ActivityIndicator />
            <Text style={s.muted}>Laden...</Text>
          </View>
        ) : error ? (
          <View style={s.center}>
            <Text style={s.error}>{error}</Text>
          </View>
        ) : !appt ? (
          <View style={s.center}>
            <Text style={s.muted}>Kein Termin gefunden.</Text>
          </View>
        ) : (
          <View style={s.card}>
            <Text style={s.cardTitle}>
              {formatted?.date}, {formatted?.time}
            </Text>

            <Text style={s.row}>
              Status:{" "}
              <Text
                style={[
                  s.strong,
                  (appt.status || "").toUpperCase() === "CANCELLED" && { color: "#B91C1C" },
                ]}
              >
                {((appt.status || "BOOKED") + "").toUpperCase()}
              </Text>
            </Text>

            <Text style={s.row}>
              Therapeut:{" "}
              <Text style={s.strong}>
                {appt.therapist?.name || appt.therapist?.email || "therapist@example.com"}
              </Text>
            </Text>

            {!!appt.note && <Text style={s.note}>Notiz: {appt.note}</Text>}

            <View style={{ height: 14 }} />

            {canCancel ? (
              <Pressable style={s.cancelBtn} onPress={() => setConfirmOpen(true)}>
                <Text style={s.cancelBtnText}>Termin absagen</Text>
              </Pressable>
            ) : (
              <Text style={s.muted}>
                Dieser Termin kann nicht mehr abgesagt werden (bereits vorbei oder schon abgesagt).
              </Text>
            )}
          </View>
        )}

        {/* Confirm Modal */}
        <Modal transparent visible={confirmOpen} animationType="fade" onRequestClose={() => setConfirmOpen(false)}>
          <View style={s.modalOverlay}>
            <View style={s.modalCard}>
              <Text style={s.modalTitle}>Termin absagen?</Text>
              <Text style={s.modalText}>
                Möchtest du diesen Termin wirklich absagen? Diese Aktion kann nicht rückgängig gemacht werden.
              </Text>

              <View style={s.modalRow}>
                <Pressable
                  style={[s.modalBtn, s.modalBtnGhost]}
                  onPress={() => setConfirmOpen(false)}
                  disabled={cancelLoading}
                >
                  <Text style={s.modalBtnGhostText}>Zurück</Text>
                </Pressable>

                <Pressable
                  style={[s.modalBtn, s.modalBtnDanger, cancelLoading && { opacity: 0.7 }]}
                  onPress={doCancel}
                  disabled={cancelLoading}
                >
                  <Text style={s.modalBtnDangerText}>
                    {cancelLoading ? "..." : "Absagen"}
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ImageBackground>
  );
}

const s = StyleSheet.create({
  bg: { flex: 1 },
  wrap: { flex: 1, padding: 16 },

  headerRow: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 4 },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#00000020",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: { flex: 1, fontSize: 18, fontWeight: "800", color: "#111827" },
  line: { height: 1, backgroundColor: "#00000020", marginVertical: 12 },

  card: {
    backgroundColor: "rgba(255,255,255,0.88)",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#00000010",
  },
  cardTitle: { fontSize: 16, fontWeight: "900", color: "#111827", marginBottom: 10 },
  row: { fontSize: 13, color: "#374151", marginTop: 4 },
  strong: { fontWeight: "900", color: "#111827" },
  note: { marginTop: 10, fontSize: 12, color: "#4B5563" },

  cancelBtn: {
    backgroundColor: "#B91C1C",
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
  },
  cancelBtnText: { color: "white", fontWeight: "900" },

  center: { alignItems: "center", justifyContent: "center", marginTop: 30, gap: 8 },
  muted: { color: "#6B7280" },
  error: { color: "#B91C1C", fontWeight: "700", textAlign: "center" },

  modalOverlay: {
    flex: 1,
    backgroundColor: "#00000055",
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
  },
  modalCard: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
  },
  modalTitle: { fontSize: 16, fontWeight: "900", color: "#111827" },
  modalText: { marginTop: 8, color: "#374151", fontSize: 13, lineHeight: 18 },

  modalRow: { flexDirection: "row", gap: 10, marginTop: 14 },
  modalBtn: { flex: 1, paddingVertical: 12, borderRadius: 14, alignItems: "center" },

  modalBtnGhost: { backgroundColor: "#F3F4F6" },
  modalBtnGhostText: { color: "#111827", fontWeight: "800" },

  modalBtnDanger: { backgroundColor: "#B91C1C" },
  modalBtnDangerText: { color: "white", fontWeight: "900" },
});
