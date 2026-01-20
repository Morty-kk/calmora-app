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
    View
} from "react-native";
import CustomDrawer from "../components/Customrawer";

const BREATH_EXERCISES = [
  {
    id: "446",
    title: "4-4-6 Atmung",
    subtitle: "Entspannung",
    desc: "Ruhige Atemübung zur schnellen Entspannung. Ideal nach einem stressigen Moment.",
    duration: "3-5 Min",
    level: "Anfänger",
    icon: "water",
    color: "#4ECDC4",
    pattern: "4 Sek einatmen · 4 Sek halten · 6 Sek ausatmen",
  },
  {
    id: "478",
    title: "4-7-8 Atmung",
    subtitle: "Tiefenentspannung",
    desc: "Beruhigt das Nervensystem und hilft beim Einschlafen. Die Lieblingsübung vieler.",
    duration: "5-10 Min",
    level: "Alle",
    icon: "moon",
    color: "#8B5CF6",
    pattern: "4 Sek einatmen · 7 Sek halten · 8 Sek ausatmen",
  },
  {
    id: "444",
    title: "4-4-4 Box Breathing",
    subtitle: "Fokus & Klarheit",
    desc: "Gleichmäßige Atmung für mentale Klarheit. Wird von Navy SEALs verwendet.",
    duration: "5 Min",
    level: "Fortgeschritten",
    icon: "square",
    color: "#9E86B9",
    pattern: "4 Sek einatmen · 4 Sek halten · 4 Sek ausatmen · 4 Sek halten",
  },
  {
    id: "366",
    title: "3-6-6 Atmung",
    subtitle: "Stress-Abbau",
    desc: "Beruhigende Technik gegen akuten Stress und Angst. Schnelle Wirkung.",
    duration: "3-5 Min",
    level: "Anfänger",
    icon: "leaf",
    color: "#10B981",
    pattern: "3 Sek einatmen · 6 Sek halten · 6 Sek ausatmen",
  },
];

