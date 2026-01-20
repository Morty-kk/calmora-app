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
    ein: "#A7C7F1", // blue
    halten: "#F7EFAE", // yellow
    aus: "#D8B7E8", // purple
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
        {/* Header mit Back-Button */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={22} color="#111827" />
          </TouchableOpacity>

          <Text style={styles.title}>{exercise.title}</Text>
        </View>

        {/* Inhalt zentriert */}
        <View style={styles.content}>
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
            <Text style={styles.phaseText}>
              {phase === "einatmen" && "atme ein"}
              {phase === "halten" && "halte"}
              {phase === "ausatmen" && "atme aus"}
            </Text>
            <Text style={styles.time}>{counter}s</Text>
          </Animated.View>

          <View style={styles.buttons}>
            <TouchableOpacity style={styles.startBtn} onPress={startExercise}>
              <Text style={styles.btnTextWhite}>Start</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.pauseBtn}
              onPress={() => setRunning(false)}
            >
              <Text style={styles.btnTextWhite}>Pause</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.endBtn} onPress={endExercise}>
              <Text style={styles.btnTextWhite}>Beenden</Text>
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
  },

  /* HEADER */
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 20,
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.9)",
  },
  title: { fontSize: 24, fontWeight: "600", color: "#111827" },

  /* CONTENT */
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  circle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 4,
    borderColor: "#9E86B9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },

  phaseText: { fontSize: 20, fontWeight: "500", marginBottom: 6 },
  time: { fontSize: 36, fontWeight: "800" },

  buttons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },

  startBtn: {
    backgroundColor: "#9E86B9",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  pauseBtn: {
    backgroundColor: "#C7AECF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  endBtn: {
    backgroundColor: "#E57373",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },

  btnTextWhite: { color: "white", fontSize: 15, fontWeight: "600" },
});