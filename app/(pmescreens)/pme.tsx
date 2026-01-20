// app/(pmescreens)/pme.tsx
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function PMEOverview() {
  return (
    <ImageBackground
      source={require("../../assets/Home_Design.jpg")}
      style={styles.bg}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#444" />
        </TouchableOpacity>

        {/* Title + Intro */}
        <Text style={styles.mainTitle}>Was ist Progressive Muskelentspannung?</Text>
        <Text style={styles.description}>
          Diese Technik entspannt deinen Körper, indem du nacheinander 
          Muskelgruppen anspannst und wieder loslässt.
        </Text>

        {/* Karten / Varianten */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>PME Kurze Variante</Text>
          <Text style={styles.cardSubtitle}>Für schnelle Entspannung</Text>
          <TouchableOpacity
            style={styles.cardButton}
            onPress={() => router.push("/pme_kurz_intro")}
          >
            <Ionicons name="play-circle" size={18} color="#fff" />
            <Text style={styles.cardButtonText}>beginnen</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.card, { backgroundColor: "#7BD9C8" }]}>
          <Text style={styles.cardTitle}>PME Lange Variante</Text>
          <Text style={styles.cardSubtitle}>Tiefere körperliche Entspannung</Text>
          <TouchableOpacity
            style={styles.cardButton}
            onPress={() => {
              // لاحقاrouter.push("/pme_lang_intro")
              router.push("/pme_lange_intro"); // مؤقتاً نفس القصيرة بس ليتجنب الكراش
            }}
          >
            <Ionicons name="play-circle" size={18} color="#fff" />
            <Text style={styles.cardButtonText}>beginnen</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.card, { backgroundColor: "#F8B7A9" }]}>
          <Text style={styles.cardTitle}>PME Gesicht & Schultern</Text>
          <Text style={styles.cardSubtitle}>
            Ideal bei Stress und Spannung im Alltag
          </Text>
          <TouchableOpacity
            style={styles.cardButton}
            onPress={() => {
              // لاحقاً: router.push("/pme_face_intro")
              router.push("/pme_kurz_intro"); // مؤقتاً نفس القصيرة
            }}
          >
            <Ionicons name="play-circle" size={18} color="#fff" />
            <Text style={styles.cardButtonText}>beginnen</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  container: {
    padding: 20,
    paddingTop: 60,
    gap: 16,
  },
  backBtn: {
    position: "absolute",
    top: 30,
    left: 16,
    zIndex: 10,
  },
  mainTitle: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: "800",
    color: "#2B2B2B",
  },
  description: {
    fontSize: 14,
    marginTop: 4,
    color: "#333",
  },
  card: {
    marginTop: 16,
    backgroundColor: "#6CB0C8",
    borderRadius: 18,
    padding: 18,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: "#fdfdfd",
    marginBottom: 10,
  },
  cardButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#00000044",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  cardButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 13,
  },
});


