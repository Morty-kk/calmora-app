import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { BACKEND_URL } from "../../constants/backend";

/** ===================== TYPES ===================== */
type BackendAppointment = {
  id: number | string;
  startsAt: string;              // ISO
  status?: string | null;        // BOOKED / CANCELLED / AVAILABLE ...
  note?: string | null;
  patient?: { id?: string | number; name?: string | null; email?: string | null } | null;
};

type UiAppointment = {
  id: string;
  date: string;      // YYYY-MM-DD
  time: string;      // HH:MM
  status: string;    // uppercase
  note: string;
  patientName: string;
};

type MonthDef = {
  name: string;
  monthIndex: number; // 0..11
  year: number;
  daysInMonth: number;
  firstDayIndex: number; // 0=So..6=Sa
};

/** ===================== HELPERS ===================== */
const pad2 = (n: number) => String(n).padStart(2, "0");

function daysInMonth(year: number, monthIndex: number) {
  return new Date(year, monthIndex + 1, 0).getDate();
}
function firstDayIndex(year: number, monthIndex: number) {
  return new Date(year, monthIndex, 1).getDay();
}
function monthNameDE(monthIndex: number) {
  const names = [
    "Januar","Februar","März","April","Mai","Juni",
    "Juli","August","September","Oktober","November","Dezember",
  ];
  return names[monthIndex] ?? "Monat";
}
function toISODate(year: number, monthIndex: number, day: number) {
  return `${year}-${pad2(monthIndex + 1)}-${pad2(day)}`;
}
function toUiAppointments(items: BackendAppointment[]): UiAppointment[] {
  return (items ?? []).map((a) => {
    const d = new Date(a.startsAt);
    const date = d.toISOString().slice(0, 10); // YYYY-MM-DD
    const time = d.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
    const status = String(a.status || "").toUpperCase();
    const patientName =
      a.patient?.name || a.patient?.email || (status === "BOOKED" ? "Patient" : "");
    return {
      id: String(a.id),
      date,
      time,
      status,
      note: a.note || "",
      patientName,
    };
  });
}

/** ===================== UI COMPONENTS ===================== */
function DayCell({
  day,
  isoDate,
  hasBooked,     // ✅ فقط BOOKED
  isToday,
  onPress,
}: {
  day: number | null;
  isoDate: string | null;
  hasBooked: boolean;
  isToday: boolean;
  onPress: (isoDate: string) => void;
}) {
  if (day === null || isoDate === null) return <View style={styles.dayCell} />;

  return (
    <Pressable style={styles.dayCell} onPress={() => onPress(isoDate)}>
      <View
        style={[
          styles.circleBase,
          hasBooked ? styles.circleFilled : null,       // ✅ أحمر فقط إذا BOOKED
          !hasBooked && isToday ? styles.circleToday : null,
        ]}
      >
        <Text style={hasBooked ? styles.dayTextFilled : styles.dayText}>{day}</Text>
      </View>
    </Pressable>
  );
}

