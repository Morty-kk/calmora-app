import { View, Text, StyleSheet, Pressable, TextInput, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function DiaryCreate() {
  const [mood, setMood] = useState<string | null>(null);
  const [text, setText] = useState("");

  const today = new Date().toLocaleDateString("de-DE");

const handleSave = async () => {
  const confirmSave =
    typeof window !== "undefined"
      ? window.confirm("Willst du den Eintrag speichern?")
      : true;

  if (!confirmSave) return;

  const newEntry = {
    id: Date.now().toString(),
    date: today,
    mood: mood ?? "😐",
    text,
  };

  const stored = await AsyncStorage.getItem("diary");
  const entries = stored ? JSON.parse(stored) : [];

  entries.unshift(newEntry);
  await AsyncStorage.setItem("diary", JSON.stringify(entries));

  router.back();
};


 const handleDelete = () => {
  const confirmDelete =
    typeof window !== "undefined"
      ? window.confirm("Willst du deinen Eintrag löschen?")
      : true;

  if (!confirmDelete) return;

  setText("");
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
      <Text style={styles.date}>{today}</Text>

      <Text style={styles.question}>Wie fühlst du dich heute ?</Text>

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
        <Pressable style={styles.deleteBtn} onPress={handleDelete}>
          <Text>Löschen</Text>
        </Pressable>

        <Pressable style={styles.saveBtn} onPress={handleSave}>
          <Text style={{ fontWeight: "700" }}>Speichern</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#EAF1FB", padding: 16 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { fontSize: 18, fontWeight: "700" },
  line: { height: 1, backgroundColor: "#00000030", marginVertical: 10 },
  date: { marginBottom: 12, opacity: 0.7 },
  question: { fontSize: 16, fontWeight: "700", marginBottom: 10 },
  moodRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 16 },
  mood: { padding: 8, borderRadius: 12 },
  moodActive: { backgroundColor: "#FADDC8" },
  input: { minHeight: 140, backgroundColor: "#ffffffcc", borderRadius: 14, padding: 12 },
  btnRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 20 },
  deleteBtn: { backgroundColor: "#FADDC8", paddingVertical: 12, paddingHorizontal: 30, borderRadius: 12 },
  saveBtn: { backgroundColor: "#F7B9AE", paddingVertical: 12, paddingHorizontal: 30, borderRadius: 12 },
});
