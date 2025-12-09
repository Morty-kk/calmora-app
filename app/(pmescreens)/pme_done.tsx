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

export default function PMEDone() {
  return (
    <ImageBackground
      source={require("../../assets/relax.png")}
      style={styles.bg}
      resizeMode="cover"
    >
      <View style={styles.container}>

        <TouchableOpacity style={styles.backBtn} onPress={() => router.push("/pme")}>
          <Ionicons name="arrow-back" size={30} color="#444" />
        </TouchableOpacity>

        <Text style={styles.title}>Geschafft!</Text>

        <Text style={styles.text}>
          Super gemacht! Du hast die kurze{"\n"}
          PME-Variante erfolgreich beendet.
        </Text>

        <Image
          source={require("../../assets/relax.png")}
          style={styles.image}
          resizeMode="contain"
        />

        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => router.push("/pme")}
        >
          <Text style={styles.primaryText}>Zur Übersicht</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => router.push("/pme_steps")}
        >
          <Text style={styles.secondaryText}>Erneut starten</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  container: {
    flex: 1,
    paddingTop: 80,
    alignItems: "center",
  },
  backBtn: {
    position: "absolute",
    top: 40,
    left: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#D17842",
    marginBottom: 10,
  },
  text: {
    fontSize: 17,
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  image: {
    width: 260,
    height: 260,
    marginVertical: 20,
  },
  primaryBtn: {
    backgroundColor: "#F28C3A",
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 24,
    marginTop: 10,
  },
  primaryText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  secondaryBtn: {
    backgroundColor: "#ffffffdd",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#F28C3A",
    marginTop: 12,
  },
  secondaryText: {
    color: "#F28C3A",
    fontSize: 18,
    fontWeight: "700",
  },
});
