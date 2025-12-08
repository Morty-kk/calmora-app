import { router } from "expo-router";
import {
    ImageBackground,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function AchtsamkeitMenu() {
  return (
    <ImageBackground
      source={require("../assets/bg.png")}
      style={styles.bg}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.title}>Was ist Achtsamkeit?</Text>

        <Text style={styles.desc}>
          Achtsamkeit bedeutet, deine Gedanken, Gefühle und deinen Körper bewusst
          wahrzunehmen.
        </Text>

        {/* 5-Sinnes-Check */}
        <View style={[styles.card, { backgroundColor: "#C9E9EA" }]}>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>5-Sinnes-Check</Text>
            <Text style={styles.cardDesc}>
              Bringt dich in den Moment zurück.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.btn}
            onPress={() => router.push("/achtsamkeit-5sinne")}
          >
            <Text style={styles.btnText}>beginnen</Text>
          </TouchableOpacity>
        </View>

        {/* Bodyscan */}
        <View style={[styles.card, { backgroundColor: "#B7D6E5" }]}>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>Bodyscan kurz</Text>
            <Text style={styles.cardDesc}>
              Lenkt deine Aufmerksamkeit auf deinen Körper.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.btn}
            onPress={() => router.push("/bodyscan")}
          >
            <Text style={styles.btnText}>beginnen</Text>
          </TouchableOpacity>
        </View>

        {/* Atem-Achtsamkeit */}
        <View style={[styles.card, { backgroundColor: "#F7D4A8" }]}>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>Beobachte deinen Atem</Text>
            <Text style={styles.cardDesc}>
              Einfache Übung um Gedanken loszulassen.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.btn}
            onPress={() => router.push("/atem-achtsamkeit")}
          >
            <Text style={styles.btnText}>beginnen</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  container: { padding: 20, paddingTop: 40 },
  title: { fontSize: 22, fontWeight: "600", marginBottom: 10 },
  desc: { fontSize: 14, color: "#333", marginBottom: 20 },

  card: {
    padding: 18,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },

  cardTitle: { fontSize: 18, fontWeight: "700", color: "#2B2B2B" },
  cardDesc: { fontSize: 13, color: "#3B3B3B", marginTop: 4 },

  btn: {
    backgroundColor: "#ffffff",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#9E86B9",
  },
  btnText: { fontWeight: "700", color: "#9E86B9" },
});


