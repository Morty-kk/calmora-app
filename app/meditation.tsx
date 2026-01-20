import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  ImageBackground,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CustomDrawer from "../components/Customrawer";

const MEDITATION_TYPES = [
  {
    id: "guided",
    title: "Geführte Meditation",
    subtitle: "Mit beruhigender Stimme",
    desc: "Starte mit einer sanften, geführten Meditation, um deinen Tag ruhig zu beginnen.",
    duration: "10-30 Min",
    level: "Anfänger",
    icon: "headset",
    color: "#9E86B9",
  },
  {
    id: "breathing",
    title: "Atemübungen",
    subtitle: "Fokus & Entspannung",
    desc: "Beruhige deinen Geist durch bewusste Atemtechniken und finde innere Balance.",
    duration: "5-15 Min",
    level: "Alle",
    icon: "water",
    color: "#4ECDC4",
  },
  {
    id: "body-scan",
    title: "Body Scan",
    subtitle: "Körperbewusstsein",
    desc: "Entspanne systematisch jeden Teil deines Körpers und löse Verspannungen.",
    duration: "15-30 Min",
    level: "Fortgeschritten",
    icon: "body",
    color: "#FFB84D",
  },
];

export default function MeditationIntro() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <ImageBackground
      source={require("../assets/bg.png")}
      style={styles.bg}
      resizeMode="cover"
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.push("/menu")}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={24} color="#111827" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.iconBubble}
            onPress={() => setDrawerOpen(true)}
            activeOpacity={0.7}
          >
            <Ionicons name="menu" size={32} color="#9E86B9" />
          </TouchableOpacity>
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroIconContainer}>
            <Ionicons name="flower" size={40} color="#9E86B9" />
          </View>
          <Text style={styles.heroTitle}>Meditation</Text>
          <Text style={styles.heroSubtitle}>
            Beruhigt den Geist, stärkt die Aufmerksamkeit und hilft dir,
            abzuschalten. Finde deine innere Ruhe.
          </Text>
        </View>

        {/* Schnellstart-Karte */}
        <View style={styles.quickStartSection}>
          <Text style={styles.sectionTitle}>🚀 Schnellstart</Text>
          <TouchableOpacity
            style={styles.quickStartCard}
            activeOpacity={0.85}
            onPress={() => router.push("/meditation-courses")}
          >
            <View style={styles.quickStartContent}>
              <View style={{ flex: 1 }}>
                <View style={styles.quickStartBadge}>
                  <Ionicons name="sparkles" size={14} color="#FFB84D" />
                  <Text style={styles.quickStartBadgeText}>Beliebt</Text>
                </View>
                <Text style={styles.quickStartTitle}>Alle Meditationen</Text>
                <Text style={styles.quickStartDesc}>
                  Entdecke unsere Auswahl an geführten Meditationen
                </Text>
                <View style={styles.quickStartMeta}>
                  <View style={styles.quickStartMetaItem}>
                    <Ionicons name="videocam" size={16} color="#E5E7EB" />
                    <Text style={styles.quickStartMetaText}>4 Videos</Text>
                  </View>
                  <View style={styles.quickStartMetaItem}>
                    <Ionicons name="time" size={16} color="#E5E7EB" />
                    <Text style={styles.quickStartMetaText}>5-40 Min</Text>
                  </View>
                </View>
              </View>
              <View style={styles.quickStartPlayBtn}>
                <Ionicons name="play" size={32} color="#fff" />
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Meditationsarten */}
        <View style={styles.typesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Wähle deinen Stil</Text>
            <Text style={styles.sectionSubtitle}>3 Optionen</Text>
          </View>

          {MEDITATION_TYPES.map((type) => (
            <TouchableOpacity
              key={type.id}
              style={[
                styles.typeCard,
                { borderLeftColor: type.color, borderLeftWidth: 4 },
              ]}
              activeOpacity={0.85}
              onPress={() => router.push("/meditation-courses")}
            >
              <View style={[styles.typeIconContainer, { backgroundColor: type.color }]}>
                <Ionicons name={type.icon as any} size={28} color="#fff" />
              </View>
              <View style={styles.typeContent}>
                <View style={styles.typeTitleRow}>
                  <Text style={styles.typeTitle}>{type.title}</Text>
                  <View style={[styles.levelBadge, { backgroundColor: `${type.color}20` }]}>
                    <Text style={[styles.levelText, { color: type.color }]}>
                      {type.level}
                    </Text>
                  </View>
                </View>
                <Text style={styles.typeSubtitle}>{type.subtitle}</Text>
                <Text style={styles.typeDesc}>{type.desc}</Text>
                <View style={styles.typeFooter}>
                  <View style={styles.typeDuration}>
                    <Ionicons name="time-outline" size={16} color="#6B7280" />
                    <Text style={styles.typeDurationText}>{type.duration}</Text>
                  </View>
                  <View style={[styles.typeArrow, { backgroundColor: type.color }]}>
                    <Ionicons name="arrow-forward" size={16} color="#fff" />
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Vorteile */}
        <View style={styles.benefitsSection}>
          <Text style={styles.sectionTitle}>✨ Warum meditieren?</Text>
          <View style={styles.benefitsGrid}>
            <View style={styles.benefitCard}>
              <View style={[styles.benefitIcon, { backgroundColor: "#FF6B9D20" }]}>
                <Ionicons name="heart" size={24} color="#FF6B9D" />
              </View>
              <Text style={styles.benefitText}>Reduziert Stress</Text>
            </View>
            <View style={styles.benefitCard}>
              <View style={[styles.benefitIcon, { backgroundColor: "#4ECDC420" }]}>
                <Ionicons name="bulb" size={24} color="#4ECDC4" />
              </View>
              <Text style={styles.benefitText}>Mehr Fokus</Text>
            </View>
            <View style={styles.benefitCard}>
              <View style={[styles.benefitIcon, { backgroundColor: "#FFB84D20" }]}>
                <Ionicons name="moon" size={24} color="#FFB84D" />
              </View>
              <Text style={styles.benefitText}>Besser schlafen</Text>
            </View>
            <View style={styles.benefitCard}>
              <View style={[styles.benefitIcon, { backgroundColor: "#9E86B920" }]}>
                <Ionicons name="happy" size={24} color="#9E86B9" />
              </View>
              <Text style={styles.benefitText}>Mehr Freude</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Drawer Modal */}
      <Modal
        visible={drawerOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setDrawerOpen(false)}
      >
        <View style={styles.drawerContainer}>
          <TouchableOpacity 
            style={styles.drawerOverlay}
            activeOpacity={1}
            onPress={() => setDrawerOpen(false)}
          />
          <View style={styles.drawerContent}>
            <CustomDrawer 
              navigation={{ navigate: (route: string) => { router.push(route as any); setDrawerOpen(false); } } as any}
              onLogout={() => { setDrawerOpen(false); router.push("/login-patient"); }}
            />
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  scrollContent: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.9)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  iconBubble: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.9)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  heroSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  heroIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(158, 134, 185, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 40,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 12,
  },
  heroSubtitle: {
    fontSize: 15,
    color: "#4B5563",
    textAlign: "center",
    lineHeight: 22,
    maxWidth: 320,
  },
  quickStartSection: { marginBottom: 32 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
  },
  quickStartCard: {
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "#9E86B9",
    shadowColor: "#9E86B9",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  quickStartContent: {
    padding: 24,
    flexDirection: "row",
    gap: 16,
  },
  quickStartBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginBottom: 12,
  },
  quickStartBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#fff",
  },
  quickStartTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 8,
  },
  quickStartDesc: {
    fontSize: 14,
    color: "#E5E7EB",
    lineHeight: 20,
    marginBottom: 16,
  },
  quickStartMeta: {
    flexDirection: "row",
    gap: 16,
  },
  quickStartMetaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  quickStartMetaText: {
    fontSize: 13,
    color: "#E5E7EB",
    fontWeight: "600",
  },
  quickStartPlayBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  typesSection: { marginBottom: 32 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
  typeCard: {
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    flexDirection: "row",
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  typeIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  typeContent: { flex: 1 },
  typeTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  typeTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    flex: 1,
  },
  levelBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  levelText: {
    fontSize: 11,
    fontWeight: "700",
  },
  typeSubtitle: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "600",
    marginBottom: 8,
  },
  typeDesc: {
    fontSize: 13,
    color: "#4B5563",
    lineHeight: 18,
    marginBottom: 12,
  },
  typeFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  typeDuration: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  typeDurationText: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "600",
  },
  typeArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  benefitsSection: { marginBottom: 20 },
  benefitsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  benefitCard: {
    width: "48%",
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  benefitIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  benefitText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    textAlign: "center",
  },

  /* DRAWER */
  drawerContainer: {
    flex: 1,
    flexDirection: "row",
  },
  drawerOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  drawerContent: {
    width: 280,
    height: "100%",
  },
});
