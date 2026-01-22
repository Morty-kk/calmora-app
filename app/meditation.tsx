import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function MeditationIntro() {
  return (
    <ImageBackground
      source={require("../assets/bg.png")}
      style={styles.bg}
      resizeMode="cover"
    >
      {/* ⬅️ زر الرجوع إلى الـ Menu */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.replace("/menu")}
        activeOpacity={0.8}
      >
        <Ionicons name="chevron-back" size={24} color="#111827" />
      </TouchableOpacity>

      <View style={styles.container}>
        <Text style={styles.pageTitle}>Meditation</Text>
        <Text style={styles.pageSubtitle}>
          Wähle einen Kurs und starte direkt.
        </Text>

        <TouchableOpacity
          style={styles.bigCard}
          activeOpacity={0.9}
          onPress={() => router.push("/meditation-courses")}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.bigCardTitle}>Geführte Meditation</Text>
            <Text style={styles.bigCardDesc}>
              Sanfte Sessions für mehr Ruhe & Fokus – tippe zum Auswählen.
            </Text>
          </View>

          <View style={styles.playCircle}>
            <Ionicons name="chevron-forward" size={22} color="#fff" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.smallCard}
          activeOpacity={0.9}
          onPress={() => router.push("/meditation-courses")}
        >
          <Text style={styles.smallCardTitle}>Alle Kurse ansehen</Text>
          <Ionicons name="arrow-forward" size={18} color="#111827" />
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 70,
  },

  backButton: {
    position: "absolute",
    top: 32, // ⬅️ هون التعديل
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.85)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },

  container: {
    gap: 14,
  },

  pageTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111827",
  },
  pageSubtitle: {
    fontSize: 13,
    color: "#4B5563",
    marginTop: -6,
  },

  bigCard: {
    marginTop: 14,
    borderRadius: 22,
    padding: 18,
    backgroundColor: "rgba(255,255,255,0.9)",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  bigCardTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
  },
  bigCardDesc: {
    marginTop: 6,
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 18,
  },

  playCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#9E86B9",
    alignItems: "center",
    justifyContent: "center",
  },

  smallCard: {
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: "rgba(255,255,255,0.75)",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  smallCardTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },
});

