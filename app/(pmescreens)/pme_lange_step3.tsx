// app/(pmescreens)/pme_lange_step3.tsx

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const ORANGE = "#F28C3A";

export default function PMELangeStep3() {
  const [time, setTime] = useState(45);
  const [running, setRunning] = useState(false);

  // Countdown
  useEffect(() => {
    if (!running || time <= 0) return;

    const id = setTimeout(() => {
      setTime((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearTimeout(id);
  }, [running, time]);

  const handleStartStop = () => {
    if (running) {
      setRunning(false);
    } else {
      if (time === 0) setTime(30);
      setRunning(true);
    }
  };

  const handleNext = () => {
    setRunning(false);
    router.push("/pme_lange_step4"); // الخطوة الرابعة
  };

  return (
    <ImageBackground
      source={require("../../assets/Home_Design.jpg")}
      style={styles.bg}
      resizeMode="cover"
    >
      <View style={styles.container}>

        {/* BACK */}
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={32} color="#fff" />
        </TouchableOpacity>

        {/* TEXTS */}
        <Text style={styles.header}>Gesicht</Text>
        <Text style={styles.subtitle}>
          Spanne deine Gesichtsmuskeln an und halte die Spannung
        </Text>

        {/* TIMER */}
        <View style={styles.circle}>
          <View style={styles.innerCircle}>
            <Text style={styles.timerText}>{time}</Text>
          </View>
        </View>

        {/* IMAGE */}
        <Image
          source={require("../../assets/relax.png")}
          resizeMode="contain"
          style={styles.image}
        />

        {/* BUTTONS */}
        <View style={styles.buttonsRow}>
          {/* START / STOP */}
          <TouchableOpacity style={styles.primaryBtn} onPress={handleStartStop}>
            <Text style={styles.primaryBtnText}>
              {running ? "Stopp" : "Start"}
            </Text>
          </TouchableOpacity>

          {/* WEITER */}
          <TouchableOpacity style={styles.secondaryBtn} onPress={handleNext}>
            <Text style={styles.secondaryBtnText}>Weiter</Text>
          </TouchableOpacity>
        </View>

      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },

  container: {
    flex: 1,
    paddingTop: 60,
    alignItems: "center",
  },

  backBtn: {
    position: "absolute",
    top: 40,
    left: 20,
    padding: 6,
  },

  header: {
    fontSize: 26,
    fontWeight: "700",
    color: "#D17842", // نفس البرتقاني تبع kurz
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
    paddingHorizontal: 20,
    color: "#222", // أسود
  },

  circle: {
    width: 220,
    height: 220,
    borderRadius: 220,
    borderWidth: 12,
    borderColor: ORANGE,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffffcc",
  },

  innerCircle: {
    width: 170,
    height: 170,
    borderRadius: 170,
    justifyContent: "center",
    alignItems: "center",
  },

  timerText: {
    fontSize: 44,
    fontWeight: "800",
    color: "#222",
  },

  image: {
    width: 260,
    height: 260,
    marginTop: 30,
  },

  buttonsRow: {
    flexDirection: "row",
    marginTop: 30,
    gap: 16,
  },

  primaryBtn: {
    backgroundColor: ORANGE,
    paddingHorizontal: 28,
    paddingVertical: 10,
    borderRadius: 24,
  },
  primaryBtnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },

  secondaryBtn: {
    backgroundColor: "#ffffffcc",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: ORANGE,
  },
  secondaryBtnText: {
    color: ORANGE,
    fontSize: 18,
    fontWeight: "700",
  },
});
