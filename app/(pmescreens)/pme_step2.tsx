import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const ORANGE = "#F28C3A";

export default function PMEStep2() {
  const [time, setTime] = useState(30);
  const [running, setRunning] = useState(false);

  let timer: any = null;

  useEffect(() => {
    if (running && time > 0) {
      timer = setTimeout(() => {
        setTime((t) => t - 1);
      }, 1000);
    }

    return () => clearTimeout(timer);
  }, [running, time]);

  return (
    <View style={styles.container}>
      
      {/* زر الرجوع */}
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={30} color="#555" />
      </TouchableOpacity>

      <Text style={styles.header}>Schultern</Text>
      <Text style={styles.subtitle}>
        Ziehe deine Schultern nach oben und halte die Spannung
      </Text>

      {/* الدائرة */}
      <View style={styles.circle}>
        <Text style={styles.timerText}>{time}</Text>
      </View>

      {/* الصورة */}
      <Image
        source={require("../../assets/relax.png")}
        resizeMode="contain"
        style={styles.image}
      />

      {/* الأزرار */}
      <View style={styles.btnRow}>

        {/* بدء */}
        <TouchableOpacity
          style={styles.startBtn}
          onPress={() => setRunning(true)}
        >
          <Text style={styles.btnText}>Start</Text>
        </TouchableOpacity>

        {/* توقف */}
        <TouchableOpacity
          style={styles.stopBtn}
          onPress={() => setRunning(false)}
        >
          <Text style={styles.btnText}>Stopp</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4EDE8", padding: 20, alignItems: "center" },

  backBtn: {
    position: "absolute",
    top: 40,
    left: 20,
  },

  header: {
    marginTop: 60,
    fontSize: 26,
    fontWeight: "800",
    color: "#D17842",
  },

  subtitle: {
    fontSize: 16,
    marginTop: 4,
    marginBottom: 20,
    textAlign: "center",
  },

  circle: {
    width: 210,
    height: 210,
    borderRadius: 200,
    borderWidth: 12,
    borderColor: ORANGE,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  timerText: {
    fontSize: 40,
    fontWeight: "800",
  },

  image: {
    width: 250,
    height: 250,
    marginBottom: 30,
  },

  btnRow: {
    flexDirection: "row",
    gap: 20,
  },

  startBtn: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 12,
  },

  stopBtn: {
    backgroundColor: "#E57373",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 12,
  },

  btnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
});


