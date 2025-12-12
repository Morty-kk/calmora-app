// app/(pmescreens)/pme_step2.tsx
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

const { width } = Dimensions.get("window");
const isSmallScreen = width < 400; // ⬅ موبايل

export default function PMEStep2() {
  const [time, setTime] = useState(30);
  const [running, setRunning] = useState(false);

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
    router.push("/pme_step3");
  };

  return (
    <ImageBackground
      source={require("../../assets/Home_Design.jpg")}
      style={styles.bg}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={28} color="#555" />
        </TouchableOpacity>

        <Text style={styles.header}>Schultern</Text>
        <Text style={styles.subtitle}>
          Ziehe deine Schultern nach oben und halte die Spannung
        </Text>

        {/* TIMER CIRCLE — Responsive */}
        <View style={[styles.circle, isSmallScreen && styles.circleSmall]}>
          <View
            style={[
              styles.innerCircle,
              isSmallScreen && styles.innerCircleSmall,
            ]}
          >
            <Text style={styles.timerText}>{time}</Text>
          </View>
        </View>

        {/* IMAGE — Responsive */}
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

          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => router.back()}
          >
            <Text style={styles.secondaryBtnText}>Zurück</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryBtn} onPress={handleNext}>
            <Text style={styles.secondaryBtnText}>Weiter</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },

  container: {
    flex: 1,
    paddingTop: 50,
    alignItems: "center",
  },

  backBtn: {
    position: "absolute",
    top: 30,
    left: 20,
  },

  header: {
    fontSize: 22,
    fontWeight: "700",
    color: "#D17842",
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
    paddingHorizontal: 20,
  },

  /* دائرة التايمر */
  circle: {
    width: 220,
    height: 220,
    borderRadius: 220,
    borderWidth: 12,
    borderColor: ORANGE,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffffaa",
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
    fontSize: 40,
    fontWeight: "800",
    color: "#222",
  },

  /* الصورة */
  image: {
    width: 260,
    height: 260,
    marginTop: 30,
  },
  imageSmall: {
    width: 160,
    height: 160,
    marginTop: 20,
  },

  buttonsRow: {
    flexDirection: "row",
    marginTop: 30,
    gap: 10,
  },

  primaryBtn: {
    backgroundColor: ORANGE,
    paddingHorizontal: 26,
    paddingVertical: 10,
    borderRadius: 24,
  },

  primaryBtnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },

  secondaryBtn: {
    backgroundColor: "#ffffffdd",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: ORANGE,
  },

  secondaryBtnText: {
    color: ORANGE,
    fontSize: 16,
    fontWeight: "700",
  },
});










