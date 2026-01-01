import type { Patient } from "./patientsApi";

export type Appointment = {
  id: string;
  date: string;   // YYYY-MM-DD
  time: string;   // HH:MM
  patientId: Patient["id"]; 
  note?: string;
};

let MOCK_DB: Appointment[] = [
  { id: "a1", date: "2026-01-04", time: "12:30", patientId: "p1", note: "ABA Sitzung" },  // Karl Heinz
  { id: "a2", date: "2026-01-10", time: "10:00", patientId: "p2", note: "Planung" },      // Jürgen Hoffner
  { id: "a3", date: "2026-02-05", time: "09:00", patientId: "p3", note: "Kontrolle" },    // Lukas Schneider
  { id: "a4", date: "2026-03-14", time: "09:00", patientId: "p6", note: "Follow-up" },    // Thomas Müller
];

export const api = {
  async fetchAppointments(): Promise<Appointment[]> {
    await new Promise((r) => setTimeout(r, 250));
    return [...MOCK_DB];
  },

  async createAppointment(payload: Omit<Appointment, "id">): Promise<Appointment> {
    await new Promise((r) => setTimeout(r, 200));
    const created: Appointment = { ...payload, id: String(Date.now()) };
    MOCK_DB = [...MOCK_DB, created];
    return created;
  },

  async updateAppointment(id: string, patch: Omit<Appointment, "id">): Promise<Appointment> {
    await new Promise((r) => setTimeout(r, 200));
    MOCK_DB = MOCK_DB.map((a) => (a.id === id ? { id, ...patch } : a));
    return MOCK_DB.find((a) => a.id === id)!;
  },

  async deleteAppointment(id: string): Promise<void> {
    await new Promise((r) => setTimeout(r, 150));
    MOCK_DB = MOCK_DB.filter((a) => a.id !== id);
  },
};
