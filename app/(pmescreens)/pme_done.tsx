// app/(pmescreens)/pme_done.tsx

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

export default function PMEDone() {
  return (
    <ImageBackground
      source={require("../../assets/Home_Design.jpg")}
      style={styles.bg}
      resizeMode="cover"
    >
      <View style={styles.container}>
        
        {/* BACK BUTTON */}
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={30} color="#fff" />
        </TouchableOpacity>

        {/* TITLE */}
        <Text style={styles.header}>Gut gemacht!</Text>

        {/* SUBTEXT */}
        <Text style={styles.subtitle}>
          Du hast die kurze PME erfolgreich abgeschlossen.
        </Text>

        {/* IMAGE */}
        <Image
          source={require("../../assets/relax.png")}
          resizeMode="contain"
          style={styles.image}
        />

        {/* BUTTONS */}
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => router.push("/pme")}
        >
          <Text style={styles.primaryBtnText}>Zurück zur Übersicht</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => router.push("/pme_steps")}
        >
          <Text style={styles.secondaryBtnText}>Erneut starten</Text>
        </TouchableOpacity>

      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },

  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 80,
  },

  backBtn: {
    position: "absolute",
    top: 40,
    left: 20,
  },

  header: {
    fontSize: 28,
    fontWeight: "900",
    color: "#F28C3A",
    marginBottom: 8,
    textAlign: "center",
  },

  subtitle: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 20,
    color: "#000",
  },

  image: {
    width: 260,
    height: 260,
    marginBottom: 40,
  },

  primaryBtn: {
    backgroundColor: "#F28C3A",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginBottom: 20,
    width: "80%",
    alignItems: "center",
  },

  primaryBtnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },

  secondaryBtn: {
    backgroundColor: "#ffffffcc",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#F28C3A",
    width: "80%",
    alignItems: "center",
  },

  secondaryBtnText: {
    color: "#F28C3A",
    fontSize: 18,
    fontWeight: "700",
  },
});


