export type Appointment = {
  id: string;
  date: string;   // YYYY-MM-DD
  time: string;   // HH:MM
  patient: string;
  note?: string;
};

let MOCK_DB: Appointment[] = [
  { id: "a1", date: "2026-01-04", time: "12:30", patient: "Alex", note: "ABA Sitzung" },
  { id: "a2", date: "2026-01-04", time: "15:00", patient: "Mia" },
];

export const api = {
  async fetchAppointments(): Promise<Appointment[]> {
    await new Promise((r) => setTimeout(r, 200));
    return [...MOCK_DB];
  },

  async createAppointment(payload: Omit<Appointment, "id">) {
    await new Promise((r) => setTimeout(r, 150));
    const created = { ...payload, id: String(Date.now()) };
    MOCK_DB.push(created);
    return created;
  },

  async updateAppointment(id: string, patch: Omit<Appointment, "id">) {
    await new Promise((r) => setTimeout(r, 150));
    MOCK_DB = MOCK_DB.map((a) => (a.id === id ? { id, ...patch } : a));
    return MOCK_DB.find((a) => a.id === id)!;
  },

  async deleteAppointment(id: string) {
    await new Promise((r) => setTimeout(r, 100));
    MOCK_DB = MOCK_DB.filter((a) => a.id !== id);
  },
};
