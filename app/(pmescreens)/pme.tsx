// app/(pmescreens)/pme.tsx
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
import CustomDrawer from "../../components/Customrawer";

const PME_PROGRAMS = [
  {
    id: "short",
    title: "PME Kurze Variante",
    subtitle: "Schnelle Entspannung",
    desc: "Perfekt für zwischendurch – entspanne in nur 5 Minuten die wichtigsten Muskelgruppen.",
    duration: "5 Min",
    level: "Anfänger",
    icon: "flash",
    color: "#6CB0C8",
    route: "/pme_kurz_intro",
    groups: 5,
  },
  {
    id: "long",
    title: "PME Lange Variante",
    subtitle: "Tiefe Entspannung",
    desc: "Systematische Entspannung aller Muskelgruppen für maximale Tiefenentspannung.",
    level: "Fortgeschritten",
    icon: "fitness",
    color: "#7BD9C8",
    route: "/pme_lange_intro",
    duration: "15 Min",
    groups: 12,
  },
  {
    id: "face",
    title: "PME Gesicht & Schultern",
    subtitle: "Stress im Alltag lösen",
    desc: "Gezieltes Training für die häufigsten Verspannungsbereiche – ideal bei Bildschirmarbeit.",
    level: "Alle",
    icon: "happy",
    color: "#F8B7A9",
    route: "/pme_kurz_intro",
    duration: "8 Min",
    groups: 3,
  },
];

