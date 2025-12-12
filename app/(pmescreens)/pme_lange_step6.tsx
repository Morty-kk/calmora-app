// app/(pmescreens)/pme_lange_step6.tsx
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const ORANGE = "#F28C3A";

// 🔥 Detect small mobile screens
const { width } = Dimensions.get("window");
const isSmallScreen = width < 400;

export default function PMELangeStep6() {
  const [time, setTime] = useState(45);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running || time <= 0) return;

    const id = setTimeout(() => {
      setTime((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearTimeout(id);
  }, [running, time]);

  const handleStartStop = () => {
    if (running) setRunning(false);
    else {
      if (time === 0) setTime(45);
      setRunning(true);
    }
  };

  const handleFinish = () => {
    setRunning(false);
    router.push("/pme_lange_done");
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

        {/* TITLE */}
        <Text style={styles.header}>Beine & Füße</Text>
        <Text style={styles.subtitle}>
          Spanne deine Beine und Füße fest an und halte die Spannung
        </Text>

        {/* TIMER CIRCLE */}
        <View style={[styles.circle, isSmallScreen && styles.circleSmall]}>
          <View style={[styles.innerCircle, isSmallScreen && styles.innerCircleSmall]}>
            <Text style={[styles.timerText, isSmallScreen && styles.timerTextSmall]}>
              {time}
            </Text>
          </View>
        </View>

        {/* IMAGE */}
        <Image
          source={require("../../assets/relax.png")}
          resizeMode="contain"
          style={[styles.image, isSmallScreen && styles.imageSmall]}
        />

        {/* BUTTONS */}
        <View style={styles.buttonsRow}>

          <TouchableOpacity style={styles.primaryBtn} onPress={handleStartStop}>
            <Text style={styles.primaryBtnText}>
              {running ? "Stopp" : "Start"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryBtn} onPress={handleFinish}>
            <Text style={styles.secondaryBtnText}>Fertig</Text>
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
    color: ORANGE,
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
    paddingHorizontal: 20,
    color: "#000",
  },

  /* TIMER */
  circle: {
    width: 220,
    height: 220,
    borderRadius: 220,
    borderWidth: 12,
    borderColor: ORANGE,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffffbb",
  },

  circleSmall: {
    width: 160,
    height: 160,
    borderRadius: 160,
    borderWidth: 8,
  },

  innerCircle: {
    width: 170,
    height: 170,
    borderRadius: 170,
    justifyContent: "center",
    alignItems: "center",
  },

  innerCircleSmall: {
    width: 120,
    height: 120,
    borderRadius: 120,
  },

  timerText: {
    fontSize: 44,
    fontWeight: "800",
    color: "#222",
  },

  timerTextSmall: {
    fontSize: 34,
  },

  /* IMAGE */
  image: {
    width: 260,
    height: 260,
    marginTop: 30,
  },

  imageSmall: {
    width: 150,
    height: 150,
    marginTop: 20,
  },

  /* BUTTONS */
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
