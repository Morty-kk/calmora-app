import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  navigation: any;
  onLogout?: () => void;
};

const CustomDrawer: React.FC<Props> = ({ navigation, onLogout }) => {
  const [therapyExpanded, setTherapyExpanded] = useState(false);
  const [profileExpanded, setProfileExpanded] = useState(false);

  const go = (routeName: string) => {
    navigation.navigate(routeName as never);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.drawerHeader}>
        <View style={styles.headerIconContainer}>
          <Ionicons name="menu" size={28} color="#9E86B9" />
        </View>
        <Text style={styles.headerTitle}>Menü</Text>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Home */}
        <TouchableOpacity 
          onPress={() => go("menu")} 
          style={styles.menuItem}
          activeOpacity={0.7}
        >
          <View style={styles.menuItemIcon}>
            <Ionicons name="home" size={22} color="#9E86B9" />
          </View>
          <Text style={styles.menuItemText}>Home</Text>
        </TouchableOpacity>

        {/* Meine Therapie */}
        <View style={styles.section}>
          <TouchableOpacity 
            onPress={() => setTherapyExpanded(!therapyExpanded)}
            style={styles.sectionHeader}
            activeOpacity={0.7}
          >
            <View style={styles.sectionHeaderLeft}>
              <View style={styles.sectionIcon}>
                <Ionicons name="medical" size={20} color="#9E86B9" />
              </View>
              <Text style={styles.sectionTitle}>Meine Therapie</Text>
            </View>
            <Ionicons 
              name={therapyExpanded ? "chevron-up" : "chevron-down"} 
              size={20} 
              color="#9E86B9" 
            />
          </TouchableOpacity>

          {therapyExpanded && (
            <View style={styles.subMenu}>
              <TouchableOpacity 
                onPress={() => go("/appointment")} 
                style={styles.subMenuItem}
                activeOpacity={0.7}
              >
                <View style={styles.subMenuDot} />
                <Text style={styles.subMenuText}>Sitzungen</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => go("/appointment")} 
                style={styles.subMenuItem}
                activeOpacity={0.7}
              >
                <View style={styles.subMenuDot} />
                <Text style={styles.subMenuText}>Termine</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => go("/chat-list")} 
                style={styles.subMenuItem}
                activeOpacity={0.7}
              >
                <View style={styles.subMenuDot} />
                <Text style={styles.subMenuText}>Chat</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Mein Profil Section */}
        <View style={styles.section}>
          <TouchableOpacity 
            onPress={() => setProfileExpanded(!profileExpanded)}
            style={styles.sectionHeader}
            activeOpacity={0.7}
          >
            <View style={styles.sectionHeaderLeft}>
              <View style={styles.sectionIcon}>
                <Ionicons name="person" size={20} color="#9E86B9" />
              </View>
              <Text style={styles.sectionTitle}>Mein Profil</Text>
            </View>
            <Ionicons 
              name={profileExpanded ? "chevron-up" : "chevron-down"} 
              size={20} 
              color="#9E86B9" 
            />
          </TouchableOpacity>

          {profileExpanded && (
            <View style={styles.subMenu}>
              <TouchableOpacity 
                onPress={() => go("Uebungen")} 
                style={styles.subMenuItem}
                activeOpacity={0.7}
              >
                <View style={styles.subMenuDot} />
                <Text style={styles.subMenuText}>Übungen</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => go("/diary")} 
                style={styles.subMenuItem}
                activeOpacity={0.7}
              >
                <View style={styles.subMenuDot} />
                <Text style={styles.subMenuText}>Tagebuch</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={() => {
            if (onLogout) onLogout();
            else navigation.reset({ index: 0, routes: [{ name: "Login" }] });
          }}
          style={styles.logoutButton}
          activeOpacity={0.7}
        >
          <Ionicons name="log-out-outline" size={22} color="#EF4444" />
          <Text style={styles.logoutText}>Abmelden</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5D8D0",
  },

  /* HEADER */
  drawerHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: "#F9EDE9",
    borderBottomWidth: 1,
    borderBottomColor: "#E5C9C1",
  },
  headerIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F3E6FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1F2937",
  },

  /* SCROLL */
  scroll: {
    paddingHorizontal: 12,
    paddingTop: 16,
    paddingBottom: 20,
  },

  /* MENU ITEM */
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: "rgba(255,255,255,0.6)",
  },
  menuItemIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F3E6FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },

  /* SECTION */
  section: {
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.5)",
    marginBottom: 4,
  },
  sectionHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F3E6FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
  },

  /* SUBMENU */
  subMenu: {
    paddingLeft: 24,
    paddingTop: 4,
  },
  subMenuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 4,
  },
  subMenuDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#9E86B9",
    marginRight: 12,
  },
  subMenuText: {
    fontSize: 15,
    color: "#6B7280",
    fontWeight: "500",
  },

  /* FOOTER */
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5C9C1",
    backgroundColor: "#F9EDE9",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.8)",
    borderWidth: 1,
    borderColor: "#FEE2E2",
    gap: 8,
  },
  logoutText: {
    color: "#EF4444",
    fontWeight: "700",
    fontSize: 16,
  },
});

export default CustomDrawer;