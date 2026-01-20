import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
    Animated,
    ImageBackground,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

const BREATH_PHASE_DURATION = 4;      // Sekunden pro Phase (ein / aus)
const TOTAL_RELAX_SECONDS = 100;      // „Noch 100 s bis …“

export default function PanicScreen() {
  const [isRunning, setIsRunning] = useState(false);
  const [phase, setPhase] = useState<"ein" | "aus">("ein");
  const [phaseRemaining, setPhaseRemaining] = useState(BREATH_PHASE_DURATION);
  const [totalRemaining, setTotalRemaining] = useState(TOTAL_RELAX_SECONDS);

  const scale = useRef(new Animated.Value(1)).current;
  const intervalRef = useRef<number | null>(null);

  // Kreis-Animation
  useEffect(() => {
    if (isRunning) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scale, {
            toValue: 1.1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      scale.stopAnimation();
      scale.setValue(1);
    }
  }, [isRunning, scale]);

  // Timer-Logik
  useEffect(() => {
    if (isRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current);

      intervalRef.current = setInterval(() => {
        setPhaseRemaining((prev) => {
          if (prev > 1) return prev - 1;

          // Phase wechseln
          setPhase((old) => (old === "ein" ? "aus" : "ein"));
          return BREATH_PHASE_DURATION;
        });

        setTotalRemaining((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const handleStart = () => {
    if (totalRemaining === 0) {
      // Neu starten
      setTotalRemaining(TOTAL_RELAX_SECONDS);
      setPhase("ein");
      setPhaseRemaining(BREATH_PHASE_DURATION);
    }
    setIsRunning(true);
  };

  const handlePause = () => setIsRunning(false);

  const phaseText = phase === "ein" ? "atme ein" : "atme aus";

  return (
    <ImageBackground
      source={require("../assets/bg.png")}
      style={styles.bg}
      resizeMode="cover"
    >
      <View style={styles.wrap}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={22} color="#111827" />
          </Pressable>

          <Pressable>
            <Ionicons name="resize-outline" size={22} color="#111827" />
          </Pressable>
        </View>

        {/* Beruhigungstext */}
        <Text style={styles.headline}>
          Alles ist okay. Konzentriere dich auf deinen Atem.
        </Text>

        {/* Atmungskreis */}
        <View style={styles.center}>
          <View style={styles.outerCircle}>
            <View style={styles.middleCircle}>
              <Animated.View
                style={[styles.innerCircle, { transform: [{ scale }] }]}
              >
                <Text style={styles.breathText}>{phaseText}</Text>
                <Text style={styles.breathSeconds}>{phaseRemaining}s</Text>
              </Animated.View>
            </View>
          </View>
        </View>

        {/* Start / Pause */}
        <View style={styles.controlsRow}>
          <Pressable style={styles.controlBtn} onPress={handleStart}>
            <Text style={styles.controlText}>Start</Text>
          </Pressable>
          <Pressable style={styles.controlBtn} onPress={handlePause}>
            <Text style={styles.controlText}>Pause</Text>
          </Pressable>
        </View>

        {/* Restzeit */}
        <Text style={styles.remainingText}>
          {totalRemaining > 0
            ? `Noch ${totalRemaining} s bis zur vollständigen Beruhigung`
            : "Gut gemacht. Du hast die Übung geschafft."}
        </Text>

        {/* Weitere Hilfe */}
        <Pressable
          style={styles.helpBtn}
          onPress={() => router.push("/chat")}
        >
          <Text style={styles.helpText}>Ich brauche weitere Hilfe</Text>
        </Pressable>
      </View>
    </ImageBackground>
  );
}

const CIRCLE_SIZE = 220;

const styles = StyleSheet.create({
  bg: { flex: 1 },
  wrap: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headline: {
    marginTop: 20,
    fontSize: 16,
    textAlign: "center",
    color: "#111827",
    fontWeight: "600",
  },
  center: {
    marginTop: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  outerCircle: {
    width: CIRCLE_SIZE + 40,
    height: CIRCLE_SIZE + 40,
    borderRadius: (CIRCLE_SIZE + 40) / 2,
    borderWidth: 2,
    borderColor: "rgba(148, 163, 184, 0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  middleCircle: {
    width: CIRCLE_SIZE + 10,
    height: CIRCLE_SIZE + 10,
    borderRadius: (CIRCLE_SIZE + 10) / 2,
    borderWidth: 2,
    borderColor: "rgba(148, 163, 184, 0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  innerCircle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    alignItems: "center",
    justifyContent: "center",
  },
  breathText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  breathSeconds: {
    marginTop: 4,
    fontSize: 16,
    color: "#6B7280",
  },

  controlsRow: {
    marginTop: 32,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  controlBtn: {
    minWidth: 120,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: "#FFE5D6",
    alignItems: "center",
  },
  controlText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },

  remainingText: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 14,
    color: "#374151",
  },

  helpBtn: {
    marginTop: 24,
    alignSelf: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 18,
    backgroundColor: "#F97373",
  },
  helpText: {
    color: "#111827",
    fontWeight: "700",
    fontSize: 14,
  },
});