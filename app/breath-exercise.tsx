import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from "react-native";

export default function BreathExercise() {
  const { id } = useLocalSearchParams();

  // Atemmuster
  const patterns: any = {
    "446": { title: "4-4-6 Atmung", in: 4, hold: 4, out: 6 },
    "478": { title: "4-7-8 Atmung", in: 4, hold: 7, out: 8 },
    "444": { title: "4-4-4 Box Breathing", in: 4, hold: 4, out: 4 },
    "366": { title: "3-6-6 Atmung", in: 3, hold: 6, out: 6 },
  };

  const exercise = patterns[id as string];

  const [phase, setPhase] = useState("einatmen"); // ein → halten → aus
  const [counter, setCounter] = useState(exercise.in);
  const [running, setRunning] = useState(false);

  // Animation scale
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Animation of background color
  const colorAnim = useRef(new Animated.Value(0)).current;

  // Colors for phases
  const colors = {
    ein: "#9E86B9", // purple
    halten: "#FBBF24", // amber
    aus: "#A78BFA", // purple
  };

  const animateBreath = (toValue: number, duration: number) => {
    Animated.timing(scaleAnim, {
      toValue,
      duration: duration * 1000,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const animateColor = (phase: string, duration: number) => {
    let toValue = phase === "einatmen" ? 0 : phase === "halten" ? 1 : 2;

    Animated.timing(colorAnim, {
      toValue,
      duration: duration * 1000,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start();
  };

  // Interpolate circle background color
  const bgColor = colorAnim.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [colors.ein, colors.halten, colors.aus],
  });

  // Timer Logic
  useEffect(() => {
    let timer: any;

    if (running && counter > 0) {
      timer = setTimeout(() => setCounter(counter - 1), 1000);
    }

    if (running && counter === 0) {
      if (phase === "einatmen") {
        setPhase("halten");
        setCounter(exercise.hold);
        Vibration.vibrate(60);

        animateColor("halten", exercise.hold);
      } else if (phase === "halten") {
        setPhase("ausatmen");
        setCounter(exercise.out);

        animateBreath(0.7, exercise.out);
        animateColor("aus", exercise.out);
      } else {
        setPhase("einatmen");
        setCounter(exercise.in);

        animateBreath(1.2, exercise.in);
        animateColor("einatmen", exercise.in);
      }
    }

    return () => clearTimeout(timer);
  }, [running, counter]);

  const startExercise = () => {
    setRunning(true);
    setPhase("einatmen");
    setCounter(exercise.in);
    animateBreath(1.2, exercise.in);
    animateColor("einatmen", exercise.in);
  };

  const endExercise = () => {
    setRunning(false);
    router.back(); // zurück zur vorherigen Seite
  };

  return (
    <ImageBackground
      source={require("../assets/bg.png")}
      style={styles.bg}
      resizeMode="cover"
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.push("/breath")}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={24} color="#111827" />
          </TouchableOpacity>

          <View style={styles.titleContainer}>
            <Text style={styles.title}>{exercise.title}</Text>
            <Text style={styles.subtitle}>
              {phase === "einatmen" && "Atme ruhig und tief ein"}
              {phase === "halten" && "Halte deinen Atem"}
              {phase === "ausatmen" && "Lass langsam los"}
            </Text>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Phase Indicator */}
          <View style={styles.phaseIndicator}>
            <Text style={styles.phaseLabel}>
              {phase === "einatmen" && "Einatmen"}
              {phase === "halten" && "Halten"}
              {phase === "ausatmen" && "Ausatmen"}
            </Text>
          </View>

          {/* Animated Circle */}
          <Animated.View
            style={[
              styles.circle,
              {
                transform: [{ scale: scaleAnim }],
                backgroundColor: bgColor,
              },
            ]}
          >
            <View style={styles.circleInner}>
              <Ionicons
                name={
                  phase === "einatmen"
                    ? "arrow-down"
                    : phase === "halten"
                    ? "pause"
                    : "arrow-up"
                }
                size={48}
                color="white"
              />
              <Text style={styles.time}>{counter}</Text>
              <Text style={styles.timeUnit}>Sekunden</Text>
            </View>
          </Animated.View>

          {/* Pattern Info */}
          <View style={styles.patternInfo}>
            <View style={styles.patternItem}>
              <Ionicons name="arrow-down" size={16} color="#9E86B9" />
              <Text style={styles.patternText}>{exercise.in}s</Text>
            </View>
            <View style={styles.patternItem}>
              <Ionicons name="pause" size={16} color="#FBBF24" />
              <Text style={styles.patternText}>{exercise.hold}s</Text>
            </View>
            <View style={styles.patternItem}>
              <Ionicons name="arrow-up" size={16} color="#A78BFA" />
              <Text style={styles.patternText}>{exercise.out}s</Text>
            </View>
          </View>

          {/* Control Buttons */}
          <View style={styles.controls}>
            {!running ? (
              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={startExercise}
              >
                <Ionicons name="play" size={24} color="white" />
                <Text style={styles.primaryBtnText}>Start</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={() => setRunning(false)}
              >
                <Ionicons name="pause" size={24} color="white" />
                <Text style={styles.primaryBtnText}>Pause</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.secondaryBtn} onPress={endExercise}>
              <Ionicons name="stop" size={20} color="#EF4444" />
              <Text style={styles.secondaryBtnText}>Beenden</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },

  /* HEADER */
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.95)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },

  /* CONTENT */
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  /* PHASE INDICATOR */
  phaseIndicator: {
    backgroundColor: "rgba(255,255,255,0.95)",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
    marginBottom: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  phaseLabel: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  /* CIRCLE */
  circle: {
    width: 280,
    height: 280,
    borderRadius: 140,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  circleInner: {
    alignItems: "center",
    justifyContent: "center",
  },
  time: {
    fontSize: 72,
    fontWeight: "800",
    color: "white",
    marginTop: 8,
  },
  timeUnit: {
    fontSize: 14,
    fontWeight: "600",
    color: "rgba(255,255,255,0.9)",
    marginTop: 4,
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  /* PATTERN INFO */
  patternInfo: {
    flexDirection: "row",
    gap: 24,
    marginTop: 40,
    backgroundColor: "rgba(255,255,255,0.95)",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  patternItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  patternText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
  },

  /* CONTROLS */
  controls: {
    marginTop: 48,
    gap: 12,
    width: "100%",
    maxWidth: 300,
  },
  primaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#9E86B9",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    gap: 8,
    shadowColor: "#9E86B9",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryBtnText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
  secondaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.95)",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 16,
    gap: 8,
    borderWidth: 2,
    borderColor: "#FEE2E2",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  secondaryBtnText: {
    color: "#EF4444",
    fontSize: 16,
    fontWeight: "700",
  },
});