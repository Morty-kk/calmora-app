import { router } from "expo-router";
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function BreathMenu() {
  const exercises = [
    {
      id: "446",
      title: "4–4–6 Atmung",
      desc: "Ruhige Atemübung zur Entspannung",
    },
    {
      id: "478",
      title: "4–7–8 Atmung",
      desc: "Tiefenatmung zur Beruhigung des Körpers",
    },
    {
      id: "444",
      title: "4–4–4 Box Breathing",
      desc: "Gleichmäßige Atmung für Fokus und Klarheit",
    },
    {
      id: "366",
      title: "3–6–6 Atmung",
      desc: "Beruhigende Atemtechnik gegen Stress",
    },
  ];

  return (
    <ImageBackground
      source={require("../assets/bg.png")}
      style={styles.bg}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.title}>Was ist Atmung?</Text>
        <Text style={styles.desc}>
          Diese Übungen helfen dir, deinen Atem zu beruhigen und Stress abzubauen.
        </Text>

        {exercises.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDesc}>{item.desc}</Text>
            </View>

            <TouchableOpacity
              style={styles.btn}
              onPress={() => router.push(`/breath-exercise?id=${item.id}`)}
            >
              <Text style={styles.btnText}>beginnen</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  container: { padding: 20 },
  title: { fontSize: 22, fontWeight: "600", marginTop: 30 },
  desc: { fontSize: 14, color: "#333", marginVertical: 10, marginBottom: 20 },

  card: {
    backgroundColor: "rgba(255,255,255,0.85)",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  cardTitle: { fontSize: 18, fontWeight: "600" },
  cardDesc: { fontSize: 13, color: "#666", marginTop: 4 },

  btn: {
    backgroundColor: "#9E86B9",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  btnText: { color: "#fff", fontSize: 14, fontWeight: "600" },
});

