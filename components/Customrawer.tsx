import { DrawerContentComponentProps } from "@react-navigation/drawer";
import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Props = DrawerContentComponentProps & {
  onLogout?: () => void;
};

const CustomDrawer: React.FC<Props> = ({ navigation, onLogout }) => {
  const go = (routeName: string) => {
    navigation.navigate(routeName as never);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.header}>Menü:</Text>

        <View style={styles.section}>
          <TouchableOpacity onPress={() => go("Home")} style={styles.item}>
            <Text style={styles.itemText}>Home</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Meine Therapie</Text>
          <TouchableOpacity onPress={() => go("Sitzungen")} style={styles.item}>
            <Text style={styles.itemText}>Sitzungen</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => go("Termine")} style={styles.item}>
            <Text style={styles.itemText}>Termine</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mein Profil</Text>
          <TouchableOpacity onPress={() => go("Tagebuch")} style={styles.item}>
            <Text style={styles.itemText}>Tagebuch</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          onPress={() => {
            if (onLogout) onLogout();
            else navigation.reset({ index: 0, routes: [{ name: "Login" }] });
          }}
          style={styles.logout}
        >
          <Text style={styles.logoutText}>abmelden</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F5F3",
    width: 280,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  scroll: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 24,
    color: "#2D2424",
    borderBottomWidth: 2,
    borderBottomColor: "#9E86B9",
    paddingBottom: 16,
  },
  section: {
    marginTop: 20,
    marginBottom: 8,
  },
  sectionTitle: {
    color: "#9E86B9",
    marginBottom: 12,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  item: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 4,
    borderRadius: 12,
    backgroundColor: "rgba(158, 134, 185, 0.08)",
  },
  itemText: {
    color: "#2D2424",
    fontSize: 16,
    fontWeight: "500",
  },
  footer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: "#E5DED9",
    marginTop: "auto",
  },
  logout: {
    backgroundColor: "rgba(177, 42, 42, 0.1)",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  logoutText: {
    color: "#B12A2A",
    fontWeight: "700",
    fontSize: 16,
  },
});

export default CustomDrawer;