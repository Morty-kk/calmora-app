import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import {
    Alert,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import { BACKEND_URL } from "../constants/backend";

function isoDateOnly(d: Date) {
  return d.toISOString().slice(0, 10);
}

export default function DiaryCreate() {
  const params = useLocalSearchParams<{ date?: string }>();
  const defaultDate = useMemo(() => {
    const d = params?.date ? new Date(String(params.date)) : new Date();
    return Number.isNaN(d.getTime()) ? new Date() : d;
  }, [params?.date]);

  const [mood, setMood] = useState<string>("😐");
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);

  const dateLabel = defaultDate.toLocaleDateString("de-DE");

  const handleSave = async () => {
    const content = text.trim();

    if (!content) {
      if (Platform.OS === "web") {
        window.alert("Bitte schreibe einen Text.");
      } else {
        Alert.alert("Fehlt etwas", "Bitte schreibe einen Text.");
      }
      return;
    }

    const doSave = async () => {
      try {
        setSaving(true);

        const token = await AsyncStorage.getItem("token");
        if (!token) {
          if (Platform.OS === "web") {
            window.alert("Bitte zuerst anmelden.");
          } else {
            Alert.alert("Nicht eingeloggt", "Bitte zuerst anmelden.");
          }
          return;
        }

        const res = await fetch(`${BACKEND_URL}/diary`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            entryDate: isoDateOnly(defaultDate),
            mood,
            content,
          }),
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          console.log("create diary error:", data);
          const msg = data?.error || "Konnte nicht speichern.";
          if (Platform.OS === "web") window.alert(msg);
          else Alert.alert("Fehler", msg);
          return;
        }

        if (Platform.OS === "web") window.alert("Gespeichert ✅");
        router.back();
      } catch (e) {
        console.log("create diary error:", e);
        if (Platform.OS === "web") window.alert("Konnte nicht speichern.");
        else Alert.alert("Fehler", "Konnte nicht speichern.");
      } finally {
        setSaving(false);
      }
    };

    if (Platform.OS === "web") {
      const ok = window.confirm("Willst du den Eintrag speichern?");
      if (ok) doSave();
      return;
    }

    Alert.alert("Speichern?", "Willst du den Eintrag speichern?", [
      { text: "Abbrechen", style: "cancel" },
      { text: "Speichern", onPress: doSave },
    ]);
  };

  const handleClear = () => {
    const doClear = () => setText("");

    if (Platform.OS === "web") {
      const ok = window.confirm("Willst du deinen Text wirklich löschen?");
      if (ok) doClear();
      return;
    }

    Alert.alert("Text löschen?", "Willst du deinen Text wirklich löschen?", [
      { text: "Abbrechen", style: "cancel" },
      { text: "Löschen", style: "destructive", onPress: doClear },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} />
        </Pressable>
        <Text style={styles.title}>Tagebuch</Text>
        <Ionicons name="menu" size={22} />
      </View>

      <View style={styles.line} />
      <Text style={styles.date}>{dateLabel}</Text>

      <Text style={styles.question}>Wie fühlst du dich heute?</Text>

      <View style={styles.moodRow}>
        {["😄", "😊", "😐", "😕", "😡"].map((m) => (
          <Pressable
            key={m}
            onPress={() => setMood(m)}
            style={[styles.mood, mood === m && styles.moodActive]}
          >
            <Text style={{ fontSize: 26 }}>{m}</Text>
          </Pressable>
        ))}
      </View>

      <TextInput
        placeholder="Schreib hier deinen Eintrag ..."
        value={text}
        onChangeText={setText}
        multiline
        style={styles.input}
      />

      <View style={styles.btnRow}>
        <Pressable style={styles.deleteBtn} onPress={handleClear}>
          <Text>Löschen</Text>
        </Pressable>

        <Pressable
          style={[styles.saveBtn, saving && { opacity: 0.6 }]}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={{ fontWeight: "700" }}>
            {saving ? "..." : "Speichern"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#EAF1FB", padding: 16 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { fontSize: 18, fontWeight: "700" },
  line: { height: 1, backgroundColor: "#00000030", marginVertical: 10 },
  date: { marginBottom: 12, opacity: 0.7 },
  question: { fontSize: 16, fontWeight: "700", marginBottom: 10 },
  moodRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 16 },
  mood: { padding: 8, borderRadius: 12 },
  moodActive: { backgroundColor: "#FADDC8" },
  input: { minHeight: 140, backgroundColor: "#ffffffcc", borderRadius: 14, padding: 12 },
  btnRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 20 },
  deleteBtn: {
    backgroundColor: "#FADDC8",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 12,
  },
  saveBtn: {
    backgroundColor: "#F7B9AE",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 12,
  },
});

