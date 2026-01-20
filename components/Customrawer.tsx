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
          <TouchableOpacity onPress={() => go("Chat")} style={styles.item}>
            <Text style={styles.itemText}>Chat</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mein Profil</Text>
          <TouchableOpacity onPress={() => go("Uebungen")} style={styles.item}>
            <Text style={styles.itemText}>Übungen</Text>
          </TouchableOpacity>
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
    backgroundColor: "#F5D8D0", // peach
    width: 280,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  header: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#BFA9A0",
    paddingBottom: 10,
  },
  section: {
    marginTop: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#D8BFB7",
    paddingBottom: 12,
  },
  sectionTitle: {
    color: "#4A3F3C",
    marginBottom: 8,
    fontSize: 14,
    fontWeight: "600",
  },
  item: {
    paddingVertical: 6,
  },
  itemText: {
    color: "#6B5B58",
    fontSize: 14,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#D8BFB7",
  },
  logout: {},
  logoutText: {
    color: "#B12A2A",
    fontWeight: "600",
  },
});

export default CustomDrawer;