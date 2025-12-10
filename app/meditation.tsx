import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
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
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Meditation</Text>
          <Text style={styles.headerSubtitle}>
            Beruhigt den Geist, stärkt die Aufmerksamkeit und hilft dir,
            abzuschalten.
          </Text>
        </View>

        <View style={styles.iconBubble}>
          <Ionicons name="person-circle-outline" size={32} color="#1F2933" />
        </View>
      </View>

      {/* Card „Geführte Meditation“ */}
      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.cardTitle}>Geführte Meditation</Text>
          <View style={styles.levelPill}>
            <Text style={styles.levelText}>Anfänger</Text>
          </View>
        </View>

        <Text style={styles.cardDesc}>
          Starte mit einer sanften, geführten Meditation, um deinen Tag ruhig
          zu beginnen.
        </Text>

        {/* Play-Kachel (führt zur Kurs-Ansicht) */}
        <TouchableOpacity
          style={styles.playTile}
          activeOpacity={0.85}
          onPress={() => router.push("/meditation-courses")}
        >
          <View style={styles.playTileRow}>
            <View>
              <Text style={styles.playTitle}>Geführte Meditation</Text>
              <Text style={styles.playSubtitle}>10 Min · ruhige Stimme</Text>
            </View>

            <View style={styles.playCircle}>
              <Ionicons name="play" size={26} color="#fff" />
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#111827",
  },
  headerSubtitle: {
    marginTop: 6,
    fontSize: 13,
    color: "#4B5563",
    maxWidth: 220,
  },
  iconBubble: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "rgba(255,255,255,0.8)",
    alignItems: "center",
    justifyContent: "center",
  },

  card: {
    marginTop: 32,
    padding: 18,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.85)",
  },
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },
  levelPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "#E5E7EB",
  },
  levelText: {
    fontSize: 12,
    color: "#374151",
    fontWeight: "600",
  },
  cardDesc: {
    marginTop: 10,
    fontSize: 13,
    color: "#4B5563",
  },

  playTile: {
    marginTop: 16,
    borderRadius: 18,
    backgroundColor: "#9E86B9",
    padding: 18,
  },
  playTileRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  playTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#F9FAFB",
  },
  playSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: "#E5E7EB",
  },
  playCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.45)",
  },
});