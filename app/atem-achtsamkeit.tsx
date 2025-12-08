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

export default function AtemAchtsamkeit() {
  const scale = useRef(new Animated.Value(1)).current;
  const progress = useRef(new Animated.Value(0)).current;

  const phases = [
    { label: "Einatmen", duration: 4, scale: 1.35 },
    { label: "Halten", duration: 4, scale: 1.35 },
    { label: "Ausatmen", duration: 6, scale: 1.0 },
  ];

  const totalDuration = phases.reduce((sum, p) => sum + p.duration, 0);

  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [count, setCount] = useState(phases[0].duration);

  const current = phases[step];

  useEffect(() => {
    if (!started) return;

    // animate circle
    Animated.timing(scale, {
      toValue: current.scale,
      duration: current.duration * 1000,
      useNativeDriver: true,
    }).start();

    // animate progress bar
    Animated.timing(progress, {
      toValue: (step + 1) / phases.length,
      duration: current.duration * 1000,
      useNativeDriver: false,
    }).start();

    // countdown
    let sec = current.duration;
    const interval = setInterval(() => {
      sec--;
      setCount(sec);

      if (sec === 0) {
        clearInterval(interval);

        // next phase
        if (step < phases.length - 1) {
          setStep(step + 1);
        } else {
          // restart the loop
          setStep(0);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [step, started]);

  return (
    <ImageBackground
      source={require("../assets/bg.png")}
      style={styles.bg}
      resizeMode="cover"
    >
      <View style={styles.container}>
        {!started ? (
          <>
            <Text style={styles.title}>Atem-Übung</Text>
            <Text style={styles.subtitle}>
              Folge dem Rhythmus und entspanne dich.
            </Text>

            <TouchableOpacity
              style={styles.startBtn}
              onPress={() => setStarted(true)}
            >
              <Text style={styles.startText}>Start</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            {/* Breathing Circle */}
            <Animated.View
              style={[styles.circle, { transform: [{ scale }] }]}
            />

            {/* Phase Text */}
            <Text style={styles.phase}>{current.label}</Text>

            {/* Counter */}
            <Text style={styles.counter}>{count}</Text>

            {/* Progress Bar */}
            <View style={styles.progressBarBg}>
              <Animated.View
                style={[
                  styles.progressBar,
                  {
                    width: progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["0%", "100%"],
                    }),
                  },
                ]}
              />
            </View>

            {/* Quit Button */}
            <TouchableOpacity
              style={styles.endBtn}
              onPress={() => router.back()}
            >
              <Text style={styles.endText}>Beenden</Text>
            </TouchableOpacity>
          </>
        )}
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
    gap: 20,
    paddingHorizontal: 20,
  },

  /* Start screen */
  title: {
    fontSize: 34,
    fontWeight: "800",
    color: "#4C3F72",
  },
  subtitle: {
    fontSize: 18,
    color: "#444",
    textAlign: "center",
    marginBottom: 30,
  },
  startBtn: {
    backgroundColor: "#9E86B9",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 16,
  },
  startText: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
  },

  /* Circle */
  circle: {
    width: 220,
    height: 220,
    borderRadius: 200,
    backgroundColor: "rgba(158,134,185,0.18)",
    borderWidth: 4,
    borderColor: "#9E86B9",
  },

  /* Phase */
  phase: {
    fontSize: 32,
    fontWeight: "700",
    color: "#3B2F4A",
    marginTop: 10,
  },

  /* Counter */
  counter: {
    fontSize: 52,
    fontWeight: "900",
    color: "#9E86B9",
    marginBottom: 10,
  },

  /* Progress Bar */
  progressBarBg: {
    width: "80%",
    height: 8,
    backgroundColor: "#EADFF2",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 20,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#9E86B9",
  },

  /* End Button */
  endBtn: {
    marginTop: 20,
    backgroundColor: "white",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#9E86B9",
  },
  endText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#9E86B9",
  },
});




