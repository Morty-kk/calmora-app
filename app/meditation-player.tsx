import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import {
    Image,
    ImageBackground,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

type Params = { id?: string; title?: string };

export default function MeditationPlayer() {
  const { title } = useLocalSearchParams<Params>();

  const trackTitle = title ?? "Afternoon Beach Wave";

  return (
    <ImageBackground
      source={require("../assets/bg.png")}
      style={styles.bg}
      resizeMode="cover"
    >
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={26} color="#111827" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Meditation</Text>

        <View style={styles.headerIconRight}>
          <Ionicons name="person-circle-outline" size={28} color="#1F2933" />
        </View>
      </View>

      {/* Bildkarte */}
      <View style={styles.card}>
        <Image
          source={require("../assets/relax.png")}
          style={styles.heroImage}
          resizeMode="cover"
        />

        <View style={styles.cardContent}>
          <Text style={styles.trackTitle}>{trackTitle}</Text>
          <Text style={styles.trackSubtitle}>Geführte Audio-Meditation</Text>

          {/* Fake-Waveform / Equalizer */}
          <View style={styles.waveform}>
            {Array.from({ length: 24 }).map((_, i) => (
              <View
                key={i}
                style={[
                  styles.waveBar,
                  { height: 8 + ((i * 7) % 40) }, // einfache Variation
                ]}
              />
            ))}
          </View>

          {/* Play-Knopf */}
          <View style={styles.controlsRow}>
            <Ionicons name="volume-low-outline" size={26} color="#6B7280" />
            <TouchableOpacity style={styles.playCircle} activeOpacity={0.9}>
              <Ionicons name="play" size={32} color="#fff" />
            </TouchableOpacity>
            <Ionicons name="timer-outline" size={26} color="#6B7280" />
          </View>

          <Text style={styles.lengthText}>10:24 · ruhige Stimme · Meerklänge</Text>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },
  headerIconRight: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    marginTop: 30,
    borderRadius: 26,
    backgroundColor: "rgba(255,255,255,0.96)",
    overflow: "hidden",
  },
  heroImage: {
    width: "100%",
    height: 200,
  },
  cardContent: {
    paddingHorizontal: 18,
    paddingVertical: 16,
    alignItems: "center",
  },
  trackTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },
  trackSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: "#6B7280",
  },

  waveform: {
    marginTop: 18,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    width: "100%",
  },
  waveBar: {
    width: 6,
    borderRadius: 3,
    backgroundColor: "#9E86B9",
  },

  controlsRow: {
    marginTop: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "70%",
  },
  playCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#9E86B9",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  lengthText: {
    marginTop: 14,
    fontSize: 12,
    color: "#6B7280",
  },
});