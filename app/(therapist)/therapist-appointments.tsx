import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { api, Appointment } from "./appointmentsApi";
import { getPatientById, PATIENTS } from "./patientsApi";

type MonthDef = {
  name: string;
  monthIndex: number; // 0..11
  year: number;
  daysInMonth: number;
  firstDayIndex: number; // 0=So..6=Sa
  isoPrefix: string; // "YYYY-MM-"
};

type EditDraft = {
  id?: string;
  date: string;
  time: string;
  patientId: string; // ✅ بدل patient (name)
  note: string;
};

/** ===================== HELPERS ===================== */
const pad2 = (n: number) => String(n).padStart(2, "0");

function daysInMonth(year: number, monthIndex: number) {
  return new Date(year, monthIndex + 1, 0).getDate();
}

// 0=Sunday..6=Saturday
function firstDayIndex(year: number, monthIndex: number) {
  return new Date(year, monthIndex, 1).getDay();
}

function monthNameDE(monthIndex: number) {
  const names = [
    "Januar",
    "Februar",
    "März",
    "April",
    "Mai",
    "Juni",
    "Juli",
    "August",
    "September",
    "Oktober",
    "November",
    "Dezember",
  ];
  return names[monthIndex] ?? "Monat";
}

function toISODate(year: number, monthIndex: number, day: number) {
  return `${year}-${pad2(monthIndex + 1)}-${pad2(day)}`;
}

function sortByTime(a: Appointment, b: Appointment) {
  return a.time.localeCompare(b.time);
}

/** ===================== UI COMPONENTS ===================== */
function DayCell({
  day,
  isoDate,
  hasAppointments,
  isToday,
  onPress,
}: {
  day: number | null;
  isoDate: string | null;
  hasAppointments: boolean;
  isToday: boolean;
  onPress: (isoDate: string) => void;
}) {
  if (day === null || isoDate === null) return <View style={styles.dayCell} />;

  return (
    <Pressable style={styles.dayCell} onPress={() => onPress(isoDate)}>
      <View
        style={[
          styles.circleBase,
          hasAppointments ? styles.circleFilled : null,
          !hasAppointments && isToday ? styles.circleToday : null,
        ]}
      >
        <Text style={hasAppointments ? styles.dayTextFilled : styles.dayText}>
          {day}
        </Text>
      </View>
    </Pressable>
  );
}

