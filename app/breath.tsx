import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
    ImageBackground,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function BreathMenu() {
  const exercises = [
    {
      id: "446",
      title: "4–4–6 Atmung",
      desc: "Ruhige Atemübung zur Entspannung",
      color: "#C9E9EA",
    },
    {
      id: "478",
      title: "4–7–8 Atmung",
      desc: "Tiefenatmung zur Beruhigung des Körpers",
      color: "#B7D6E5",
    },
    {
      id: "444",
      title: "4–4–4 Box Breathing",
      desc: "Gleichmäßige Atmung für Fokus und Klarheit",
      color: "#F7D4A8",
    },
    {
      id: "366",
      title: "3–6–6 Atmung",
      desc: "Beruhigende Atemtechnik gegen Stress",
      color: "#EADCF2",
    },
  ];

  return (
    <ImageBackground
      source={require("../assets/bg.png")}
      style={styles.bg}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={28} color="#000" />
          </TouchableOpacity>

          <View>
            <Text style={styles.title}>Was ist Atmung?</Text>
            <Text style={styles.subtitle}>
              Diese Übungen helfen dir, deinen Atem zu beruhigen und Stress
              abzubauen.
            </Text>
          </View>
        </View>
        {exercises.map((item) => (
          <View
            key={item.id}
            style={[styles.card, { backgroundColor: item.color }]}
          >
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
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 20,
  },
  title: { fontSize: 22, fontWeight: "700" },
  subtitle: { fontSize: 13, color: "#444", marginTop: 4 },
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
  cardTitle: { fontSize: 18, fontWeight: "600" },
  cardDesc: { fontSize: 13, color: "#666", marginTop: 4 },
  btn: {
    backgroundColor: "#ffffff",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#9E86B9",
  },
  btnText: {
    fontWeight: "700",
    color: "#9E86B9",
    fontSize: 14,
  },
});
