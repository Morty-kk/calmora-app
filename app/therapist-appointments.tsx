import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

type MonthDef = {
  name: string;
  daysInMonth: number;
  // 0=So,1=Mo...6=Sa
  firstDayIndex: number;
  highlighted: number[]; // rote Kreise
  outlined: number[]; // rote Umrandung
};

function DayCell({
  day,
  isHighlighted,
  isOutlined,
}: {
  day: number | null;
  isHighlighted: boolean;
  isOutlined: boolean;
}) {
  if (day === null) {
    return <View style={styles.dayCell} />;
  }

  const circleStyle = isHighlighted
    ? styles.circleFilled
    : isOutlined
    ? styles.circleOutline
    : null;

  const textStyle = isHighlighted ? styles.dayTextFilled : styles.dayText;

  return (
    <View style={styles.dayCell}>
      <View style={[styles.circleBase, circleStyle]}>
        <Text style={textStyle}>{day}</Text>
      </View>
    </View>
  );
}

function MonthCalendar({ month }: { month: MonthDef }) {
  const weekdays = ["S", "M", "T", "W", "T", "F", "S"];

  const grid = useMemo(() => {
    const cells: Array<number | null> = [];
    for (let i = 0; i < month.firstDayIndex; i++) cells.push(null);
    for (let d = 1; d <= month.daysInMonth; d++) cells.push(d);
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [month]);

  return (
    <View style={styles.monthBlock}>
      <Text style={styles.monthTitle}>{month.name}</Text>

      <View style={styles.weekRow}>
        {weekdays.map((w) => (
          <Text key={w} style={[styles.weekday, w === "S" ? styles.sunday : null]}>
            {w}
          </Text>
        ))}
      </View>

      <View style={styles.grid}>
        {grid.map((d, idx) => {
          const isHighlighted = d !== null && month.highlighted.includes(d);
          const isOutlined = d !== null && month.outlined.includes(d);
          return (
            <DayCell
              key={`${month.name}-${idx}`}
              day={d}
              isHighlighted={isHighlighted}
              isOutlined={isOutlined}
            />
          );
        })}
      </View>
    </View>
  );
}

export default function TherapistAppointments() {
  const [menuOpen, setMenuOpen] = useState(false);

  const year = 2025;

  // ✅ Beispielwerte wie Screenshot (kannst du jederzeit ändern)
  const months: MonthDef[] = useMemo(
    () => [
      {
        name: "Februar",
        daysInMonth: 28,
        firstDayIndex: 6, // Sa (nur fürs Layout)
        highlighted: [14, 28],
        outlined: [4, 10, 16, 19, 23],
      },
      {
        name: "März",
        daysInMonth: 31,
        firstDayIndex: 6,
        highlighted: [8, 14, 17, 21],
        outlined: [],
      },
      {
        name: "April",
        daysInMonth: 30,
        firstDayIndex: 2,
        highlighted: [8],
        outlined: [],
      },
    ],
    []
  );

  const go = (path: string) => {
    setMenuOpen(false);
    router.replace(path as any);
  };

  return (
    <View style={styles.container}>
      {/* Scroll area */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Top row */}
        <View style={styles.topRow}>
          <Pressable onPress={() => router.back()} hitSlop={10} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </Pressable>

          <View style={{ flex: 1 }}>
            <Text style={styles.pageTitle}>Termine</Text>
            <View style={styles.topDivider} />
          </View>

          <Text style={styles.year}>{year}</Text>

          <Pressable onPress={() => setMenuOpen(true)} hitSlop={10} style={styles.menuBtn}>
            <Ionicons name="menu" size={26} color="#333" />
          </Pressable>
        </View>

        {/* Months */}
        {months.map((m) => (
          <View key={m.name}>
            <MonthCalendar month={m} />
            <View style={styles.sectionDivider} />
          </View>
        ))}

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom Tabs */}
      <View style={styles.tabs}>
        <Pressable style={styles.tab} onPress={() => router.replace("/therapist-home")}>
          <Ionicons name="home" size={22} color="#111" />
          <Text style={styles.tabTextActive}>Startseite</Text>
        </Pressable>

        <Pressable style={styles.tab} onPress={() => router.push("/chat-list")}>
          <Ionicons name="chatbubbles-outline" size={22} color="#111" />
          <Text style={styles.tabText}>Chat</Text>
        </Pressable>

        <Pressable style={styles.tab} onPress={() => router.replace("/therapist-patients")}>
          <Ionicons name="people-outline" size={22} color="#111" />
          <Text style={styles.tabText}>Patienten</Text>
        </Pressable>

        <Pressable style={styles.tab} onPress={() => router.replace("/therapist-profile")}>
          <Ionicons name="person-outline" size={22} color="#111" />
          <Text style={styles.tabText}>Profil</Text>
        </Pressable>
      </View>

      {/* Menu Drawer */}
      <Modal transparent visible={menuOpen} animationType="fade">
        <Pressable style={styles.overlay} onPress={() => setMenuOpen(false)}>
          <Pressable style={styles.drawer} onPress={() => {}}>
            <Text style={styles.menuTitle}>Menü:</Text>
            <View style={styles.menuDivider} />

            <Pressable style={styles.menuItem} onPress={() => go("/therapist-home")}>
              <Text style={styles.menuText}>Home</Text>
            </Pressable>

            <Pressable style={styles.menuItem} onPress={() => go("/therapist-patients")}>
              <Text style={styles.menuText}>Meine Patienten</Text>
            </Pressable>

            <Pressable style={styles.menuItem} onPress={() => go("/therapist-appointments")}>
              <Text style={styles.menuText}>Termine</Text>
            </Pressable>

            <Pressable style={styles.menuItem} onPress={() => go("/chat-list")}>
              <Text style={styles.menuText}>Chat</Text>
            </Pressable>

            <Pressable style={styles.menuItem} onPress={() => go("/therapist-patients")}>
              <Text style={styles.menuText}>Patientliste</Text>
            </Pressable>

            <Pressable style={styles.menuItem} onPress={() => go("/therapist-profile")}>
              <Text style={styles.menuText}>Mein Profil</Text>
            </Pressable>

            <View style={styles.menuDivider} />

            <Pressable
              style={styles.logoutBtn}
              onPress={() => {
                setMenuOpen(false);
                router.replace("/login-therapeut");
              }}
            >
              <Text style={styles.logoutText}>abmelden</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  scroll: { paddingTop: 50, paddingHorizontal: 22 },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  backBtn: { padding: 6 },

  pageTitle: { fontSize: 18, fontWeight: "700", color: "#111" },

  year: { fontSize: 18, fontWeight: "800", color: "#111" },

  menuBtn: { padding: 6 },

  topDivider: {
    height: 1,
    backgroundColor: "#CFCFCF",
    marginTop: 10,
    marginRight: 30,
  },

  sectionDivider: {
    height: 1,
    backgroundColor: "#CFCFCF",
    marginVertical: 16,
  },

  monthBlock: { alignItems: "center" },

  monthTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#777",
    letterSpacing: 6,
    marginBottom: 12,
  },

  weekRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    paddingHorizontal: 6,
  },

  weekday: { width: 24, textAlign: "center", fontWeight: "700", color: "#333" },
  sunday: { color: "#c40000" },

  grid: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
  },

  dayCell: {
    width: "14.2857%",
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  circleBase: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  circleFilled: { backgroundColor: "#c40000" },
  circleOutline: { borderWidth: 2, borderColor: "#c40000" },

  dayText: { color: "#111", fontWeight: "700" },
  dayTextFilled: { color: "#fff", fontWeight: "800" },

  tabs: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#BDBDBD",
    paddingVertical: 10,
    paddingHorizontal: 10,
  },

  tab: { alignItems: "center", width: 78, gap: 4 },
  tabText: { fontSize: 12, fontWeight: "600", color: "#111", opacity: 0.85 },
  tabTextActive: { fontSize: 12, fontWeight: "800", color: "#111" },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
  },

  drawer: {
    width: "78%",
    height: "100%",
    backgroundColor: "#BDBDBD",
    paddingTop: 70,
    paddingHorizontal: 26,
  },

  menuTitle: { fontSize: 22, fontWeight: "800", color: "#111", marginBottom: 10 },

  menuDivider: {
    height: 1,
    backgroundColor: "#111",
    opacity: 0.4,
    marginVertical: 10,
  },

  menuItem: { paddingVertical: 8 },

  menuText: { fontSize: 16, color: "#111", fontWeight: "600" },

  logoutBtn: { paddingVertical: 10 },

  logoutText: { color: "#B00000", fontSize: 16, fontWeight: "700" },
});
