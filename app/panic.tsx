import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
    Animated,
    ImageBackground,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import CustomDrawer from "../components/Customrawer";

const BREATH_PHASE_DURATION = 4;      // Sekunden pro Phase (ein / aus)
const TOTAL_RELAX_SECONDS = 100;      // „Noch 100 s bis …“

export default function PanicScreen() {
  const [isRunning, setIsRunning] = useState(false);
  const [phase, setPhase] = useState<"ein" | "aus">("ein");
  const [phaseRemaining, setPhaseRemaining] = useState(BREATH_PHASE_DURATION);
  const [totalRemaining, setTotalRemaining] = useState(TOTAL_RELAX_SECONDS);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0.6)).current;
  const outerScale = useRef(new Animated.Value(1)).current;
  const rotation = useRef(new Animated.Value(0)).current;
  const glowOpacity = useRef(new Animated.Value(0.3)).current;
  const intervalRef = useRef<number | null>(null);

  // Noch bessere Kreis-Animation mit Easing und Glow-Effekt
  useEffect(() => {
    if (isRunning) {
      const breathDuration = BREATH_PHASE_DURATION * 1000; // in Millisekunden
      
      Animated.loop(
        Animated.sequence([
          // Einatmen - Kreis wird größer mit sanftem Easing
          Animated.parallel([
            Animated.timing(scale, {
              toValue: 1.4,
              duration: breathDuration,
              easing: (t) => t * (2 - t), // Ease out quad
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 1,
              duration: breathDuration,
              easing: (t) => t * (2 - t),
              useNativeDriver: true,
            }),
            Animated.timing(outerScale, {
              toValue: 1.15,
              duration: breathDuration,
              easing: (t) => t * (2 - t),
              useNativeDriver: true,
            }),
            Animated.timing(glowOpacity, {
              toValue: 0.8,
              duration: breathDuration,
              easing: (t) => t * (2 - t),
              useNativeDriver: true,
            }),
          ]),
          // Ausatmen - Kreis wird kleiner mit sanftem Easing
          Animated.parallel([
            Animated.timing(scale, {
              toValue: 1,
              duration: breathDuration,
              easing: (t) => t * t, // Ease in quad
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0.5,
              duration: breathDuration,
              easing: (t) => t * t,
              useNativeDriver: true,
            }),
            Animated.timing(outerScale, {
              toValue: 1,
              duration: breathDuration,
              easing: (t) => t * t,
              useNativeDriver: true,
            }),
            Animated.timing(glowOpacity, {
              toValue: 0.2,
              duration: breathDuration,
              easing: (t) => t * t,
              useNativeDriver: true,
            }),
          ]),
        ])
      ).start();

      // Subtile Rotation für visuellen Effekt
      Animated.loop(
        Animated.timing(rotation, {
          toValue: 1,
          duration: breathDuration * 4, // Langsame Rotation über 2 komplette Atemzyklen
          easing: (t) => t,
          useNativeDriver: true,
        })
      ).start();
    } else {
      scale.stopAnimation();
      opacity.stopAnimation();
      outerScale.stopAnimation();
      rotation.stopAnimation();
      glowOpacity.stopAnimation();
      scale.setValue(1);
      opacity.setValue(0.6);
      outerScale.setValue(1);
      rotation.setValue(0);
      glowOpacity.setValue(0.3);
    }
  }, [isRunning, scale, opacity, outerScale, rotation, glowOpacity]);

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
      <ScrollView style={styles.wrap} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push('/menu')} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#9E86B9" />
          </TouchableOpacity>
          <Text style={styles.brand}>Calmora</Text>
          <TouchableOpacity onPress={() => setDrawerOpen(true)}>
            <Ionicons name="menu" size={28} color="#9E86B9" />
          </TouchableOpacity>
        </View>

        {/* Hero Section */}
        <View style={styles.hero}>
          <View style={styles.heroIcon}>
            <Ionicons name="heart-circle" size={40} color="#EF4444" />
          </View>
          <Text style={styles.heroTitle}>Panik-Hilfe</Text>
          <Text style={styles.heroSubtitle}>
            Beruhige dich mit geführter Atemtechnik
          </Text>
        </View>

        {/* Beruhigungstext */}
        <View style={styles.messageCard}>
          <Ionicons name="checkmark-circle" size={24} color="#10B981" />
          <Text style={styles.headline}>
            Alles ist okay. Konzentriere dich auf deinen Atem.
          </Text>
        </View>

        {/* Atmungskreis */}
        <View style={styles.center}>
          <View style={styles.circleContainer}>
            {/* Glow Effect Ring */}
            <Animated.View 
              style={[
                styles.glowRing, 
                { 
                  opacity: glowOpacity,
                  transform: [
                    { scale: outerScale },
                    { 
                      rotate: rotation.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '360deg'],
                      })
                    }
                  ]
                }
              ]} 
            />
            
            <Animated.View style={[styles.outerCircle, { transform: [{ scale: outerScale }], opacity }]}>
              <Animated.View style={[styles.middleCircle, { opacity }]}>
                <Animated.View
                  style={[
                    styles.innerCircle, 
                    { 
                      transform: [{ scale }],
                      backgroundColor: phase === "ein" ? "#FEF2F2" : "#fff"
                    }
                  ]}
                >
                  <Ionicons 
                    name={phase === "ein" ? "arrow-down-circle" : "arrow-up-circle"} 
                    size={48} 
                    color="#EF4444" 
                  />
                  <Text style={styles.breathText}>{phaseText}</Text>
                  <Text style={styles.breathSeconds}>{phaseRemaining}s</Text>
                </Animated.View>
              </Animated.View>
            </Animated.View>
          </View>
        </View>

        {/* Start / Pause */}
        <View style={styles.controlsRow}>
          <TouchableOpacity style={styles.controlBtn} onPress={handleStart} activeOpacity={0.8}>
            <Ionicons name="play-circle" size={24} color="#EF4444" />
            <Text style={styles.controlText}>Start</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlBtn} onPress={handlePause} activeOpacity={0.8}>
            <Ionicons name="pause-circle" size={24} color="#EF4444" />
            <Text style={styles.controlText}>Pause</Text>
          </TouchableOpacity>
        </View>

        {/* Restzeit */}
        <View style={styles.progressCard}>
          <Ionicons name="time-outline" size={24} color="#EF4444" />
          <Text style={styles.remainingText}>
            {totalRemaining > 0
              ? `Noch ${totalRemaining} s bis zur vollständigen Beruhigung`
              : "Gut gemacht. Du hast die Übung geschafft."}
          </Text>
        </View>

        {/* Weitere Hilfe */}
        <TouchableOpacity
          style={styles.helpBtn}
          onPress={() => router.push("/chat-list")}
          activeOpacity={0.8}
        >
          <Ionicons name="chatbubbles" size={20} color="#fff" />
          <Text style={styles.helpText}>Ich brauche weitere Hilfe</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Drawer Modal */}
      <Modal
        visible={drawerOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setDrawerOpen(false)}
      >
        <View style={styles.drawerContainer}>
          <TouchableOpacity 
            style={styles.drawerOverlay}
            activeOpacity={1}
            onPress={() => setDrawerOpen(false)}
          />
          <View style={styles.drawerContent}>
            <CustomDrawer 
              navigation={{ navigate: (route: string) => { router.push(route as any); setDrawerOpen(false); } } as any}
              onLogout={() => { setDrawerOpen(false); router.push("/login-patient"); }}
            />
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
}

