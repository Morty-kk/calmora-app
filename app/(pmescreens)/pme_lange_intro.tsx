// app/(pmescreens)/pme_lange_intro.tsx
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
    Image,
    ImageBackground,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function PMELangeIntro() {
  return (
    <ImageBackground
      source={require("../../assets/Home_Design.jpg")}
      style={styles.bg}
      resizeMode="cover"
    >
      <View style={styles.container}>

        {/* BACK */}
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#444" />
        </TouchableOpacity>

        {/* TEXT BOX */}
        <View style={styles.box}>
          <Text style={styles.title}>PME Lange Variante</Text>
          <Text style={styles.text}>
            Diese lange Variante führt dich durch sechs detaillierte 
            Muskelentspannungsübungen für eine intensive körperliche Ruhe.
          </Text>
        </View>

        {/* IMAGE */}
        <Image
          source={require("../../assets/relax.png")}
          style={styles.image}
          resizeMode="contain"
        />

        {/* START */}
        <TouchableOpacity
          style={styles.startBtn}
          onPress={() => router.push("/pme_lange_step1")}
        >
          <Text style={styles.startText}>beginnen</Text>
        </TouchableOpacity>

      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  container: { flex: 1, padding: 20 },
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

