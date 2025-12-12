import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function SinnesCheck() {
  const blocks = [
    { title: "Block 1 • Sehen", text: "Nenne 3 Dinge, die du gerade siehst", buttons: ["Next"] },
    { title: "Block 2 • Hören", text: "Nenne 2 Geräusche um dich herum", buttons: ["Next"] },
    { title: "Block 3 • Fühlen", text: "Wie fühlt sich dein Körper an?", buttons: ["Kalt", "Warm"] },
    { title: "Block 4 • Riechen", text: "Erkenne 1 Geruch", buttons: ["Next"] },
    { title: "Block 5 • Schmecken", text: "Wie schmeckt dein Mund gerade?", buttons: ["Frisch", "Neutral", "Trocken"] },
  ];

  const [step, setStep] = useState(0);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 350,
      useNativeDriver: true,
    }).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.12, duration: 1200, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 1200, useNativeDriver: true }),
      ])
    ).start();
  }, [step]);

  const next = () => {
    fadeAnim.setValue(0);
    if (step < blocks.length - 1) setStep(step + 1);
    else router.push("/achtsamkeit-5sinne_done"); // ← صفحة النهاية
  };

  const b = blocks[step];

  return (
    <ImageBackground
      source={require("../assets/bg.png")}
      style={styles.bg}
      resizeMode="cover"
    >
      <View style={styles.container}>

        {/* Progress dots */}
        <View style={styles.dotsContainer}>
          {blocks.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === step && styles.activeDot]}
            />
          ))}
        </View>

        {/* Pulse circle */}
        <Animated.View
          style={[styles.circle, { transform: [{ scale: pulse }] }]}
        />

        {/* Animated content */}
        <Animated.View style={{ opacity: fadeAnim }}>
          <Text style={styles.blockTitle}>{b.title}</Text>
          <Text style={styles.blockText}>{b.text}</Text>

          <View style={styles.btnContainer}>
            {b.buttons.map((label, i) => (
              <TouchableOpacity key={i} style={styles.button} onPress={next}>
                <Text style={styles.btnText}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },

  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  dotsContainer: {
    flexDirection: "row",
    position: "absolute",
    top: 60,
    gap: 8,
  },

  dot: {
    width: 10,
    height: 10,
    borderRadius: 50,
    backgroundColor: "#ffffff70",
  },

  activeDot: {
    width: 12,
    height: 12,
    backgroundColor: "#fff",
  },

  circle: {
    width: 260,
    height: 260,
    borderRadius: 200,
    backgroundColor: "rgba(255,255,255,0.25)",
    position: "absolute",
    top: "32%",
  },

  blockTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#3B3B3B",
    textAlign: "center",
    marginBottom: 20,
  },

  blockText: {
    fontSize: 20,
    color: "#222",
    textAlign: "center",
    marginBottom: 40,
    paddingHorizontal: 20,
  },

  btnContainer: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "center",
  },

  button: {
    backgroundColor: "#9E86B9",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    minWidth: 110,
    alignItems: "center",
  },

  btnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});



