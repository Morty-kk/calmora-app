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

  // Fade animation
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Pulse circle animation
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
    else router.back();
  };

  const b = blocks[step];

  return (
    <ImageBackground
      source={require("../assets/bg.png")}
      style={styles.bg}
      resizeMode="cover"
    >
      <View style={styles.container}>

        {/* Progress Dots */}
        <View style={styles.dotsContainer}>
          {blocks.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === step && styles.activeDot]}
            />
          ))}
        </View>

        {/* Pulse Circle */}
        <Animated.View
          style={[
            styles.circle,
            { transform: [{ scale: pulse }] },
          ]}
        />

        {/* Animated Content */}
        <Animated.View style={{ opacity: fadeAnim }}>
          <Text style={styles.blockTitle}>{b.title}</Text>
          <Text style={styles.blockText}>{b.text}</Text>

          <View style={styles.btnContainer}>
            {b.buttons.map((label, i) => (
              <TouchableOpacity
                key={i}
                style={styles.button}
                onPress={next}
              >
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
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  // Progress dots
  dotsContainer: {
    flexDirection: "row",
    position: "absolute",
    top: 60,
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    backgroundColor: "#ffffff70",
    borderRadius: 50,
  },
  activeDot: {
    backgroundColor: "#fff",
    width: 12,
    height: 12,
  },

  // Pulse circle
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
    paddingHorizontal: 16,
  },

  btnContainer: { flexDirection: "row", justifyContent: "center", gap: 12 },
  button: {
    backgroundColor: "#9E86B9",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    minWidth: 100,
    alignItems: "center",
  },
  btnText: { color: "white", fontWeight: "700", fontSize: 16 },
});