function MonthCalendar({
  month,
  bookedDatesSet,
  onDayPress,
  todayISO,
}: {
  month: MonthDef;
  bookedDatesSet: Set<string>;
  onDayPress: (isoDate: string) => void;
  todayISO: string;
}) {
  const weekdays = ["S", "M", "T", "W", "T", "F", "S"];

  const grid = useMemo(() => {
    const cells: Array<number | null> = [];
    for (let i = 0; i < month.firstDayIndex; i++) cells.push(null);
    for (let d = 1; d <= month.daysInMonth; d++) cells.push(d);
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [month.daysInMonth, month.firstDayIndex]);

  return (
    <View style={styles.monthBlock}>
      <Text style={styles.monthTitle}>{month.name}</Text>

      <View style={styles.weekRow}>
        {weekdays.map((w, idx) => (
          <Text
            key={`${w}-${idx}`}
            style={[styles.weekday, idx === 0 || idx === 6 ? styles.sunday : null]}
          >
            {w}
          </Text>
        ))}
      </View>

      <View style={styles.grid}>
        {grid.map((d, idx) => {
          const isoDate = d === null ? null : toISODate(month.year, month.monthIndex, d);
          const hasBooked = isoDate ? bookedDatesSet.has(isoDate) : false;
          const isToday = isoDate ? isoDate === todayISO : false;

          return (
            <DayCell
              key={`${month.name}-${idx}`}
              day={d}
              isoDate={isoDate}
              hasBooked={hasBooked}
              isToday={isToday}
              onPress={onDayPress}
            />
          );
        })}
      </View>
    </View>
  );
}

/** ===================== SCREEN ===================== */
export default function TherapistAppointments() {
  const [menuOpen, setMenuOpen] = useState(false);

  // read query param ?date=YYYY-MM-DD
  const params = useLocalSearchParams<{ date?: string }>();

  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<UiAppointment[]>([]);

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // محرر (إذا عندك لاحقاً إنشاء Slot)
  const [editorOpen, setEditorOpen] = useState(false);
  const [draftNote, setDraftNote] = useState("");

  const year = 2026;

  const todayISO = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
  }, []);

  const months: MonthDef[] = useMemo(() => {
    return Array.from({ length: 12 }, (_, mIdx) => ({
      name: monthNameDE(mIdx),
      monthIndex: mIdx,
      year,
      daysInMonth: daysInMonth(year, mIdx),
      firstDayIndex: firstDayIndex(year, mIdx),
    }));
  }, [year]);

  // ✅ load from backend
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          setAppointments([]);
          return;
        }

        const res = await fetch(`${BACKEND_URL}/appointments/therapist`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (!res.ok) {
          console.log("appointments/therapist error:", data);
          setAppointments([]);
          return;
        }

        const items = toUiAppointments(data.items ?? []);
        setAppointments(items);
      } catch (e) {
        console.log("TherapistAppointments load error:", e);
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ✅ فقط BOOKED رح يعمل دائرة حمرا
  const bookedDatesSet = useMemo(() => {
    const set = new Set<string>();
    for (const a of appointments) {
      if (a.status === "BOOKED") set.add(a.date);
    }
    return set;
  }, [appointments]);

  // تفاصيل اليوم المختار
  const dayAppointments = useMemo(() => {
    if (!selectedDate) return [];
    return appointments
      .filter((a) => a.date === selectedDate)
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [appointments, selectedDate]);

  const bookedOnly = useMemo(() => dayAppointments.filter((a) => a.status === "BOOKED"), [dayAppointments]);
  const others = useMemo(() => dayAppointments.filter((a) => a.status !== "BOOKED"), [dayAppointments]);

  const onDayPress = (isoDate: string) => {
    setSelectedDate(isoDate);
    setDetailsOpen(true);
  };

  // لو جاي من therapist-home ببارام date
  useEffect(() => {
    if (params?.date && typeof params.date === "string") {
      setSelectedDate(params.date);
      setDetailsOpen(true);
    }
  }, [params?.date]);

  const go = (path: string) => {
    setMenuOpen(false);
    router.replace(path as any);
  };

  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#111" />
        </Pressable>
        <Text style={styles.pageTitle}>Termine</Text>

        <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
          <Text style={styles.yearText}>{year}</Text>
          <Pressable onPress={() => setMenuOpen(true)} hitSlop={10}>
            <Ionicons name="menu" size={22} color="#111" />
          </Pressable>
        </View>
      </View>

      {loading ? (
        <View style={{ padding: 18 }}>
          <Text style={{ color: "#6B7280" }}>Laden...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
          {months.map((m) => (
            <MonthCalendar
              key={`${m.year}-${m.monthIndex}`}
              month={m}
              bookedDatesSet={bookedDatesSet}
              onDayPress={onDayPress}
              todayISO={todayISO}
            />
          ))}
        </ScrollView>
      )}

      {/* تفاصيل اليوم */}
      <Modal transparent visible={detailsOpen} animationType="fade">
        <Pressable style={styles.overlay} onPress={() => setDetailsOpen(false)}>
          <Pressable style={styles.sheet} onPress={() => {}}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>{selectedDate ?? "Details"}</Text>
              <Pressable onPress={() => setDetailsOpen(false)} hitSlop={10}>
                <Ionicons name="close" size={22} color="#111" />
              </Pressable>
            </View>

            {/* ✅ Booked only */}
            <Text style={styles.blockTitle}>Gebuchte Termine</Text>
            {bookedOnly.length === 0 ? (
              <Text style={styles.muted}>Keine gebuchten Termine an diesem Tag.</Text>
            ) : (
              bookedOnly.map((a) => (
                <View key={a.id} style={styles.itemRow}>
                  <Text style={styles.itemTime}>{a.time}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.itemMain}>{a.patientName || "Patient"}</Text>
                    {a.note ? <Text style={styles.itemSub}>{a.note}</Text> : null}
                  </View>
                  <Text style={[styles.badgeStatus, { backgroundColor: "#DC2626" }]}>
                    BOOKED
                  </Text>
                </View>
              ))
            )}

            {/* باقي الحالات (slots/available/cancelled) */}
            <Text style={[styles.blockTitle, { marginTop: 14 }]}>Andere</Text>
            {others.length === 0 ? (
              <Text style={styles.muted}>Keine weiteren Einträge.</Text>
            ) : (
              others.map((a) => (
                <View key={a.id} style={styles.itemRow}>
                  <Text style={styles.itemTime}>{a.time}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.itemMain}>
                      {a.status === "CANCELLED" ? "Abgesagt" : "Slot"}
                    </Text>
                    {a.note ? <Text style={styles.itemSub}>{a.note}</Text> : null}
                  </View>
                  <Text style={[styles.badgeStatus, { backgroundColor: "#9CA3AF" }]}>
                    {a.status || "—"}
                  </Text>
                </View>
              ))
            )}

            {/* مثال: زر إضافة لاحقاً */}
            <Pressable
              style={styles.addBtn}
              onPress={() => {
                setDraftNote("");
                setEditorOpen(true);
              }}
            >
              <Ionicons name="add" size={18} color="#111" />
              <Text style={styles.addBtnText}>Termin-Slot hinzufügen (optional)</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>

      {/* محرر بسيط (اختياري) */}
      <Modal transparent visible={editorOpen} animationType="fade">
        <Pressable style={styles.overlay} onPress={() => setEditorOpen(false)}>
          <Pressable style={styles.editor} onPress={() => {}}>
            <Text style={styles.sheetTitle}>Notiz</Text>
            <TextInput
              value={draftNote}
              onChangeText={setDraftNote}
              placeholder="Notiz..."
              style={styles.input}
            />
            <Pressable style={styles.saveBtn} onPress={() => setEditorOpen(false)}>
              <Text style={styles.saveBtnText}>Schließen</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Menu */}
      <Modal transparent visible={menuOpen} animationType="fade">
        <Pressable style={styles.overlay} onPress={() => setMenuOpen(false)}>
          <Pressable style={styles.drawer} onPress={() => {}}>
            <Text style={styles.menuTitle}>Menü</Text>

            <Pressable style={styles.menuItem} onPress={() => go("/therapist-home")}>
              <Text style={styles.menuText}>Home</Text>
            </Pressable>

            <Pressable style={styles.menuItem} onPress={() => go("/therapist-appointments")}>
              <Text style={styles.menuText}>Termine</Text>
            </Pressable>

            <Pressable style={styles.menuItem} onPress={() => go("/therapist-patients")}>
              <Text style={styles.menuText}>Patienten</Text>
            </Pressable>

            <View style={styles.menuDivider} />

            <Pressable style={styles.menuItem} onPress={() => router.replace("/login-therapeut")}>
              <Text style={[styles.menuText, { color: "#B91C1C", fontWeight: "800" }]}>
                abmelden
              </Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