export default function PMEOverview() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <ImageBackground
      source={require("../../assets/bg.png")}
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
            <Ionicons name="body" size={40} color="#6CB0C8" />
          </View>
          <Text style={styles.heroTitle}>Progressive{"\n"}Muskelentspannung</Text>
          <Text style={styles.heroSubtitle}>
            Löse körperliche Verspannungen durch gezieltes An- und Entspannen
            verschiedener Muskelgruppen.
          </Text>
        </View>

        {/* Info-Karten */}
        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <View style={[styles.infoIcon, { backgroundColor: "#6CB0C820" }]}>
              <Ionicons name="checkmark-circle" size={24} color="#6CB0C8" />
            </View>
            <Text style={styles.infoTitle}>Wissenschaftlich</Text>
            <Text style={styles.infoText}>Bewährt</Text>
          </View>
          <View style={styles.infoCard}>
            <View style={[styles.infoIcon, { backgroundColor: "#7BD9C820" }]}>
              <Ionicons name="time" size={24} color="#7BD9C8" />
            </View>
            <Text style={styles.infoTitle}>8-25 Min</Text>
            <Text style={styles.infoText}>Flexibel</Text>
          </View>
          <View style={styles.infoCard}>
            <View style={[styles.infoIcon, { backgroundColor: "#F8B7A920" }]}>
              <Ionicons name="trending-up" size={24} color="#F8B7A9" />
            </View>
            <Text style={styles.infoTitle}>Sofort</Text>
            <Text style={styles.infoText}>Wirksam</Text>
          </View>
        </View>

        {/* Wie funktioniert es? */}
        <View style={styles.howItWorksSection}>
          <Text style={styles.sectionTitle}>💡 Wie funktioniert's?</Text>
          <View style={styles.howItWorksCard}>
            <View style={styles.stepRow}>
              <View style={[styles.stepNumber, { backgroundColor: "#6CB0C8" }]}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Anspannen</Text>
                <Text style={styles.stepDesc}>
                  Spanne eine Muskelgruppe für 5-7 Sekunden an
                </Text>
              </View>
            </View>
            <View style={styles.stepRow}>
              <View style={[styles.stepNumber, { backgroundColor: "#7BD9C8" }]}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Lösen</Text>
                <Text style={styles.stepDesc}>
                  Lasse die Spannung plötzlich los
                </Text>
              </View>
            </View>
            <View style={styles.stepRow}>
              <View style={[styles.stepNumber, { backgroundColor: "#F8B7A9" }]}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Nachspüren</Text>
                <Text style={styles.stepDesc}>
                  Spüre die Entspannung für 30 Sekunden nach
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Programme */}
        <View style={styles.programsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Wähle dein Programm</Text>
            <Text style={styles.programsCount}>{PME_PROGRAMS.length} Varianten</Text>
          </View>

          {PME_PROGRAMS.map((program) => (
            <TouchableOpacity
              key={program.id}
              style={[
                styles.programCard,
                { borderLeftColor: program.color, borderLeftWidth: 5 },
              ]}
              activeOpacity={0.85}
              onPress={() => router.push(program.route as any)}
            >
              <View
                style={[styles.programIconContainer, { backgroundColor: program.color }]}
              >
                <Ionicons name={program.icon as any} size={32} color="#fff" />
              </View>

              <View style={styles.programContent}>
                <View style={styles.programTitleRow}>
                  <Text style={styles.programTitle}>{program.title}</Text>
                  <View style={[styles.levelBadge, { backgroundColor: `${program.color}20` }]}>
                    <Text style={[styles.levelText, { color: program.color }]}>
                      {program.level}
                    </Text>
                  </View>
                </View>
                <Text style={styles.programSubtitle}>{program.subtitle}</Text>
                <Text style={styles.programDesc}>{program.desc}</Text>

                <View style={styles.programFooter}>
                  <View style={styles.programMeta}>
                    <View style={styles.metaItem}>
                      <Ionicons name="time-outline" size={16} color="#6B7280" />
                      <Text style={styles.metaText}>{program.duration}</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Ionicons name="layers-outline" size={16} color="#6B7280" />
                      <Text style={styles.metaText}>{program.groups} Gruppen</Text>
                    </View>
                  </View>
                  <View style={[styles.programArrow, { backgroundColor: program.color }]}>
                    <Ionicons name="arrow-forward" size={18} color="#fff" />
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Vorteile */}
        <View style={styles.benefitsSection}>
          <Text style={styles.sectionTitle}>✨ Vorteile von PME</Text>
          <View style={styles.benefitsGrid}>
            <View style={styles.benefitCard}>
              <View style={[styles.benefitIcon, { backgroundColor: "#6CB0C820" }]}>
                <Ionicons name="shield-checkmark" size={24} color="#6CB0C8" />
              </View>
              <Text style={styles.benefitText}>Weniger Stress</Text>
            </View>
            <View style={styles.benefitCard}>
              <View style={[styles.benefitIcon, { backgroundColor: "#7BD9C820" }]}>
                <Ionicons name="moon" size={24} color="#7BD9C8" />
              </View>
              <Text style={styles.benefitText}>Besser schlafen</Text>
            </View>
            <View style={styles.benefitCard}>
              <View style={[styles.benefitIcon, { backgroundColor: "#F8B7A920" }]}>
                <Ionicons name="fitness" size={24} color="#F8B7A9" />
              </View>
              <Text style={styles.benefitText}>Weniger Schmerzen</Text>
            </View>
            <View style={styles.benefitCard}>
              <View style={[styles.benefitIcon, { backgroundColor: "#9E86B920" }]}>
                <Ionicons name="happy" size={24} color="#9E86B9" />
              </View>
              <Text style={styles.benefitText}>Mehr Wohlbefinden</Text>
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

  /* Hero Section */
  heroSection: {
    alignItems: "center",
    marginBottom: 28,
  },
  heroIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(108, 176, 200, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 12,
    textAlign: "center",
    lineHeight: 42,
  },
  heroSubtitle: {
    fontSize: 15,
    color: "#4B5563",
    textAlign: "center",
    lineHeight: 22,
    maxWidth: 340,
  },

  /* Info Cards */
  infoSection: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 32,
  },
  infoCard: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 16,
    padding: 14,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  infoIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },
  infoText: {
    fontSize: 11,
    color: "#6B7280",
    fontWeight: "500",
  },

  /* How It Works */
  howItWorksSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
  },
  howItWorksCard: {
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 20,
    padding: 20,
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  stepRow: {
    flexDirection: "row",
    gap: 16,
    alignItems: "flex-start",
  },
  stepNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  stepNumberText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  stepDesc: {
    fontSize: 13,
    color: "#4B5563",
    lineHeight: 18,
  },

  /* Programs */
  programsSection: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  programsCount: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6CB0C8",
  },
  programCard: {
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
  programIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  programContent: {
    flex: 1,
  },
  programTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  programTitle: {
    fontSize: 17,
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
  programSubtitle: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "600",
    marginBottom: 8,
  },
  programDesc: {
    fontSize: 13,
    color: "#4B5563",
    lineHeight: 18,
    marginBottom: 12,
  },
  programFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  programMeta: {
    flexDirection: "row",
    gap: 12,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "600",
  },
  programArrow: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },

  /* Benefits */
  benefitsSection: {
    marginBottom: 20,
  },
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


