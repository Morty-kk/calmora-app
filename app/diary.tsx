import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import React from "react";
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

/* ✅ KALENDER-FUNKTION */
function buildMonth(year: number, month: number) {
  const first = new Date(year, month, 1);
  const start = new Date(first);
  start.setDate(first.getDate() - ((first.getDay() + 6) % 7));

  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

export default function Diary() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = React.useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [entries, setEntries] = React.useState<any[]>([]);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const load = async () => {
        const stored = await AsyncStorage.getItem("diary");
        if (stored) setEntries(JSON.parse(stored));
      };
      load();
    }, [])
  );

  const todayLabel = today.toLocaleDateString("de-DE");

  return (
    <ImageBackground
      source={require("../assets/bg.png")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push('/menu')} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#9E86B9" />
          </TouchableOpacity>
          <Text style={styles.brand}>Calmora</Text>
          <TouchableOpacity onPress={() => setDrawerOpen(true)}>
            <Ionicons name="menu" size={28} color="#9E86B9" />
          </TouchableOpacity>
        </View>

        {/* Hero Section */}
        <View style={styles.hero}>
          <View style={styles.heroIcon}>
            <Ionicons name="book" size={40} color="#9E86B9" />
          </View>
          <Text style={styles.heroTitle}>Mein Tagebuch</Text>
          <Text style={styles.heroSubtitle}>
            Dokumentiere deine Gedanken und Gefühle
          </Text>
        </View>

        {/* Einträge */}
        {entries.length > 0 ? (
          <View style={styles.entriesSection}>
            <Text style={styles.sectionTitle}>Deine Einträge</Text>
            {entries.map((entry) => (
              <TouchableOpacity key={entry.id} style={styles.card} activeOpacity={0.8}>
                <View style={styles.cardContent}>
                  <View style={styles.cardHeader}>
                    <Ionicons name="calendar-outline" size={16} color="#9E86B9" />
                    <Text style={styles.cardDate}>{entry.date}</Text>
                  </View>
                  <Text style={styles.cardPreview} numberOfLines={2}>
                    {entry.text || 'Kein Text'}
                  </Text>
                </View>
                <Text style={styles.mood}>{entry.mood}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="book-outline" size={64} color="#D1D5DB" />
            <Text style={styles.emptyText}>Noch keine Einträge</Text>
            <Text style={styles.emptySubtext}>Erstelle deinen ersten Tagebucheintrag</Text>
          </View>
        )}

        {/* Neu Erstellen Button */}
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => router.push("/diary-create")}
          activeOpacity={0.8}
        >
          <Ionicons name="add-circle" size={24} color="#fff" />
          <Text style={styles.addText}>Neuer Eintrag</Text>
        </TouchableOpacity>

        {/* Kalender */}
        <View style={styles.calendarCard}>
          <View style={styles.monthRow}>
            <TouchableOpacity
              onPress={() =>
                setCurrentMonth(
                  (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
                )
              }
              style={styles.monthBtn}
            >
              <Ionicons name="chevron-back" size={20} color="#9E86B9" />
            </TouchableOpacity>

            <Text style={styles.month}>
              {currentMonth.toLocaleString("de-DE", { month: "long", year: "numeric" })}
            </Text>

            <TouchableOpacity
              onPress={() =>
                setCurrentMonth(
                  (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
                )
              }
              style={styles.monthBtn}
            >
              <Ionicons name="chevron-forward" size={20} color="#9E86B9" />
            </TouchableOpacity>
          </View>

          {/* Wochentage */}
          <View style={styles.weekRow}>
            {["M", "D", "M", "D", "F", "S", "S"].map((d, idx) => (
              <Text key={idx} style={styles.weekDay}>{d}</Text>
            ))}
          </View>

          {/* Kalender Grid */}
          <View style={styles.calendar}>
            {buildMonth(currentMonth.getFullYear(), currentMonth.getMonth()).map(
              (d, i) => {
                const isToday =
                  d.getDate() === today.getDate() &&
                  d.getMonth() === today.getMonth() &&
                  d.getFullYear() === today.getFullYear();

                const inMonth = d.getMonth() === currentMonth.getMonth();

                return (
                  <Text
                    key={i}
                    style={[
                      styles.day,
                      !inMonth && { opacity: 0.3 },
                      isToday && styles.today,
                    ]}
                  >
                    {d.getDate()}
                  </Text>
                );
              }
            )}
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
  container: { flex: 1, padding: 20 },

  /* HEADER */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
  },
  brand: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1F2937",
    letterSpacing: 0.5,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  /* HERO */
  hero: {
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  heroIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F3E8FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1F2937",
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },

  /* ENTRIES */
  entriesSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    flex: 1,
    marginRight: 12,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  cardDate: {
    fontSize: 13,
    fontWeight: "600",
    color: "#9E86B9",
  },
  cardPreview: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
  mood: {
    fontSize: 32,
  },

  /* EMPTY STATE */
  emptyState: {
    alignItems: "center",
    paddingVertical: 48,
    gap: 12,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#9CA3AF",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#D1D5DB",
  },

  /* ADD BUTTON */
  addBtn: {
    flexDirection: "row",
    alignSelf: "center",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#9E86B9",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginBottom: 24,
    shadowColor: "#9E86B9",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  addText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#fff",
  },

  /* CALENDAR CARD */
  calendarCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  monthRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  monthBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3E8FF",
  },
  month: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    textTransform: "capitalize",
  },

  weekRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  weekDay: {
    width: 40,
    textAlign: "center",
    color: "#9CA3AF",
    fontWeight: "600",
    fontSize: 12,
  },

  calendar: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  day: {
    width: "14.2%",
    textAlign: "center",
    paddingVertical: 10,
    fontWeight: "600",
    color: "#1F2937",
    fontSize: 14,
  },
  today: {
    backgroundColor: "#9E86B9",
    color: "#fff",
    borderRadius: 20,
    overflow: "hidden",
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
