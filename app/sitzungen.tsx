import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

import { useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    ImageBackground,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import BottomTabs from "../components/BottomTabs";
import { BACKEND_URL } from "../constants/backend";

type AppointmentItem = {
  id: number;
  startsAt: string;
  note?: string | null;
  status?: string | null;
  therapist?: { email?: string; name?: string };
};

function fmt(startsAt: string) {
  const d = new Date(startsAt);
  return {
    date: d.toLocaleDateString("de-DE"),
    time: d.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" }),
    ms: d.getTime(),
  };
}

export default function Sitzungen() {
  const router = useRouter(); // ✅ أهم تعديل

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<AppointmentItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = await AsyncStorage.getItem("token");
      if (!token) {
        setItems([]);
        setError("Kein Token gefunden. Bitte erneut einloggen.");
        return;
      }

      const res = await fetch(`${BACKEND_URL}/appointments/mine`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "Fehler beim Laden der Sitzungen.");
        setItems([]);
        return;
      }

      setItems(data?.items ?? []);
    } catch (e) {
      console.log("load sitzungen error:", e);
      setError("Fehler beim Laden der Sitzungen.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const { upcoming, past } = useMemo(() => {
    const now = Date.now();
    const mapped = (items ?? []).map((a) => ({ ...a, _fmt: fmt(a.startsAt) }));

    const upcoming = mapped
      .filter((a) => a._fmt.ms >= now)
      .sort((a, b) => a._fmt.ms - b._fmt.ms);

    const past = mapped
      .filter((a) => a._fmt.ms < now)
      .sort((a, b) => b._fmt.ms - a._fmt.ms);

    return { upcoming, past };
  }, [items]);

  const Card = ({ a }: { a: any }) => {
    const cancelled = (a.status || "").toUpperCase() === "CANCELLED";

    return (
      <Pressable
        onPress={() => router.push("/sitzung/" + a.id)} // ✅ شغال بدون template string
        style={({ pressed }) => [
          styles.card,
          cancelled && styles.cardCancelled,
          pressed && styles.cardPressed,
          Platform.OS === "web" && ({ cursor: "pointer" } as any),
        ]}
      >
        <Text style={styles.cardTitle}>
          {a._fmt.date}, {a._fmt.time}
          {cancelled ? <Text style={styles.cancelTag}>  (abgesagt)</Text> : null}
        </Text>

        <Text style={styles.cardDesc}>
          Therapeut:{" "}
          <Text style={styles.strong}>
            {a.therapist?.name || a.therapist?.email || "therapist@example.com"}
          </Text>
        </Text>

        <Text style={styles.openHint}>Tippen für Details</Text>
      </Pressable>
    );
  };

  return (
    <ImageBackground
      source={require("../assets/bg.png")}
      style={styles.bg}
      resizeMode="cover"
    >
      <View style={styles.wrap}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()} style={styles.iconBtn}>
            <Ionicons name="chevron-back" size={22} color="#111827" />
          </Pressable>

          <Text style={styles.title}>Sitzungen</Text>

          <Pressable onPress={load} style={styles.iconBtn}>
            <Ionicons name="refresh" size={20} color="#111827" />
          </Pressable>
        </View>

        <View style={styles.line} />

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator />
            <Text style={styles.muted}>Laden...</Text>
          </View>
        ) : error ? (
          <View style={styles.center}>
            <Text style={styles.error}>{error}</Text>
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={{ paddingBottom: 110 }}
            keyboardShouldPersistTaps="always"
          >
            <Text style={styles.section}>Kommende Sitzung(en)</Text>
            {upcoming.length === 0 ? (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Keine kommenden Sitzungen</Text>
                <Text style={styles.cardDesc}>
                  Buche einen Termin über „Termine“.
                </Text>
              </View>
            ) : (
              upcoming.map((a: any) => <Card key={a.id} a={a} />)
            )}

            <Text style={[styles.section, { marginTop: 16 }]}>
              Vergangene Sitzung(en)
            </Text>
            {past.length === 0 ? (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Noch keine vergangenen Sitzungen</Text>
              </View>
            ) : (
              past.map((a: any) => <Card key={a.id} a={a} />)
            )}
          </ScrollView>
        )}

        <BottomTabs />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
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

  section: { fontSize: 14, fontWeight: "800", color: "#111827", marginBottom: 10 },

  card: {
    backgroundColor: "rgba(255,255,255,0.90)",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#00000010",
  },
  cardPressed: {
    transform: [{ scale: 0.995 }],
    opacity: 0.95,
  },
  cardCancelled: { opacity: 0.65 },

  cardTitle: { fontSize: 15, fontWeight: "800", color: "#111827" },
  cardDesc: { marginTop: 6, fontSize: 13, color: "#374151" },
  strong: { fontWeight: "800", color: "#111827" },
  openHint: { marginTop: 8, fontSize: 12, color: "#6B7280" },
  cancelTag: { color: "#B91C1C", fontWeight: "800" },

  center: { alignItems: "center", justifyContent: "center", marginTop: 30, gap: 8 },
  muted: { color: "#6B7280" },
  error: { color: "#B91C1C", fontWeight: "700", textAlign: "center" },
});
