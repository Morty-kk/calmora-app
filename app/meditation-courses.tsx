import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CustomDrawer from "../components/Customrawer";

const TAGS = ["Alle", "Alltag", "Therapie", "Abend"] as const;
type Tag = (typeof TAGS)[number];

const COURSES = [
  {
    id: "gentle-morning",
    title: "Sanfte Atemreise",
    desc: "Leichter Einstieg in deine Meditation – ideal für den Morgen.",
    tag: "Alltag" as Tag,
    length: "6 Min",
    youtubeUrl: "https://www.youtube.com/watch?v=_VFRpeEQQxM", // Deutsche Morgen-Meditation
    views: "1.2M",
    rating: "4.8",
    color: "#FF6B9D", // Rosa
  },
  {
    id: "clear-head",
    title: "Klarer Kopf x 3",
    desc: "Drei kurze Sequenzen, um Grübelgedanken loszulassen.",
    tag: "Therapie" as Tag,
    length: "20 Min",
    youtubeUrl: "https://www.youtube.com/watch?v=86m4RC_ADEY", // Gedanken loslassen
    views: "890K",
    rating: "4.9",
    color: "#4ECDC4", // Türkis
  },
  {
    id: "evening-wave",
    title: "Evening Balance",
    desc: "Sanfte Entspannung für den Abend, bevor du schlafen gehst.",
    tag: "Abend" as Tag,
    length: "43 Min",
    youtubeUrl: "https://www.youtube.com/watch?v=1vx8iUvfyCY", // Einschlaf-Meditation
    views: "25M",
    rating: "4.9",
    color: "#FFB84D", // Orange
  },
  {
    id: "inner-balance",
    title: "Innere Balance",
    desc: "Finde Ruhe in dir und komme in dein Gleichgewicht.",
    tag: "Alltag" as Tag,
    length: "15 Min",
    youtubeUrl: "https://www.youtube.com/watch?v=aEqlQvczMJQ", // Entspannungsmusik
    views: "5.1M",
    rating: "4.7",
    color: "#9E86B9", // Lila
  },
];

