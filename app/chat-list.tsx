import { View, Text, Pressable, Image, StyleSheet } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function ChatList() {
  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} />
        </Pressable>

        <Text style={styles.title}>Calmora</Text>

        <Ionicons name="menu" size={22} />
      </View>

      <Text style={styles.subtitle}>Chatliste</Text>

      {/* CHAT EINTRAG */}
      <Pressable
        style={styles.row}
        onPress={() => router.push("/chat")}
      >
        <Image
          source={require("../assets/profile-placeholder.jpg")}
          style={styles.avatar}
        />

        <View style={{ flex: 1 }}>
          <Text style={styles.name}>Herr Bellamy N</Text>
          <Text style={styles.status}>Termin vor 10 Tagen</Text>
        </View>

        <View style={styles.onlineDot} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FADDC8",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#7C6FB3",
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8E3D7",
    borderRadius: 14,
    padding: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  name: {
    fontWeight: "700",
    fontSize: 16,
  },
  status: {
    fontSize: 12,
    opacity: 0.7,
  },
  onlineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "limegreen",
  },
});
