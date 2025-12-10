import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Easing,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function PanicScreen() {
  const navigation = useNavigation();

  // Konfiguration der Atemübung (sekunden)
  const INHALE = 2; // "atme ein 2s" (wie in Mock)
  const EXHALE = 4;
  const TOTAL_CALM_SECONDS = 60; // z. B. 1:00 bis vollständige Beruhigung

  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState('inhale'); // 'inhale' | 'exhale'
  const [phaseSecondsLeft, setPhaseSecondsLeft] = useState(INHALE);
  const [totalSecondsLeft, setTotalSecondsLeft] = useState(TOTAL_CALM_SECONDS);
  const [fullscreen, setFullscreen] = useState(false);

  const scale = useRef(new Animated.Value(1)).current;
  const animationRef = useRef(null);
  const intervalRef = useRef(null);

  // Start / Resume
  const start = () => {
    if (running) return;
    setRunning(true);
  };

  // Pause
  const pause = () => {
    setRunning(false);
  };

  // Reset (falls gewünscht)
  const reset = () => {
    setRunning(false);
    setPhase('inhale');
    setPhaseSecondsLeft(INHALE);
    setTotalSecondsLeft(TOTAL_CALM_SECONDS);
    scale.setValue(1);
  };

  // toggle fullscreen statusbar
  useEffect(() => {
    StatusBar.setHidden(fullscreen, 'fade');
  }, [fullscreen]);

  // Animation trigger: passe scale je Phase an
  const animatePhase = (phaseName, durationSec) => {
    // für inhale: skaliere größer, für exhale: skaliere kleiner
    const toValue = phaseName === 'inhale' ? 1.65 : 1.0;
    // einfache timing animation synchron zu phase duration
    if (animationRef.current) {
      animationRef.current.stop();
      animationRef.current = null;
    }
    animationRef.current = Animated.timing(scale, {
      toValue,
      duration: durationSec * 1000,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    });
    animationRef.current.start(() => {
      // nothing here — phase switching handled by interval tick
    });
  };

  // Haupt-interval: tick jede Sekunde, verwalte Phasen und Gesamttimer
  useEffect(() => {
    if (running) {
      // starte Animation für aktuelle Phase sofort
      animatePhase(phase, phaseSecondsLeft);

      intervalRef.current = setInterval(() => {
        setPhaseSecondsLeft((prev) => {
          const next = prev - 1;
          if (next <= 0) {
            // wechsel Phase
            setPhase((cur) => {
              const newPhase = cur === 'inhale' ? 'exhale' : 'inhale';
              // setze neuen PhaseSecondsLeft synchron mit nextPhase
              setPhaseSecondsLeft(newPhase === 'inhale' ? INHALE : EXHALE);
              // starte Animation für neue Phase
              animatePhase(newPhase, newPhase === 'inhale' ? INHALE : EXHALE);
              return newPhase;
            });
            return 0; // transient, we set new value above
          }
          return next;
        });

        // reduziere Gesamttimer
        setTotalSecondsLeft((prevTotal) => {
          const t = prevTotal - 1;
          if (t <= 0) {
            // finished calm
            setRunning(false);
            // optional: kurze Meldung
            Alert.alert('Fertig', 'Deine Beruhigungszeit ist erreicht.');
            return 0;
          }
          return t;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (animationRef.current) {
        animationRef.current.stop();
        animationRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]); // restart effect when running toggles

  // Wenn Phase manuell geändert (z. B. bei Reset), starte passende Animation
  useEffect(() => {
    if (!running) {
      // set scale to matching value for phase without animating
      const toVal = phase === 'inhale' ? 1.65 : 1.0;
      Animated.timing(scale, {
        toValue: toVal,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // Hilfsanzeige formatieren mm:ss
  const formatTime = (sec) => {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(1, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // UI: Innerer Text, z.B. "atme ein 2s" oder "atme aus 3s"
  const innerText = () => {
    const label = phase === 'inhale' ? 'atme ein' : 'atme aus';
    return `${label}\n${phaseSecondsLeft}s`;
  };

  const onNeedHelp = () => {
    Alert.alert(
      'Weitere Hilfe',
      'Möchtest du jetzt jemanden anrufen oder eine Notiz senden?',
      [
        { text: 'Abbrechen', style: 'cancel' },
        {
          text: 'Notruf (112)',
          onPress: () => {
            // hier kannst du Linking.openURL('tel:112') einsetzen
            Alert.alert('Anruf starten', 'Telefon wird geöffnet (nur Demo).');
          },
        },
        {
          text: 'Therapeuten kontaktieren',
          onPress: () => {
            Alert.alert('Nachricht', 'Therapeut kontaktieren (Demo).');
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={[styles.container, fullscreen ? styles.fullscreen : null]}>
      <View style={styles.topBar}>
        <Pressable style={styles.topButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="#0F172A" />
        </Pressable>
        <Pressable
          style={styles.topButton}
          onPress={() => setFullscreen((f) => !f)}
          accessibilityLabel="Fullscreen umschalten"
        >
          <Ionicons name={fullscreen ? 'contract' : 'expand'} size={22} color="#0F172A" />
        </Pressable>
      </View>

      <View style={styles.content}>
        <Text style={styles.headerText}>Alles ist okay. Konzentriere dich auf deinen Atem.</Text>

        <View style={styles.centerWrap}>
          <Animated.View
            style={[
              styles.outerCircle,
              {
                transform: [{ scale }],
              },
            ]}
          >
            <View style={styles.dashedRing} />
            <View style={styles.innerCircle}>
              <Text style={styles.innerText}>{innerText()}</Text>
            </View>
          </Animated.View>
        </View>

        <View style={styles.controlsRow}>
          <Pressable
            style={[styles.controlButton, running ? styles.controlButtonDisabled : null]}
            onPress={start}
            disabled={running}
          >
            <Text style={styles.controlButtonText}>Start</Text>
          </Pressable>

          <Pressable
            style={[styles.controlButton, !running ? styles.controlButtonDisabled : null]}
            onPress={pause}
            disabled={!running}
          >
            <Text style={styles.controlButtonText}>Pause</Text>
          </Pressable>
        </View>

        <Text style={styles.remainingText}>
          Noch {formatTime(totalSecondsLeft)} bis zur vollständigen Beruhigung
        </Text>

        <Pressable style={styles.helpButton} onPress={onNeedHelp}>
          <Text style={styles.helpButtonText}>Ich brauche weitere Hilfe</Text>
        </Pressable>
      </View>
    </View>
  );
}

const CIRCLE_SIZE = 260;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7EDE9',
    paddingTop: 36,
  },
  fullscreen: {
    paddingTop: 8,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  topButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerText: {
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 12,
    fontWeight: '600',
    color: '#0F172A',
  },
  centerWrap: {
    width: '100%',
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 18,
  },
  outerCircle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    borderWidth: 8,
    borderColor: '#9EC5D6',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  dashedRing: {
    position: 'absolute',
    width: CIRCLE_SIZE - 30,
    height: CIRCLE_SIZE - 30,
    borderRadius: (CIRCLE_SIZE - 30) / 2,
    borderWidth: 3,
    borderColor: '#CDE6EE',
    borderStyle: 'dashed',
  },
  innerCircle: {
    width: CIRCLE_SIZE - 110,
    height: CIRCLE_SIZE - 110,
    borderRadius: (CIRCLE_SIZE - 110) / 2,
    backgroundColor: '#DDEFF3',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  innerText: {
    textAlign: 'center',
    fontWeight: '700',
    color: '#0F172A',
  },
  controlsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 6,
  },
  controlButton: {
    backgroundColor: '#F7D8CC',
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 10,
    marginHorizontal: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  controlButtonDisabled: {
    opacity: 0.5,
  },
  controlButtonText: {
    fontWeight: '700',
    color: '#0F172A',
  },
  remainingText: {
    marginTop: 12,
    color: '#0F172A',
    fontWeight: '600',
  },
  helpButton: {
    marginTop: 18,
    backgroundColor: '#F1B7B7',
    paddingVertical: 14,
    paddingHorizontal: 26,
    borderRadius: 10,
    minWidth: '70%',
    alignItems: 'center',
  },
  helpButtonText: {
    color: '#5B1D1D',
    fontWeight: '700',
  },
});