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

export default function Bodyscan() {
  const steps = [
    { title: "Bodyscan • Kopf", text: "Entspanne deine Stirn, Augen und deinen Kiefer." },
    { title: "Nacken & Schultern", text: "Lass die Spannung in deinem Nacken und deinen Schultern los." },
    { title: "Brust & Atmung", text: "Spüre, wie sich deine Brust mit jedem Atemzug hebt und senkt." },
    { title: "Bauch", text: "Lass deinen Bauch weich werden und entspannter werden." },
    { title: "Beine", text: "Spüre das Gewicht deiner Beine, wie sie den Boden berühren." },
    { title: "Füße", text: "Spüre die Temperatur der Füße und den Kontakt zum Boden." },
    { title: "Geschafft!", text: "Du hast den Bodyscan beendet. Gut gemacht!" },
  ];

  const [index, setIndex] = useState(0);

  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(10)).current;

  const animateIn = () => {
    fade.setValue(0);
    slide.setValue(10);
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(slide, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start();
  };

  useEffect(() => {
    animateIn();
  }, [index]);

  const next = () => {
    if (index < steps.length - 1) setIndex(index + 1);
    else router.back();
  };

  const s = steps[index];

  return (
    <ImageBackground
      source={require("../assets/bg.png")}
      style={styles.bg}
      resizeMode="cover"
    >
      <View style={styles.container}>

        {/* Progress Dots */}
        <View style={styles.dotsContainer}>
          {steps.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === index && styles.activeDot]}
            />
          ))}
        </View>

        {/* Animated Content */}
        <Animated.View
          style={{
            opacity: fade,
            transform: [{ translateY: slide }],
            alignItems: "center",
          }}
        >
          <Text style={styles.title}>{s.title}</Text>
          <Text style={styles.text}>{s.text}</Text>

          {/* Buttons */}
          {index < steps.length - 1 ? (
            <TouchableOpacity style={styles.btn} onPress={next}>
              <Text style={styles.btnText}>Weiter</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.endBtn} onPress={() => router.back()}>
              <Text style={styles.endBtnText}>Beenden</Text>
            </TouchableOpacity>
          )}
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
    paddingHorizontal: 24,
    alignItems: "center",
  },

  // Progress Dots
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

  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#333",
    textAlign: "center",
    marginBottom: 16,
  },
  text: {
    fontSize: 18,
   color: "#222",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 26,
  },

  btn: {
    backgroundColor: "#9E86B9",
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 14,
  },
  btnText: { color: "white", fontWeight: "700", fontSize: 16 },

  endBtn: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#9E86B9",
  },
  endBtnText: {
    color: "#9E86B9",
    fontWeight: "800",
    fontSize: 18,
  },
});

