// app/login-patient.tsx
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function PatientLogin() {
  const [modalVisible, setModalVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Bitte ausfüllen", "E-Mail und Passwort eingeben.");
      return;
    }
    // TODO: echte Auth integrieren; bei Erfolg:
    router.replace("/home"); // Patient-Home nach Login
  };

  return (
    <ImageBackground
      source={require("../assets/bg.png")}
      style={styles.bg}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.select({ ios: "padding", android: undefined })}
      >
        <View style={styles.container}>
          {/* Title */}
          <Text style={styles.title}>Login</Text>

          {/* Tabs */}
          <View style={styles.tabs}>
            {/* Patient ACTIVE */}
            <TouchableOpacity onPress={() => router.push("/login-patient")}>
              <Text style={[styles.tabText, styles.activeTab]}>Patient</Text>
            </TouchableOpacity>

            {/* Therapeut */}
            <TouchableOpacity onPress={() => router.push("/login-therapeut")}>
              <Text style={styles.tabText}>Therapeut</Text>
            </TouchableOpacity>
          </View>

          {/* Email */}
          <TextInput
            style={styles.input}
            placeholder="Email Adresse"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          {/* Password */}
          <TextInput
            style={styles.input}
            placeholder="Passwort"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {/* Forgot Password */}
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Text style={styles.forgot}>Passwort vergessen?</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity style={styles.button} onPress={() => router.push("/menu")}>
                    <Text style={styles.buttonText}>Login</Text>
                  </TouchableOpacity>

          {/* Register Link */}
          <TouchableOpacity onPress={() => router.replace("/registerpatient")}>
            <Text style={styles.registerText}>
              Haben Sie kein Konto? dann registrieren
            </Text>
          </TouchableOpacity>

          {/* ------------------------- */}
          {/*           MODAL           */}
          {/* ------------------------- */}
          <Modal transparent visible={modalVisible} animationType="slide">
            <Pressable
              style={styles.modalBG}
              onPress={() => setModalVisible(false)}
            >
              <Pressable style={styles.modalBox} onPress={() => {}}>
                <Text style={styles.modalTitle}>Passwort zurücksetzen</Text>

                <Text style={styles.modalText}>
                  Bitte geben Sie Ihre Email-Adresse ein. Wir senden Ihnen einen
                  4-stelligen Code zur Verifizierung.
                </Text>

                <TextInput
                  style={styles.modalInput}
                  placeholder="Email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />

                {/* Weiter Button */}
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => {
                    // TODO: Backend-Request für Reset auslösen
                    setModalVisible(false);
                    Alert.alert(
                      "E-Mail gesendet",
                      "Bitte prüfen Sie Ihren Posteingang."
                    );
                  }}
                >
                  <Text style={styles.modalBtnText}>Weiter</Text>
                </TouchableOpacity>

                {/* Abbrechen Button */}
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.cancelBtnText}>Abbrechen</Text>
                </TouchableOpacity>
              </Pressable>
            </Pressable>
          </Modal>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  container: { padding: 25, marginTop: 100 },
  title: {
    fontSize: 34,
    textAlign: "center",
    marginBottom: 20,
    color: "#745C85",
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 30,
    gap: 40,
  },
  tabText: { fontSize: 18, color: "#745C85" },
  activeTab: { fontWeight: "bold", textDecorationLine: "underline" },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
  },
  forgot: { fontSize: 12, color: "#3A6DCB", marginBottom: 20 },
  button: {
    backgroundColor: "#9E86B9",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 18 },
  registerText: {
    fontSize: 13,
    color: "#3A6DCB",
    textAlign: "center",
    marginTop: 15,
  },
  modalBG: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalBox: {
    backgroundColor: "#fff",
    padding: 25,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10, color: "#000" },
  modalText: { fontSize: 14, color: "#555", marginBottom: 20 },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: "#9E86B9",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  modalBtnText: { color: "#fff", fontSize: 16 },
  cancelButton: {
    backgroundColor: "#ddd",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelBtnText: { color: "#333", fontSize: 16 },
});
