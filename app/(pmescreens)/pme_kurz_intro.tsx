// app/(pmescreens)/pme_kurz_intro.tsx
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function PMEKurzIntro() {
  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={28} color="#444" />
      </TouchableOpacity>

      {/* Text Box */}
      <View style={styles.box}>
        <Text style={styles.title}>PME Kurze Variante</Text>
        <Text style={styles.text}>
          Diese kurze Variante hilft dir, in wenigen Minuten Ruhe zu finden; du
          spannst nacheinander ausgewählte Muskelgruppen an und lässt sie wieder
          los.
        </Text>
      </View>

      {/* Image */}
      <Image
        source={require("../../assets/relax.png")}
        style={styles.image}
        resizeMode="contain"
      />

      {/* Start Button */}
      <TouchableOpacity
        style={styles.startBtn}
        onPress={() => router.push("/pme_steps")}

      >
        <Text style={styles.startText}>LOS</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4E3DD", padding: 20 },
  backBtn: { marginTop: 40, marginBottom: 10 },
  box: {
    backgroundColor: "#C9D9E8",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  text: { fontSize: 16, lineHeight: 22 },
  image: {
    width: 260,
    height: 260,
    alignSelf: "center",
    marginTop: 10,
  },
  startBtn: {
    backgroundColor: "#FFAF9A",
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
    alignSelf: "center",
    width: "60%",
    alignItems: "center",
  },
  startText: { fontSize: 20, fontWeight: "bold", color: "#fff" },
});
