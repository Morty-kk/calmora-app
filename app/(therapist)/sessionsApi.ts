import type { Patient } from "./patientsApi";

export type SessionNote = {
  id: string;
  patientId: Patient["id"]; 
  date: string;            // YYYY-MM-DD
  title: string;          
  note: string;            
  createdAt: string;       // ISO timestamp
  updatedAt?: string;      // ISO timestamp
};

let MOCK_DB: SessionNote[] = [
  // p1 Karl Heinz
  {
    id: "sn1",
    patientId: "p1",
    date: "2026-01-04",
    title: "ABA Sitzung",
    note: "Guter Fortschritt bei Aufmerksamkeit. Hausaufgabe: 10 Min/Tag.",
    createdAt: "2026-01-04T12:00:00.000Z",
  },
  {
    id: "sn2",
    patientId: "p1",
    date: "2026-01-18",
    title: "Übung: Routine",
    note: "Strategien für Alltagsstruktur besprochen. Reminder im Handy aktivieren.",
    createdAt: "2026-01-18T10:30:00.000Z",
  },

  // p2 Jürgen Hoffner
  {
    id: "sn3",
    patientId: "p2",
    date: "2026-01-10",
    title: "Planung",
    note: "Ziele festgelegt. Nächster Termin: Schlafhygiene & Stressmanagement.",
    createdAt: "2026-01-10T09:00:00.000Z",
  },
  {
    id: "sn4",
    patientId: "p2",
    date: "2026-02-02",
    title: "Follow-up",
    note: "Schlaf verbessert, Stresslevel leicht gesunken. Weiterführung: Atemübungen.",
    createdAt: "2026-02-02T13:15:00.000Z",
  },

  // p3 Lukas Schneider
  {
    id: "sn5",
    patientId: "p3",
    date: "2026-02-05",
    title: "Kontrolle",
    note: "Motivation gut, Konzentration schwankt. Kurze Lernblöcke empfohlen.",
    createdAt: "2026-02-05T08:45:00.000Z",
  },

  // p4 Lea Wagner
  {
    id: "sn6",
    patientId: "p4",
    date: "2026-01-22",
    title: "Erstgespräch",
    note: "Anamnese abgeschlossen. Fokus: Routine + Coping-Strategien.",
    createdAt: "2026-01-22T11:20:00.000Z",
  },

  // p5 Johanna Fischer
  {
    id: "sn7",
    patientId: "p5",
    date: "2026-03-01",
    title: "Sitzung",
    note: "Schwerpunkte: Selbstwert & Alltagsstruktur. Nächste Sitzung: Ziele konkretisieren.",
    createdAt: "2026-03-01T16:00:00.000Z",
  },

  // p6 Thomas Müller
  {
    id: "sn8",
    patientId: "p6",
    date: "2026-03-14",
    title: "Follow-up",
    note: "Fortschritt stabil. Neue Ziele besprochen: Bewegung & Schlafrhythmus.",
    createdAt: "2026-03-14T09:00:00.000Z",
  },
];

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

const nowISO = () => new Date().toISOString();

export const sessionsApi = {
  async fetchAllSessions(): Promise<SessionNote[]> {
    await delay(200);
    return [...MOCK_DB];
  },

  async fetchSessionsByPatientId(patientId: string): Promise<SessionNote[]> {
    await delay(200);
    return MOCK_DB
      .filter((s) => s.patientId === patientId)
      .slice()
      .sort((a, b) => a.date.localeCompare(b.date));
  },

  async createSession(payload: Omit<SessionNote, "id" | "createdAt" | "updatedAt">): Promise<SessionNote> {
    await delay(180);

    const created: SessionNote = {
      ...payload,
      id: String(Date.now()),
      createdAt: nowISO(),
    };

    MOCK_DB = [...MOCK_DB, created];
    return created;
  },

  async updateSession(
    id: string,
    patch: Partial<Omit<SessionNote, "id" | "createdAt">>
  ): Promise<SessionNote> {
    await delay(180);

    let updated: SessionNote | undefined;

    MOCK_DB = MOCK_DB.map((s) => {
      if (s.id !== id) return s;
      updated = {
        ...s,
        ...patch,
        updatedAt: nowISO(),
      };
      return updated!;
    });

    if (!updated) throw new Error("Session not found");
    return updated;
  },

  async deleteSession(id: string): Promise<void> {
    await delay(150);
    MOCK_DB = MOCK_DB.filter((s) => s.id !== id);
  },
};
