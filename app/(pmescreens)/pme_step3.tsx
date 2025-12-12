// app/(pmescreens)/pme_step3.tsx
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
const isSmallScreen = width < 400;

export default function PMEStep3() {
  const [time, setTime] = useState(30);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;

    if (time <= 0) {
      setRunning(false);
      router.push("/pme_done"); // ⬅️ لما يخلص التايمر يروح لصفحة النهاية
      return;
    }

    const id = setTimeout(() => setTime((prev) => prev - 1), 1000);

    return () => clearTimeout(id);
  }, [running, time]);

  const handleStartStop = () => {
    if (running) setRunning(false);
    else {
      if (time === 0) setTime(30);
      setRunning(true);
    }
  };

  const finish = () => {
    router.push("/pme_done"); // ⬅️ زر Fertig
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
          <Ionicons name="arrow-back" size={28} color="#555" />
        </TouchableOpacity>

        <Text style={styles.header}>Gesicht</Text>
        <Text style={styles.subtitle}>
          Spanne deine Gesichtsmuskeln an und halte die Spannung
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
          
          {/* START / STOP */}
          <TouchableOpacity style={styles.primaryBtn} onPress={handleStartStop}>
            <Text style={styles.primaryBtnText}>
              {running ? "Stopp" : "Start"}
            </Text>
          </TouchableOpacity>

          {/* FERTIG */}
          <TouchableOpacity style={styles.secondaryBtn} onPress={finish}>
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
    paddingTop: 45,
    alignItems: "center",
  },

  backBtn: {
    position: "absolute",
    top: 30,
    left: 20,
  },

  header: {
    fontSize: 24,
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

  /* TIMER */
  circle: {
    width: 220,
    height: 220,
    borderRadius: 200,
    borderWidth: 10,
    borderColor: ORANGE,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffffaa",
  },

  circleSmall: {
    width: 160,
    height: 160,
    borderWidth: 8,
  },

  innerCircle: {
    width: 170,
    height: 170,
    borderRadius: 150,
    justifyContent: "center",
    alignItems: "center",
  },

  innerCircleSmall: {
    width: 120,
    height: 120,
  },

  timerText: {
    fontSize: 40,
    fontWeight: "800",
    color: "#222",
  },

  timerTextSmall: {
    fontSize: 32,
  },

  image: {
    width: 240,
    height: 240,
    marginTop: 25,
  },

  imageSmall: {
    width: 150,
    height: 150,
  },

  buttonsRow: {
    flexDirection: "row",
    marginTop: 30,
    gap: 16,
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




