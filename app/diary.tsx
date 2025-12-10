import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  ImageBackground,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

export default function Diary() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = React.useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [entries, setEntries] = React.useState<any[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      const load = async () => {
        const stored = await AsyncStorage.getItem("diary");
        if (stored) setEntries(JSON.parse(stored));
      };
      load();
    }, [])
  );

  const todayLabel = today.toLocaleDateString("de-DE");

  return (
    <ImageBackground
      source={require("../assets/bg.png")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <ScrollView style={styles.container}>
        {/* ✅ HEADER */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={22} />
          </Pressable>
          <Text style={styles.brand}>Calmora</Text>
          <Ionicons name="menu" size={22} />
        </View>

        <Text style={styles.title}>Tagebuchansicht</Text>
        <View style={styles.divider} />

        {/* ✅ EINTRÄGE */}
        {entries.map((entry) => (
          <View key={entry.id} style={styles.card}>
            <View>
              <Text style={styles.cardDate}>Am {entry.date}</Text>
              <Text style={styles.more}>mehr sehen</Text>
            </View>
            <Text style={styles.mood}>{entry.mood}</Text>
          </View>
        ))}

        {/* ✅ NEU ERSTELLEN */}
        <Pressable
          style={styles.addBtn}
          onPress={() => router.push("/diary-create")}
        >
          <Text style={styles.addText}>+ neu erstellen</Text>
        </Pressable>

        {/* ✅ DATUM + MONATSWECHSEL */}
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

          <Text style={styles.monthLabel}>{todayLabel}</Text>

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

        <Text style={styles.month}>
          {currentMonth.toLocaleString("de-DE", { month: "long" })}
        </Text>

        {/* ✅ WOCHENTAGE */}
        <View style={styles.weekRow}>
          {["M", "D", "M", "D", "F", "S", "S"].map((d) => (
            <Text key={d} style={styles.weekDay}>{d}</Text>
          ))}
        </View>

        {/* ✅ KALENDER */}
        <View style={styles.calendar}>
          {buildMonth(currentMonth.getFullYear(), currentMonth.getMonth()).map(
            (d, i) => {
              const isToday =
                d.getDate() === today.getDate() &&
                d.getMonth() === today.getMonth() &&
                d.getFullYear() === today.getFullYear();

              const inMonth = d.getMonth() === currentMonth.getMonth();

              return (
                <Text
                  key={i}
                  style={[
                    styles.day,
                    !inMonth && { opacity: 0.3 },
                    isToday && styles.today,
                  ]}
                >
                  {d.getDate()}
                </Text>
              );
            }
          )}
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
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
  },
  cardDate: { fontWeight: "700", fontSize: 15 },
  more: { fontSize: 12, opacity: 0.6 },
  mood: { fontSize: 26 },

  addBtn: { backgroundColor: "#FADDC8", borderRadius: 14, padding: 14, marginTop: 6 },
  addText: { fontWeight: "700" },

  monthRow: { flexDirection: "row", justifyContent: "center", gap: 16, marginTop: 14 },
  switch: { color: "#E11D48", fontSize: 18, fontWeight: "900" },
  monthLabel: { fontWeight: "700" },

  month: { textAlign: "center", marginVertical: 10, fontWeight: "700", letterSpacing: 2, opacity: 0.6 },

  weekRow: { flexDirection: "row", justifyContent: "space-between" },
  weekDay: { width: 32, textAlign: "center", opacity: 0.5, fontWeight: "600" },

  calendar: { flexDirection: "row", flexWrap: "wrap", marginTop: 8 },
  day: { width: "14.2%", textAlign: "center", paddingVertical: 8, fontWeight: "600" },
  today: { borderWidth: 1, borderColor: "#E11D48", borderRadius: 20, color: "#E11D48" },
});
