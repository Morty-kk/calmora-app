// app/registerpatient.tsx
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

export default function RegisterPatient() {
  const [gender, setGender] = useState("m");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [showError, setShowError] = useState(false);

  const onRegister = () => {
    if (!agreed) {
      setShowError(true);
      return;
    }

    setShowError(false);
    router.push("/menu");
  };

  return (
    <ImageBackground
      source={require("../assets/bg.png")}
      style={styles.bg}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>registrieren</Text>

        {/* 🚫 Tabs removed completely */}

        {/* Form */}
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Vorname"
            value={firstName}
            onChangeText={setFirstName}
          />

          <TextInput
            style={styles.input}
            placeholder="Nachname"
            value={lastName}
            onChangeText={setLastName}
          />

          {/* Gender */}
          <Text style={styles.label}>Geschlecht</Text>
          <View style={styles.genderRow}>
            <TouchableOpacity
              style={[styles.genderBox, gender === "m" && styles.genderSelected]}
              onPress={() => setGender("m")}
            >
              <Text
                style={[
                  styles.genderText,
                  gender === "m" && styles.genderTextSelected,
                ]}
              >
                männlich
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.genderBox, gender === "w" && styles.genderSelected]}
              onPress={() => setGender("w")}
            >
              <Text
                style={[
                  styles.genderText,
                  gender === "w" && styles.genderTextSelected,
                ]}
              >
                weiblich
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputWithIcon}>
            <TextInput
              style={styles.inputIconText}
              placeholder="Geburtsdatum"
              value={birthdate}
              onChangeText={setBirthdate}
            />
            <Ionicons name="calendar-outline" size={20} color="#8E8E8E" />
          </View>

          <View style={styles.inputWithIcon}>
            <TextInput
              style={styles.inputIconText}
              placeholder="Telefonnummer"
              value={phone}
              onChangeText={setPhone}
            />
            <Ionicons name="call-outline" size={20} color="#8E8E8E" />
          </View>

          <View style={styles.inputWithIcon}>
            <TextInput
              style={styles.inputIconText}
              placeholder="Email Adresse"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
            <Ionicons name="mail-outline" size={20} color="#8E8E8E" />
          </View>

          <View style={styles.inputWithIcon}>
            <TextInput
              style={styles.inputIconText}
              placeholder="Passwort"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <Ionicons name="lock-closed-outline" size={20} color="#8E8E8E" />
          </View>

          {/* DSGVO */}
          <TouchableOpacity
            style={[
              styles.checkboxRow,
              showError && !agreed && styles.checkboxErrorBorder,
            ]}
            onPress={() => {
              setAgreed((s) => !s);
              setShowError(false);
            }}
          >
            <Text style={styles.checkbox}>{agreed ? "☑" : "☐"}</Text>
            <Text style={styles.dsgvo}>
              Ich stimme der Verarbeitung meiner personenbezogenen und
              Gesundheitsdaten gemäß DSGVO zu.{" "}
              <Text style={styles.linkText}>[Datenschutzerklärung]</Text>
            </Text>
          </TouchableOpacity>

          {/* Register */}
          <TouchableOpacity
            style={[styles.registerBtn, !agreed && styles.registerBtnDisabled]}
            onPress={onRegister}
            disabled={!agreed}
          >
            <Text style={styles.registerText}>registrieren</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: "#E4E9F2",
  },

  container: {
    padding: 30,
    paddingTop: 100,
  },

  title: {
    fontSize: 34,
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "serif",
    color: "#000",
  },

  form: {
    width: "100%",
  },

  input: {
    backgroundColor: "#F6F6F6",
    padding: 14,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 15,
  },

  inputWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F6F6F6",
    padding: 14,
    borderRadius: 10,
    marginBottom: 15,
  },

  inputIconText: {
    flex: 1,
    fontSize: 15,
  },

  label: {
    marginBottom: 8,
    color: "#333",
    fontSize: 14,
  },

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

  genderSelected: {
    backgroundColor: "#9E86B9",
  },

  genderText: {
    color: "#333",
  },

  genderTextSelected: {
    color: "#fff",
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

  checkbox: {
    fontSize: 18,
    marginTop: 2,
  },

  dsgvo: {
    flex: 1,
    fontSize: 13,
    color: "#333",
  },

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

  registerBtnDisabled: {
    opacity: 0.5,
  },

  registerText: {
    color: "#fff",
    fontSize: 18,
    textTransform: "lowercase",
  },
});
