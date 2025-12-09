import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const ORANGE = "#F28C3A";

export default function PMELangeDone() {
  return (
    <ImageBackground
      source={require("../../assets/Home_Design.jpg")}
      style={styles.bg}
      resizeMode="cover"
    >
      <View style={styles.container}>

        {/* BACK BUTTON */}
        <TouchableOpacity style={styles.backBtn} onPress={() => router.push("/pme")}>
          <Ionicons name="arrow-back" size={32} color="#fff" />
        </TouchableOpacity>

        {/* TITLE */}
        <Text style={styles.header}>Gut gemacht!</Text>
        <Text style={styles.subtitle}>
          Du hast die lange PME erfolgreich abgeschlossen.
        </Text>

        {/* IMAGE */}
        <Image
          source={require("../../assets/relax.png")}
          resizeMode="contain"
          style={styles.image}
        />

        {/* BUTTONS */}
        <View style={styles.buttonsContainer}>
          {/* BACK TO MENU */}
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => router.push("/pme")}
          >
            <Text style={styles.primaryBtnText}>Zurück zur Übersicht</Text>
          </TouchableOpacity>

          {/* RESTART */}
          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => router.push("/pme_lange_step1")}
          >
            <Text style={styles.secondaryBtnText}>Erneut starten</Text>
          </TouchableOpacity>
        </View>

      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },

  container: {
    flex: 1,
    paddingTop: 60,
    alignItems: "center",
  },

  backBtn: {
    position: "absolute",
    top: 40,
    left: 20,
    padding: 6,
  },

  header: {
    fontSize: 32,
    fontWeight: "800",
    color: ORANGE,   // ← برتقاني
    marginBottom: 10,
    textAlign: "center",
  },

  subtitle: {
    fontSize: 18,
    color: "#000",   // ← أسود
    marginBottom: 20,
    textAlign: "center",
    paddingHorizontal: 20,
  },

  image: {
    width: 260,
    height: 260,
    marginTop: 20,
  },

  buttonsContainer: {
    marginTop: 40,
    gap: 14,
    width: "70%",
  },

  primaryBtn: {
    backgroundColor: ORANGE,
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: "center",
  },

  primaryBtnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },

  secondaryBtn: {
    backgroundColor: "#ffffffcc",
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: ORANGE,
  },

  secondaryBtnText: {
    color: ORANGE,
    fontSize: 18,
    fontWeight: "700",
  },
});

