import { router } from "expo-router";
import {
    ImageBackground,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function SinneDone() {
  return (
    <ImageBackground
      source={require("../assets/bg.png")}
      resizeMode="cover"
      style={styles.bg}
    >
      <View style={styles.container}>

        {/* SAME DOTS STYLE AS BODYSCAN */}
        <View style={styles.dotsContainer}>
          {[1, 2, 3, 4, 5].map((_, i) => (
            <View key={i} style={styles.dot} />
          ))}
        </View>

        <Text style={styles.title}>Geschafft!</Text>

        <Text style={styles.subtitle}>
          Du hast den 5-Sinne Check beendet.{"\n"}Gut gemacht!
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/achtsamkeit")}
        >
          <Text style={styles.buttonText}>Beenden</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },

  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  /** DOTS EXACTLY LIKE BODYSCAN */
  dotsContainer: {
    flexDirection: "row",
    position: "absolute",
    top: 80,
    gap: 10,
  },

  dot: {
    width: 12,
    height: 12,
    borderRadius: 50,
    backgroundColor: "#ffffff90",
  },

  /** TITLE STYLE SAME AS BODYSCAN */
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#3B3B3B",
    marginBottom: 12,
    textAlign: "center",
  },

  subtitle: {
    fontSize: 18,
    color: "#333",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 26,
  },

  /** PURPLE BUTTON EXACT SAME STYLE */
  button: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 14,
    borderWidth: 3,
    borderColor: "#9E86B9",
  },

  buttonText: {
    color: "#9E86B9",
    fontSize: 20,
    fontWeight: "700",
  },
});