function MonthCalendar({
  month,
  apptDatesSet,
  onDayPress,
  todayISO,
}: {
  month: MonthDef;
  apptDatesSet: Set<string>;
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
        {weekdays.map((w) => (
          <Text key={w} style={[styles.weekday, w === "S" ? styles.sunday : null]}>
            {w}
          </Text>
        ))}
      </View>

      <View style={styles.grid}>
        {grid.map((d, idx) => {
          const isoDate = d === null ? null : toISODate(month.year, month.monthIndex, d);
          const hasAppointments = isoDate ? apptDatesSet.has(isoDate) : false;
          const isToday = isoDate ? isoDate === todayISO : false;

          return (
            <DayCell
              key={`${month.name}-${idx}`}
              day={d}
              isoDate={isoDate}
              hasAppointments={hasAppointments}
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

  // ✅ read query param ?date=YYYY-MM-DD
  const params = useLocalSearchParams<{ date?: string }>();

  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const [editorOpen, setEditorOpen] = useState(false);
  const [editMode, setEditMode] = useState<"add" | "edit">("add");
  const [draft, setDraft] = useState<EditDraft>({
    date: "2026-01-01",
    time: "10:00",
    patientId: "",
    note: "",
  });

  const year = 2026;

  const todayISO = useMemo(() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = pad2(d.getMonth() + 1);
    const day = pad2(d.getDate());
    return `${y}-${m}-${day}`;
  }, []);

  const months: MonthDef[] = useMemo(() => {
    const list = Array.from({ length: 12 }, (_, i) => i); // 0..11
    return list.map((mIdx) => ({
      name: monthNameDE(mIdx),
      monthIndex: mIdx,
      year,
      daysInMonth: daysInMonth(year, mIdx),
      firstDayIndex: firstDayIndex(year, mIdx),
      isoPrefix: `${year}-${pad2(mIdx + 1)}-`,
    }));
  }, [year]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await api.fetchAppointments();
        setAppointments(data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const apptDatesSet = useMemo(() => new Set(appointments.map((a) => a.date)), [appointments]);

  const go = (path: string) => {
    setMenuOpen(false);
    router.replace(path as any);
  };

  const onDayPress = (isoDate: string) => {
    setSelectedDate(isoDate);
    setDetailsOpen(true);
  };

  const appointmentsForSelectedDay = useMemo(() => {
    if (!selectedDate) return [];
    return appointments.filter((a) => a.date === selectedDate).sort(sortByTime);
  }, [appointments, selectedDate]);

  const openAdd = (date: string) => {
    setEditMode("add");
    setDraft({ date, time: "10:00", patientId: "", note: "" });
    setEditorOpen(true);
  };

  const openEdit = (appt: Appointment) => {
    setEditMode("edit");
    setDraft({
      id: appt.id,
      date: appt.date,
      time: appt.time,
      patientId: appt.patientId,
      note: appt.note ?? "",
    });
    setEditorOpen(true);
  };

  const saveDraft = async () => {
    if (!draft.patientId.trim()) return;
    if (!draft.time.trim()) return;

    if (editMode === "add") {
      const created = await api.createAppointment({
        date: draft.date,
        time: draft.time,
        patientId: draft.patientId.trim(),
        note: draft.note.trim() || undefined,
      });
      setAppointments((prev) => [...prev, created]);
    } else {
      if (!draft.id) return;
      const updated = await api.updateAppointment(draft.id, {
        date: draft.date,
        time: draft.time,
        patientId: draft.patientId.trim(),
        note: draft.note.trim() || undefined,
      });
      setAppointments((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    }

    setEditorOpen(false);
  };

  const deleteAppt = async (id: string) => {
    await api.deleteAppointment(id);
    setAppointments((prev) => prev.filter((a) => a.id !== id));
  };

  useEffect(() => {
    if (params.date) {
      setSelectedDate(params.date);
      setDetailsOpen(true);
    }
  }, [params.date]);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.topRow}>
          <Pressable
            onPress={() => router.replace("/therapist-home")}
            hitSlop={10}
            style={styles.backBtn}
          >
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

        {loading ? (
          <View style={styles.loadingBox}>
            <Text style={styles.loadingText}>Lade Termine...</Text>
          </View>
        ) : (
          <>
            {months.map((m) => (
              <View key={m.name}>
                <MonthCalendar
                  month={m}
                  apptDatesSet={apptDatesSet}
                  onDayPress={onDayPress}
                  todayISO={todayISO}
                />
                <View style={styles.sectionDivider} />
              </View>
            ))}
          </>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom Tabs */}
      <View style={styles.tabs}>
        <Pressable style={styles.tab} onPress={() => router.replace("/therapist-home")}>
          <Ionicons name="home" size={22} color="#111" />
          <Text style={styles.tabTextActive}>Startseite</Text>
        </Pressable>

        <Pressable style={styles.tab} onPress={() => router.push("/therapist-chat")}>
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

      {/* ===================== DAY DETAILS MODAL ===================== */}
      <Modal transparent visible={detailsOpen} animationType="fade">
        <Pressable style={styles.overlay} onPress={() => setDetailsOpen(false)}>
          <Pressable style={styles.detailsSheet} onPress={() => {}}>
            <View style={styles.detailsHeader}>
              <Text style={styles.detailsTitle}>
                {selectedDate ? `Termine: ${selectedDate}` : "Termine"}
              </Text>

              <Pressable onPress={() => selectedDate && openAdd(selectedDate)} hitSlop={10}>
                <Ionicons name="add-circle" size={26} color="#111" />
              </Pressable>
            </View>

            <View style={styles.menuDivider} />

            {selectedDate && appointmentsForSelectedDay.length === 0 ? (
              <Text style={styles.detailsEmpty}>Keine Termine an diesem Tag.</Text>
            ) : (
              appointmentsForSelectedDay.map((a) => {
                const patientName = getPatientById(a.patientId)?.name ?? "Unbekannter Patient";
                return (
                  <View key={a.id} style={styles.apptRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.apptTime}>{a.time}</Text>
                      <Text style={styles.apptPatient}>{patientName}</Text>
                      {!!a.note && <Text style={styles.apptNote}>{a.note}</Text>}
                    </View>

                    <View style={styles.apptActions}>
                      <Pressable onPress={() => openEdit(a)} hitSlop={10}>
                        <Ionicons name="pencil" size={18} color="#111" />
                      </Pressable>

                      <Pressable onPress={() => deleteAppt(a.id)} hitSlop={10}>
                        <Ionicons name="trash" size={18} color="#B00000" />
                      </Pressable>
                    </View>
                  </View>
                );
              })
            )}

            <Pressable style={styles.addBtn} onPress={() => selectedDate && openAdd(selectedDate)}>
              <Text style={styles.addText}>+ Termin hinzufügen</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>

      {/* ===================== ADD / EDIT MODAL ===================== */}
      <Modal transparent visible={editorOpen} animationType="fade">
        <Pressable style={styles.overlay} onPress={() => setEditorOpen(false)}>
          <Pressable style={styles.editorSheet} onPress={() => {}}>
            <Text style={styles.editorTitle}>
              {editMode === "add" ? "Termin hinzufügen" : "Termin bearbeiten"}
            </Text>

            <View style={styles.menuDivider} />

            <View style={styles.formField}>
              <Text style={styles.formLabel}>Datum (YYYY-MM-DD)</Text>
              <TextInput
                style={styles.formInput}
                value={draft.date}
                onChangeText={(t) => setDraft((p) => ({ ...p, date: t }))}
                placeholder="2026-01-04"
              />
            </View>

            <View style={styles.formField}>
              <Text style={styles.formLabel}>Uhrzeit (HH:MM)</Text>
              <TextInput
                style={styles.formInput}
                value={draft.time}
                onChangeText={(t) => setDraft((p) => ({ ...p, time: t }))}
                placeholder="12:30"
              />
            </View>

            {/* ✅ Patient selection */}
            <View style={styles.formField}>
              <Text style={styles.formLabel}>Patient</Text>

              <View style={{ gap: 8 }}>
                {PATIENTS.map((p) => {
                  const selected = draft.patientId === p.id;
                  return (
                    <Pressable
                      key={p.id}
                      onPress={() => setDraft((prev) => ({ ...prev, patientId: p.id }))}
                      style={[
                        styles.formInput,
                        {
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                        },
                        selected ? { borderWidth: 2, borderColor: "#111" } : null,
                      ]}
                    >
                      <Text style={{ fontWeight: "800", color: "#111" }}>{p.name}</Text>
                      {selected ? (
                        <Ionicons name="checkmark-circle" size={18} color="#111" />
                      ) : null}
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View style={styles.formField}>
              <Text style={styles.formLabel}>Notiz</Text>
              <TextInput
                style={[styles.formInput, { height: 90, textAlignVertical: "top" }]}
                value={draft.note}
                onChangeText={(t) => setDraft((p) => ({ ...p, note: t }))}
                placeholder="Optional..."
                multiline
              />
            </View>

            <View style={styles.editorButtonsRow}>
              <Pressable style={styles.cancelBtn} onPress={() => setEditorOpen(false)}>
                <Text style={styles.cancelText}>Abbrechen</Text>
              </Pressable>

              <Pressable style={styles.saveBtn} onPress={saveDraft}>
                <Text style={styles.saveText}>Speichern</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* ===================== MENU MODAL ===================== */}
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

            <Pressable style={styles.menuItem} onPress={() => go("/therapist-chat")}>
              <Text style={styles.menuText}>Chat</Text>
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

/** ===================== STYLES ===================== */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scroll: { paddingTop: 50, paddingHorizontal: 22 },

  topRow: { flexDirection: "row", alignItems: "center", gap: 10 },
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

  loadingBox: {
    marginTop: 18,
    backgroundColor: "#E5E5E5",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
  },
  loadingText: { fontWeight: "700", color: "#111" },

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

  grid: { width: "100%", flexDirection: "row", flexWrap: "wrap" },

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

  circleToday: {
    borderWidth: 2,
    borderColor: "#111",
    opacity: 0.6,
  },

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

  detailsSheet: {
    width: "92%",
    marginTop: 90,
    marginRight: 12,
    backgroundColor: "#BDBDBD",
    borderRadius: 16,
    padding: 16,
  },

  detailsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  detailsTitle: { fontSize: 18, fontWeight: "800", color: "#111" },
  detailsEmpty: { fontSize: 14, fontWeight: "700", color: "#111", marginTop: 12 },

  apptRow: {
    backgroundColor: "#E0E0E0",
    borderRadius: 14,
    padding: 12,
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  apptTime: { fontSize: 16, fontWeight: "800", color: "#111" },
  apptPatient: { fontSize: 14, fontWeight: "700", color: "#111", marginTop: 2 },
  apptNote: { fontSize: 12, fontWeight: "600", color: "#333", marginTop: 4 },

  apptActions: { flexDirection: "row", gap: 14, alignItems: "center" },

  addBtn: {
    marginTop: 12,
    backgroundColor: "#E0E0E0",
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
  },
  addText: { fontSize: 14, fontWeight: "800", color: "#111" },

  editorSheet: {
    width: "92%",
    marginTop: 90,
    marginRight: 12,
    backgroundColor: "#BDBDBD",
    borderRadius: 16,
    padding: 16,
  },

  editorTitle: { fontSize: 18, fontWeight: "800", color: "#111" },

  formField: { marginTop: 10 },

  formLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: "#111",
    opacity: 0.85,
    marginBottom: 6,
  },

  formInput: {
    backgroundColor: "#EDEDED",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    fontWeight: "700",
    color: "#111",
  },

  editorButtonsRow: { flexDirection: "row", gap: 10, marginTop: 14 },

  cancelBtn: {
    flex: 1,
    backgroundColor: "#E0E0E0",
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
  },
  cancelText: { fontSize: 14, fontWeight: "800", color: "#111" },

  saveBtn: {
    flex: 1,
    backgroundColor: "#E0E0E0",
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
  },
  saveText: { fontSize: 14, fontWeight: "900", color: "#111" },
});
