import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import React from "react";
import {
  Alert,
  ImageBackground,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { BACKEND_URL } from "../constants/backend";

/* ✅ KALENDER-FUNKTION */
function buildMonth(year: number, month: number) {
  const first = new Date(year, month, 1);
  const start = new Date(first);
  start.setDate(first.getDate() - ((first.getDay() + 6) % 7));

  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

function isoDateOnly(d: Date) {
  return d.toISOString().slice(0, 10);
}

export default function Diary() {
  const today = new Date();

  const [currentMonth, setCurrentMonth] = React.useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const [selectedDate, setSelectedDate] = React.useState<Date>(today);

  const [entries, setEntries] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);

  const loadEntries = React.useCallback(async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        setEntries([]);
        return;
      }

      const dateParam = isoDateOnly(selectedDate);
      const res = await fetch(`${BACKEND_URL}/diary?date=${dateParam}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        console.log("diary get error:", data);
        setEntries([]);
        return;
      }

      setEntries(data.items ?? []);
    } catch (e) {
      console.log("load diary error:", e);
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  useFocusEffect(
    React.useCallback(() => {
      loadEntries();
    }, [loadEntries])
  );

  const doDelete = React.useCallback(
    async (id: number) => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) return;

        const res = await fetch(`${BACKEND_URL}/diary/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          console.log("delete diary error:", data);
          if (Platform.OS === "web") window.alert(data?.error || "Konnte nicht löschen.");
          return;
        }

        // ✅ UI update
        setEntries((prev) => prev.filter((x) => x.id !== id));
      } catch (e) {
        console.log("delete diary error:", e);
        if (Platform.OS === "web") window.alert("Konnte nicht löschen.");
      }
    },
    [setEntries]
  );

  const handleDelete = (id: number) => {
    // ✅ Web: window.confirm (مضمون)
    if (Platform.OS === "web") {
      const ok = window.confirm("Willst du diesen Eintrag wirklich löschen?");
      if (ok) doDelete(id);
      return;
    }

    // ✅ Mobile: Alert.alert
    Alert.alert("Eintrag löschen?", "Willst du diesen Eintrag wirklich löschen?", [
      { text: "Abbrechen", style: "cancel" },
      {
        text: "Löschen",
        style: "destructive",
        onPress: () => doDelete(id),
      },
    ]);
  };

  const selectedLabel = selectedDate.toLocaleDateString("de-DE");

  return (
    <ImageBackground
      source={require("../assets/bg.png")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <ScrollView style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={22} />
          </Pressable>
          <Text style={styles.brand}>Calmora</Text>
          <Ionicons name="menu" size={22} />
        </View>

        <Text style={styles.title}>Tagebuchansicht</Text>
        <View style={styles.divider} />

        {/* INFO DATE */}
        <Text style={{ fontWeight: "700", marginBottom: 8 }}>
          Ausgewählt: {selectedLabel}
        </Text>

        {/* EINTRÄGE */}
        {loading ? (
          <Text style={{ opacity: 0.7, marginTop: 6 }}>Lade…</Text>
        ) : entries.length === 0 ? (
          <Text style={{ opacity: 0.7, marginTop: 6 }}>
            Keine Einträge für diesen Tag.
          </Text>
        ) : (
          entries.map((entry) => (
            <View key={entry.id} style={styles.card}>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardDate}>
                  Am {new Date(entry.entryDate).toLocaleDateString("de-DE")}
                </Text>
                <Text style={styles.more} numberOfLines={1}>
                  {entry.content}
                </Text>
              </View>

              <View style={{ alignItems: "center", gap: 6 }}>
                <Text style={styles.mood}>{entry.mood ?? "😐"}</Text>

                <Pressable onPress={() => handleDelete(entry.id)}>
                  <Ionicons name="trash" size={18} color="#B91C1C" />
                </Pressable>
              </View>
            </View>
          ))
        )}

        {/* NEU ERSTELLEN */}
        <Pressable
          style={styles.addBtn}
          onPress={() =>
            router.push({
              pathname: "/diary-create",
              params: { date: isoDateOnly(selectedDate) },
            })
          }
        >
          <Text style={styles.addText}>+ neu erstellen</Text>
        </Pressable>

        {/* DATUM + MONATSWECHSEL */}
        <View style={styles.monthRow}>
          <Pressable
            onPress={() =>
              setCurrentMonth(
                (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
              )
            }
          >
            <Text style={styles.switch}>«</Text>
          </Pressable>

          <Text style={styles.monthLabel}>
            {currentMonth.toLocaleString("de-DE", {
              month: "long",
              year: "numeric",
            })}
          </Text>

          <Pressable
            onPress={() =>
              setCurrentMonth(
                (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
              )
            }
          >
            <Text style={styles.switch}>»</Text>
          </Pressable>
        </View>

        {/* WOCHENTAGE */}
        <View style={styles.weekRow}>
          {["M", "D", "M", "D", "F", "S", "S"].map((d) => (
            <Text key={d} style={styles.weekDay}>
              {d}
            </Text>
          ))}
        </View>

        {/* KALENDER */}
        <View style={styles.calendar}>
          {buildMonth(currentMonth.getFullYear(), currentMonth.getMonth()).map((d, i) => {
            const isToday =
              d.getDate() === today.getDate() &&
              d.getMonth() === today.getMonth() &&
              d.getFullYear() === today.getFullYear();

            const inMonth = d.getMonth() === currentMonth.getMonth();
            const isSelected = isoDateOnly(d) === isoDateOnly(selectedDate);

            return (
              <Pressable
                key={i}
                onPress={() => setSelectedDate(d)}
                style={{ width: "14.2%" }}
              >
                <Text
                  style={[
                    styles.day,
                    !inMonth && { opacity: 0.3 },
                    isToday && styles.today,
                    isSelected && styles.selected,
                  ]}
                >
                  {d.getDate()}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brand: { fontSize: 20, color: "#9B8BC8", fontWeight: "700" },
  title: { fontSize: 16, marginTop: 4 },
  divider: { height: 1, backgroundColor: "#00000030", marginVertical: 10 },

  card: {
    backgroundColor: "#FADDC8",
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    gap: 10,
  },
  cardDate: { fontWeight: "700", fontSize: 15 },
  more: { fontSize: 12, opacity: 0.7, marginTop: 4 },
  mood: { fontSize: 26 },

  addBtn: {
    backgroundColor: "#FADDC8",
    borderRadius: 14,
    padding: 14,
    marginTop: 6,
  },
  addText: { fontWeight: "700" },

  monthRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginTop: 14,
    alignItems: "center",
  },
  switch: { color: "#E11D48", fontSize: 18, fontWeight: "900" },
  monthLabel: { fontWeight: "800" },

  weekRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 12 },
  weekDay: { width: 32, textAlign: "center", opacity: 0.5, fontWeight: "600" },

  calendar: { flexDirection: "row", flexWrap: "wrap", marginTop: 8 },
  day: { textAlign: "center", paddingVertical: 8, fontWeight: "600" },
  today: {
    borderWidth: 1,
    borderColor: "#E11D48",
    borderRadius: 20,
    color: "#E11D48",
  },
  selected: {
    borderWidth: 1,
    borderColor: "#111827",
    borderRadius: 20,
  },
});
