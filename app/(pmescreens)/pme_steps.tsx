// app/(pmescreens)/pme_steps.tsx
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

export default function PMESteps() {
  const [time, setTime] = useState(30);
  const [running, setRunning] = useState(false);

  // كل ثانية نقص 1 طالما running = true
  useEffect(() => {
    if (!running) return;
    if (time <= 0) return;

    const id = setTimeout(() => {
      setTime((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    // تنظيف التايمر إذا تغيّر الشي أو طلعت من الشاشة
    return () => clearTimeout(id);
  }, [running, time]);

  const handleStartStop = () => {
    if (running) {
      // إيقاف
      setRunning(false);
    } else {
      // تشغيل (ولو كان 0 رجّعو لـ 30)
      if (time === 0) setTime(30);
      setRunning(true);
    }
  };

  const handleNext = () => {
    // روح للخطوة الثانية
    setRunning(false);
    router.push("/pme_step2");
  };

  return (
    <ImageBackground
      //source={require("../../assets/relax.png")}
      style={styles.bg}
      resizeMode="cover"
    >
      <View style={styles.container}>
        {/* Back */}
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={30} color="#555" />
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.header}>Hände & Unterarme</Text>
        <Text style={styles.subtitle}>Balle deine Hände zu Fäusten</Text>

        {/* Timer circle */}
        <View style={styles.circle}>
          <View style={styles.innerCircle}>
            <Text style={styles.timerText}>{time}</Text>
          </View>
        </View>

        {/* Image */}
        <Image
          source={require("../../assets/relax.png")}
          resizeMode="contain"
          style={styles.image}
        />

        {/* Buttons: Start/Stopp + Weiter */}
        <View style={styles.buttonsRow}>
          <TouchableOpacity style={styles.primaryBtn} onPress={handleStartStop}>
            <Text style={styles.primaryBtnText}>
              {running ? "Stopp" : "Start"}
            </Text>
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
  },
  header: {
    fontSize: 24,
    fontWeight: "700",
    color: "#D17842",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
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
    backgroundColor: "#F28C3A",
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
    backgroundColor: "#ffffffdd",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#F28C3A",
  },
  secondaryBtnText: {
    color: "#F28C3A",
    fontSize: 18,
    fontWeight: "700",
  },
});