export default function MeditationCourses() {
  const [activeTag, setActiveTag] = useState<Tag>("Alle");
  const [loading, setLoading] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const filtered =
    activeTag === "Alle"
      ? COURSES
      : COURSES.filter((c) => c.tag === activeTag);

  // Empfohlener Kurs (erster in der Liste)
  const recommendedCourse = COURSES[0];

  const handleOpenVideo = async (course: typeof COURSES[0]) => {
    try {
      setLoading(course.id);
      const supported = await Linking.canOpenURL(course.youtubeUrl);
      
      if (supported) {
        await Linking.openURL(course.youtubeUrl);
      } else {
        Alert.alert(
          "Fehler",
          "YouTube konnte nicht geöffnet werden. Bitte installiere die YouTube-App."
        );
      }
    } catch (error) {
      console.error("Error opening URL:", error);
      Alert.alert(
        "Fehler",
        "Video konnte nicht geöffnet werden. Bitte versuche es später erneut."
      );
    } finally {
      setTimeout(() => setLoading(null), 1000);
    }
  };

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
        <View style={styles.headerRow}>
          <TouchableOpacity 
            onPress={() => router.push("/menu")}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={24} color="#111827" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.headerIconRight}
            onPress={() => setDrawerOpen(true)}
            activeOpacity={0.7}
          >
            <Ionicons name="menu" size={32} color="#9E86B9" />
          </TouchableOpacity>
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Meditation</Text>
          <Text style={styles.heroSubtitle}>
            Finde innere Ruhe und stärke deine mentale Gesundheit
          </Text>
        </View>

        {/* Statistiken */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="time-outline" size={24} color="#9E86B9" />
            <Text style={styles.statNumber}>42</Text>
            <Text style={styles.statLabel}>Min heute</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="checkmark-circle" size={24} color="#4ECDC4" />
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Abgeschlossen</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="flame" size={24} color="#FFB84D" />
            <Text style={styles.statNumber}>7</Text>
            <Text style={styles.statLabel}>Tage Serie</Text>
          </View>
        </View>

        {/* Empfohlene Meditation */}
        <View style={styles.recommendedSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🌟 Für dich empfohlen</Text>
          </View>
          <TouchableOpacity
            style={[styles.recommendedCard, { borderLeftColor: recommendedCourse.color }]}
            activeOpacity={0.85}
            onPress={() => handleOpenVideo(recommendedCourse)}
            disabled={loading === recommendedCourse.id}
          >
            <View style={[styles.recommendedColorBar, { backgroundColor: recommendedCourse.color }]} />
            <View style={styles.recommendedContent}>
              <View style={{ flex: 1 }}>
                <View style={styles.recommendedBadge}>
                  <Ionicons name="sunny" size={14} color="#FFB84D" />
                  <Text style={styles.recommendedBadgeText}>Perfekt für jetzt</Text>
                </View>
                <Text style={styles.recommendedTitle}>{recommendedCourse.title}</Text>
                <Text style={styles.recommendedDesc}>{recommendedCourse.desc}</Text>
                <View style={styles.recommendedMeta}>
                  <View style={styles.metaItem}>
                    <Ionicons name="time-outline" size={16} color="#6B7280" />
                    <Text style={styles.metaText}>{recommendedCourse.length}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Ionicons name="star" size={16} color="#FCD34D" />
                    <Text style={styles.metaText}>{recommendedCourse.rating}</Text>
                  </View>
                </View>
              </View>
              <View style={[styles.recommendedPlayBtn, { backgroundColor: recommendedCourse.color }]}>
                {loading === recommendedCourse.id ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Ionicons name="play" size={28} color="#fff" />
                )}
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Kurse mit Tags */}
        <View style={styles.coursesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Alle Kurse</Text>
            <Text style={styles.coursesCount}>{filtered.length}</Text>
          </View>

          {/* Tags */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.tagScroll}
          >
            {TAGS.map((tag) => {
              const active = tag === activeTag;
              return (
                <TouchableOpacity
                  key={tag}
                  style={[styles.tag, active && styles.tagActive]}
                  onPress={() => setActiveTag(tag)}
                >
                  <Text style={[styles.tagText, active && styles.tagTextActive]}>
                    {tag}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Kurskarten */}
          <View style={styles.coursesGrid}>
            {filtered.map((course) => {
              const isLoading = loading === course.id;
              return (
                <TouchableOpacity
                  key={course.id}
                  style={styles.courseCard}
                  activeOpacity={0.85}
                  onPress={() => handleOpenVideo(course)}
                  disabled={isLoading}
                >
                  {/* Farbiger Header */}
                  <View style={[styles.courseCardHeader, { backgroundColor: course.color }]}>
                    <View style={styles.courseCardHeaderContent}>
                      <Ionicons name="logo-youtube" size={18} color="#fff" />
                      <Text style={styles.courseLength}>{course.length}</Text>
                    </View>
                  </View>

                  {/* Content */}
                  <View style={styles.courseCardBody}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.courseTitle}>{course.title}</Text>
                      <Text style={styles.courseTag}>📌 {course.tag}</Text>
                      <Text style={styles.courseDesc} numberOfLines={2}>
                        {course.desc}
                      </Text>
                      
                      <View style={styles.courseFooter}>
                        <View style={styles.courseInfoRow}>
                          <View style={styles.infoItem}>
                            <Ionicons name="eye-outline" size={12} color="#6B7280" />
                            <Text style={styles.infoText}>{course.views}</Text>
                          </View>
                          <View style={styles.infoItem}>
                            <Ionicons name="star" size={12} color="#FCD34D" />
                            <Text style={styles.infoText}>{course.rating}</Text>
                          </View>
                        </View>
                      </View>
                    </View>

                    <View
                      style={[
                        styles.coursePlayBubble,
                        { backgroundColor: course.color },
                        isLoading && styles.coursePlayBubbleLoading,
                      ]}
                    >
                      {isLoading ? (
                        <ActivityIndicator size="small" color="#fff" />
                      ) : (
                        <Ionicons name="play" size={20} color="#fff" />
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
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
  bg: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
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
  headerIconRight: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255,0.95)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  /* Hero Section */
  heroSection: {
    marginBottom: 24,
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 15,
    color: "#4B5563",
    lineHeight: 22,
  },

  /* Statistiken */
  statsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 28,
  },
  statCard: {
    flex: 1,
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
  statNumber: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 2,
    fontWeight: "500",
  },

  /* Empfohlene Meditation */
  recommendedSection: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },
  coursesCount: {
    fontSize: 16,
    fontWeight: "600",
    color: "#9E86B9",
  },
  recommendedCard: {
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 20,
    overflow: "hidden",
    borderLeftWidth: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
  },
  recommendedColorBar: {
    height: 4,
    width: "100%",
  },
  recommendedContent: {
    padding: 20,
    flexDirection: "row",
    gap: 16,
  },
  recommendedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FFF7ED",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  recommendedBadgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#EA580C",
  },
  recommendedTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  recommendedDesc: {
    fontSize: 14,
    color: "#4B5563",
    lineHeight: 20,
    marginBottom: 12,
  },
  recommendedMeta: {
    flexDirection: "row",
    gap: 16,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "600",
  },
  recommendedPlayBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },

  /* Kurse Section */
  coursesSection: {
    marginTop: 8,
  },
  tagScroll: {
    marginBottom: 20,
  },
  tag: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "rgba(148,163,184,0.3)",
    backgroundColor: "rgba(255,255,255,0.8)",
    marginRight: 10,
  },
  tagActive: {
    backgroundColor: "#9E86B9",
    borderColor: "#9E86B9",
  },
  tagText: {
    fontSize: 14,
    color: "#475569",
    fontWeight: "600",
  },
  tagTextActive: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  /* Kurskarten Grid */
  coursesGrid: {
    gap: 16,
  },
  courseCard: {
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 18,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  courseCardHeader: {
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  courseCardHeaderContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  courseLength: {
    fontSize: 13,
    fontWeight: "700",
    color: "#fff",
  },
  courseCardBody: {
    padding: 16,
    flexDirection: "row",
    gap: 12,
  },
  courseTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  courseTag: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 8,
    fontWeight: "500",
  },
  courseDesc: {
    fontSize: 13,
    color: "#4B5563",
    lineHeight: 18,
    marginBottom: 12,
  },
  courseFooter: {
    marginTop: "auto",
  },
  courseInfoRow: {
    flexDirection: "row",
    gap: 12,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  infoText: {
    fontSize: 11,
    color: "#6B7280",
    fontWeight: "600",
  },
  coursePlayBubble: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-end",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  coursePlayBubbleLoading: {
    opacity: 0.7,
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