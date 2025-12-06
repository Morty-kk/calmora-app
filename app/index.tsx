// app/index.tsx
import { useRouter } from 'expo-router';
import React from 'react';
import {
    ImageBackground,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function StartScreen() {
  const router = useRouter();

  return (
    <ImageBackground
      // Passe den Pfad an, falls dein Bild woanders liegt:
      // - liegt es im Projektroot:   ../assets/splash.jpg (so wie hier)
      // - liegt es in app/assets:    ./assets/splash.jpg
      source={require('../assets/splash.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to Calmora</Text>

        <TouchableOpacity
          accessibilityRole="button" // warum: bessere Bedienhilfe
          style={styles.startButton}
          onPress={() => router.replace('/login-patient')}
          activeOpacity={0.8}
        >
          <Text style={styles.startButtonText}>start</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 90,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 40,
    color: '#8C789E',
    // Georgia existiert nicht auf allen Android-Geräten:
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif', default: 'System' }),
    marginBottom: 300,
    textAlign: 'center',
  },
  startButton: {
    backgroundColor: '#8C789E',
    paddingVertical: 10,
    paddingHorizontal: 60,
    borderRadius: 50,
    borderWidth: 0.25,
    borderColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#8C789E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  startButtonText: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'normal',
  },
});
