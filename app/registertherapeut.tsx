import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function Register() {
  const [gender, setGender] = useState<"m" | "w" | null>(null);
  const [accepted, setAccepted] = useState(false);
  const [showDsgvoError, setShowDsgvoError] = useState(false);
  const [showGenderError, setShowGenderError] = useState(false);

  const handleRegister = () => {
    if (!accepted) {
      setShowDsgvoError(true);
      return;
    }

    if (!gender) {
      setShowGenderError(true);
      Alert.alert("Fehler", "Bitte wählen Sie Ihr Geschlecht aus.");
      return;
    }

    router.push("/menu");
  };

  return (
    <View style={styles.bg}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>registrieren</Text>

        {/* ------------- Tabs removed completely ------------- */}

        {/* Form */}
        <View style={styles.form}>
          <TextInput style={styles.input} placeholder="Vorname" />
          <TextInput style={styles.input} placeholder="Nachname" />

          {/* Gender Selection */}
          <Text style={styles.label}>Geschlecht</Text>
          <View
            style={[
              styles.genderRow,
              showGenderError && !gender ? styles.checkboxErrorBorder : null,
            ]}
          >
            <TouchableOpacity
              style={[styles.genderBox, gender === "m" && styles.genderSelected]}
              onPress={() => {
                setGender("m");
                setShowGenderError(false);
              }}
            >
              <Text style={[styles.genderText, gender === "m" && styles.genderTextSelected]}>
                männlich
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.genderBox, gender === "w" && styles.genderSelected]}
              onPress={() => {
                setGender("w");
                setShowGenderError(false);
              }}
            >
              <Text style={[styles.genderText, gender === "w" && styles.genderTextSelected]}>
                weiblich
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputWithIcon}>
            <TextInput style={styles.inputIconText} placeholder="Geburtsdatum" />
            <Ionicons name="calendar-outline" size={20} color="#8E8E8E" />
          </View>

          <View style={styles.inputWithIcon}>
            <TextInput style={styles.inputIconText} placeholder="Telefonnummer" />
            <Ionicons name="call-outline" size={20} color="#8E8E8E" />
          </View>

          <View style={styles.inputWithIcon}>
            <TextInput
              style={styles.inputIconText}
              placeholder="Email Adresse"
              keyboardType="email-address"
            />
            <Ionicons name="mail-outline" size={20} color="#8E8E8E" />
          </View>

          <View style={styles.inputWithIcon}>
            <TextInput style={styles.inputIconText} placeholder="Passwort" secureTextEntry />
            <Ionicons name="lock-closed-outline" size={20} color="#8E8E8E" />
          </View>

          {/* ===== Zertifikat hochladen ===== */}
          <TouchableOpacity style={styles.uploadBox}>
            <Ionicons name="cloud-upload-outline" size={22} color="#745C85" />
            <Text style={styles.uploadText}>Zertifikat hochladen</Text>
          </TouchableOpacity>

          {/* DSGVO */}
          <TouchableOpacity
            style={[
              styles.checkboxRow,
              showDsgvoError && !accepted ? styles.checkboxErrorBorder : null,
            ]}
            onPress={() => {
              setAccepted((s) => !s);
              setShowDsgvoError(false);
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.checkbox}>{accepted ? "☑" : "☐"}</Text>

            <Text style={styles.dsgvo}>
              Ich stimme der Verarbeitung meiner personenbezogenen und
              Gesundheitsdaten gemäß DSGVO zu.{" "}
              <Text style={styles.linkText}>[Datenschutzerklärung]</Text>
            </Text>
          </TouchableOpacity>

          {/* Register Button */}
          <TouchableOpacity
            style={[styles.registerBtn, !accepted && styles.registerBtnDisabled]}
            onPress={handleRegister}
            disabled={!accepted}
            activeOpacity={0.8}
          >
            <Text style={styles.registerText}>registrieren</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: "#FFFFFF" },

  container: { padding: 30, paddingTop: 100 },

  title: {
    fontSize: 34,
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "serif",
    color: "#000",
  },

  form: { width: "100%" },

  input: {
    backgroundColor: "#F6F6F6",
    padding: 14,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 15,
  },

  label: { marginBottom: 8, color: "#333", fontSize: 14 },

  genderRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 15,
  },

  genderBox: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#F6F6F6",
    alignItems: "center",
  },

  genderSelected: { backgroundColor: "#9E86B9" },

  genderText: { color: "#333" },

  genderTextSelected: { color: "#fff" },

  inputWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F6F6F6",
    padding: 14,
    borderRadius: 10,
    marginBottom: 15,
  },

  inputIconText: { flex: 1, fontSize: 15 },

  /* ===== Upload box ===== */
  uploadBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F6F6F6",
    padding: 14,
    borderRadius: 10,
    marginBottom: 20,
    gap: 10,
  },

  uploadText: {
    fontSize: 15,
    color: "#745C85",
  },

  checkboxRow: {
    flexDirection: "row",
    marginBottom: 20,
    gap: 10,
    alignItems: "flex-start",
  },

  checkboxErrorBorder: {
    borderColor: "red",
    borderWidth: 1,
    borderRadius: 8,
    padding: 5,
  },

  checkbox: { fontSize: 18, marginTop: 2 },

  dsgvo: { flex: 1, fontSize: 13, color: "#333" },

  linkText: {
    color: "#745C85",
    textDecorationLine: "underline",
  },

  registerBtn: {
    backgroundColor: "#9E86B9",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 50,
  },

  registerBtnDisabled: { opacity: 0.5 },

  registerText: { color: "#fff", fontSize: 18 },
});