const CIRCLE_SIZE = 240;

const styles = StyleSheet.create({
  bg: { flex: 1 },
  wrap: { flex: 1 },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },

  /* HEADER */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
  },
  brand: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1F2937",
    letterSpacing: 0.5,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  /* HERO */
  hero: {
    alignItems: "center",
    paddingVertical: 24,
  },
  heroIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FEE2E2",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1F2937",
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },

  /* MESSAGE CARD */
  messageCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#D1FAE5",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  headline: {
    flex: 1,
    fontSize: 15,
    color: "#065F46",
    fontWeight: "600",
    lineHeight: 22,
  },

  /* BREATHING CIRCLE */
  center: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 32,
  },
  circleContainer: {
    width: CIRCLE_SIZE + 100,
    height: CIRCLE_SIZE + 100,
    alignItems: "center",
    justifyContent: "center",
  },
  glowRing: {
    position: "absolute",
    width: CIRCLE_SIZE + 80,
    height: CIRCLE_SIZE + 80,
    borderRadius: (CIRCLE_SIZE + 80) / 2,
    backgroundColor: "transparent",
    borderWidth: 4,
    borderColor: "#F87171",
  },
  outerCircle: {
    width: CIRCLE_SIZE + 40,
    height: CIRCLE_SIZE + 40,
    borderRadius: (CIRCLE_SIZE + 40) / 2,
    borderWidth: 3,
    borderColor: "#FEE2E2",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(254, 242, 242, 0.3)",
  },
  middleCircle: {
    width: CIRCLE_SIZE + 10,
    height: CIRCLE_SIZE + 10,
    borderRadius: (CIRCLE_SIZE + 10) / 2,
    borderWidth: 3,
    borderColor: "#FECACA",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(254, 202, 202, 0.5)",
  },
  innerCircle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  breathText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
  },
  breathSeconds: {
    fontSize: 32,
    fontWeight: "800",
    color: "#EF4444",
  },

  /* CONTROLS */
  controlsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    marginBottom: 24,
  },
  controlBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    minWidth: 140,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    backgroundColor: "#fff",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  controlText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#EF4444",
  },

  /* PROGRESS */
  progressCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  remainingText: {
    flex: 1,
    fontSize: 14,
    color: "#374151",
    fontWeight: "600",
    lineHeight: 20,
  },

  /* HELP BUTTON */
  helpBtn: {
    flexDirection: "row",
    alignSelf: "center",
    alignItems: "center",
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    backgroundColor: "#EF4444",
    shadowColor: "#EF4444",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  helpText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
  },

  /* DRAWER */
  drawerContainer: {
    flex: 1,
    flexDirection: "row",
  },
  drawerOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  drawerContent: {
    width: 280,
    height: "100%",
  },
});