export default function BreathMenu() {
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
            <Ionicons name="fitness" size={40} color="#9E86B9" />
          </View>
          <Text style={styles.heroTitle}>Atemübungen</Text>
          <Text style={styles.heroSubtitle}>
            Dein Atem ist dein mächtigstes Werkzeug gegen Stress und Angst.
            Nutze ihn bewusst.
          </Text>
        </View>

        {/* Info Cards */}
        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <Ionicons name="flash-outline" size={24} color="#9E86B9" />
            <Text style={styles.infoTitle}>Sofortwirkung</Text>
            <Text style={styles.infoDesc}>
              Beruhigt in 60 Sekunden dein Nervensystem
            </Text>
          </View>

          <View style={styles.infoCard}>
            <Ionicons name="location-outline" size={24} color="#9E86B9" />
            <Text style={styles.infoTitle}>Überall</Text>
            <Text style={styles.infoDesc}>
              Keine Hilfsmittel nötig – immer dabei
            </Text>
          </View>

          <View style={styles.infoCard}>
            <Ionicons name="checkmark-circle-outline" size={24} color="#9E86B9" />
            <Text style={styles.infoTitle}>Bewährt</Text>
            <Text style={styles.infoDesc}>
              Wissenschaftlich nachgewiesene Wirkung
            </Text>
          </View>
        </View>

        {/* Exercises Section */}
        <View style={styles.exercisesSection}>
          <Text style={styles.sectionTitle}>Wähle deine Übung</Text>
          <Text style={styles.sectionSubtitle}>
            Jede Technik hat ihre eigene Wirkung – probiere aus, was zu dir
            passt
          </Text>

          {BREATH_EXERCISES.map((exercise) => (
            <TouchableOpacity
              key={exercise.id}
              style={[
                styles.exerciseCard,
                { borderLeftColor: exercise.color },
              ]}
              onPress={() => router.push(`/breath-exercise?id=${exercise.id}`)}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.exerciseIconContainer,
                  { backgroundColor: exercise.color + "20" },
                ]}
              >
                <Ionicons
                  name={exercise.icon as any}
                  size={28}
                  color={exercise.color}
                />
              </View>

              <View style={styles.exerciseContent}>
                <Text style={styles.exerciseTitle}>{exercise.title}</Text>
                <Text style={styles.exerciseSubtitle}>
                  {exercise.subtitle}
                </Text>
                <Text style={styles.exerciseDesc}>{exercise.desc}</Text>
                <Text style={styles.exercisePattern}>{exercise.pattern}</Text>

                <View style={styles.exerciseMeta}>
                  <View style={styles.metaBadge}>
                    <Ionicons name="time-outline" size={14} color="#6B7280" />
                    <Text style={styles.metaText}>{exercise.duration}</Text>
                  </View>
                  <View style={styles.metaBadge}>
                    <Ionicons
                      name="bar-chart-outline"
                      size={14}
                      color="#6B7280"
                    />
                    <Text style={styles.metaText}>{exercise.level}</Text>
                  </View>
                </View>
              </View>

              <Ionicons name="chevron-forward" size={24} color="#9CA3AF" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Benefits Grid */}
        <View style={styles.benefitsSection}>
          <Text style={styles.sectionTitle}>Warum Atemübungen?</Text>

          <View style={styles.benefitsGrid}>
            <View style={styles.benefitCard}>
              <Ionicons name="heart-dislike" size={28} color="#EF4444" />
              <Text style={styles.benefitTitle}>Weniger Angst</Text>
              <Text style={styles.benefitDesc}>
                Aktiviert deinen Parasympathikus
              </Text>
            </View>

            <View style={styles.benefitCard}>
              <Ionicons name="pulse" size={28} color="#10B981" />
              <Text style={styles.benefitTitle}>Ruhiger Herzschlag</Text>
              <Text style={styles.benefitDesc}>Senkt Puls und Blutdruck</Text>
            </View>

            <View style={styles.benefitCard}>
              <Ionicons name="moon" size={28} color="#8B5CF6" />
              <Text style={styles.benefitTitle}>Besserer Schlaf</Text>
              <Text style={styles.benefitDesc}>
                Hilft beim schnelleren Einschlafen
              </Text>
            </View>

            <View style={styles.benefitCard}>
              <Ionicons name="bulb" size={28} color="#F59E0B" />
              <Text style={styles.benefitTitle}>Mehr Fokus</Text>
              <Text style={styles.benefitDesc}>
                Steigert Konzentration und Klarheit
              </Text>
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
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },

  /* HEADER */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.95)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconBubble: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255,0.95)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  /* HERO */
  heroSection: {
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  heroIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#F3F0FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 8,
    textAlign: "center",
  },
  heroSubtitle: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 22,
  },

  /* INFO SECTION */
  infoSection: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 32,
  },
  infoCard: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1F2937",
    marginTop: 8,
    marginBottom: 4,
    textAlign: "center",
  },
  infoDesc: {
    fontSize: 11,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 15,
  },

  /* EXERCISES SECTION */
  exercisesSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 6,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 20,
  },
  exerciseCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  exerciseIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  exerciseContent: {
    flex: 1,
  },
  exerciseTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 2,
  },
  exerciseSubtitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#9E86B9",
    marginBottom: 6,
  },
  exerciseDesc: {
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 18,
    marginBottom: 6,
  },
  exercisePattern: {
    fontSize: 12,
    color: "#9CA3AF",
    fontStyle: "italic",
    marginBottom: 10,
  },
  exerciseMeta: {
    flexDirection: "row",
    gap: 12,
  },
  metaBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  metaText: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "600",
  },

  /* BENEFITS SECTION */
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
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  benefitTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1F2937",
    marginTop: 10,
    marginBottom: 4,
    textAlign: "center",
  },
  benefitDesc: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 16,
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