/** ===================== STYLES ===================== */
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff" },

  topBar: {
    paddingTop: 18,
    paddingHorizontal: 16,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backBtn: { padding: 6 },
  pageTitle: { fontSize: 18, fontWeight: "800", color: "#111" },
  yearText: { fontSize: 16, fontWeight: "800", color: "#111" },

  monthBlock: { paddingHorizontal: 16, paddingTop: 10, paddingBottom: 4 },
  monthTitle: { textAlign: "center", fontSize: 12, letterSpacing: 6, color: "#6B7280", marginBottom: 8 },

  weekRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  weekday: { width: "14.28%", textAlign: "center", color: "#111", fontWeight: "600" },
  sunday: { color: "#B91C1C" },

  grid: { flexDirection: "row", flexWrap: "wrap" },
  dayCell: { width: "14.28%", alignItems: "center", paddingVertical: 8 },

  circleBase: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  circleFilled: { backgroundColor: "#B91C1C" }, // ✅ الأحمر
  circleToday: { borderWidth: 1, borderColor: "#9CA3AF" },

  dayText: { color: "#111", fontWeight: "700" },
  dayTextFilled: { color: "#fff", fontWeight: "900" },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "center",
    padding: 16,
  },

  sheet: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 14,
  },
  sheetHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  sheetTitle: { fontSize: 16, fontWeight: "900", color: "#111" },

  blockTitle: { fontSize: 13, fontWeight: "900", color: "#111", marginTop: 6, marginBottom: 8 },
  muted: { color: "#6B7280", marginBottom: 6 },

  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  itemTime: { width: 52, fontWeight: "900", color: "#111" },
  itemMain: { fontWeight: "900", color: "#111" },
  itemSub: { color: "#6B7280", marginTop: 2, fontSize: 12 },
  badgeStatus: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 11,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    overflow: "hidden",
  },

  addBtn: {
    marginTop: 12,
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  addBtnText: { fontWeight: "800", color: "#111" },

  editor: { backgroundColor: "#fff", borderRadius: 18, padding: 14 },
  input: { borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 12, padding: 10, marginTop: 10 },
  saveBtn: { marginTop: 12, backgroundColor: "#111827", padding: 10, borderRadius: 12, alignItems: "center" },
  saveBtnText: { color: "#fff", fontWeight: "900" },

  drawer: { backgroundColor: "#fff", borderRadius: 18, padding: 14 },
  menuTitle: { fontSize: 18, fontWeight: "900", marginBottom: 10, color: "#111" },
  menuDivider: { height: 1, backgroundColor: "#E5E7EB", marginVertical: 10 },
  menuItem: { paddingVertical: 10 },
  menuText: { fontSize: 16, color: "#111" },
});

