// Simple mock backend interactions for Calmora.
// This file centralizes backend-like data to keep UI components focused on presentation.

const BASE_API_URL = 'https://api.calmora.local';

const sampleTherapistData = {
  therapist: {
    id: 'therapist-1',
    name: 'Dr. Jana Müller',
    clinic: 'Praxis am Park',
    focus: 'Angst- & Belastungsstörungen',
  },
  summary: {
    todayAppointments: 7,
    waitingClients: 3,
    overdueTasks: 1,
    satisfaction: 4.7,
    workload: '72% Auslastung',
    lastSync: 'vor 6 Minuten',
    adherence: '83% Hausaufgabenquote',
    handoffQuality: '94% saubere Übergaben',
  },
  sessions: [
    {
      id: 'session-1',
      patient: 'Lea Sommer',
      time: '09:30',
      type: 'Video-Termin',
      status: 'Bestätigt',
      intent: 'Emotionale Stabilisierung',
    },
    {
      id: 'session-2',
      patient: 'Tom Becker',
      time: '11:00',
      type: 'Vor Ort',
      status: 'Wartet',
      intent: 'KVT Modul 3',
    },
    {
      id: 'session-3',
      patient: 'Mina Köhler',
      time: '14:15',
      type: 'Video-Termin',
      status: 'Bestätigt',
      intent: 'Ressourcenaufbau',
    },
    {
      id: 'session-4',
      patient: 'Philipp Zhang',
      time: '16:00',
      type: 'Vor Ort',
      status: 'Bestätigt',
      intent: 'Panikprotokoll Review',
    },
  ],
  tasks: [
    {
      id: 'task-1',
      title: 'Patientenakte aktualisieren',
      detail: 'Notizen aus der letzten Sitzung mit Lea ergänzen.',
      priority: 'Hoch',
      due: 'Heute',
    },
    {
      id: 'task-2',
      title: 'Nachricht an Tom senden',
      detail: 'Link zum Atemübungs-Video teilen.',
      priority: 'Mittel',
      due: 'Heute',
    },
    {
      id: 'task-3',
      title: 'Nachbesprechung KVT Modul',
      detail: 'Feedback aus Modul 2 dokumentieren.',
      priority: 'Niedrig',
      due: 'Morgen',
    },
  ],
  waitingRoom: [
    {
      id: 'waiting-1',
      name: 'Tom Becker',
      since: '10 Min',
      reason: 'Folgetermin',
    },
    {
      id: 'waiting-2',
      name: 'Lina Krüger',
      since: '5 Min',
      reason: 'Neuanmeldung',
    },
    {
      id: 'waiting-3',
      name: 'Samuel Alavi',
      since: '2 Min',
      reason: 'Video-Check-in',
    },
  ],
  nextSteps: [
    {
      id: 'step-1',
      title: 'Evaluation der letzten 4 Wochen',
      detail: 'Kurzbericht für Team-Supervision vorbereiten.',
      owner: 'Du',
    },
    {
      id: 'step-2',
      title: 'Digitale Übungen ausrollen',
      detail: 'Pilot für Atemtraining an 5 Patienten freischalten.',
      owner: 'Produkt',
    },
  ],
  insights: [
    {
      id: 'insight-1',
      label: '+18% Abschlussrate',
      detail: 'Mehr abgeschlossene Hausaufgaben durch kürzere Aufgabenpakete.',
    },
    {
      id: 'insight-2',
      label: 'Ø 4,7 Zufriedenheit',
      detail: 'Bewertungen der letzten 20 Sitzungen.',
    },
    {
      id: 'insight-3',
      label: '20% schnellere Ersttermine',
      detail: 'Durch optimierten Intake-Fragebogen und automatisierte Buchung.',
    },
  ],
  weeklyTrends: [
    {
      id: 'trend-1',
      week: 'KW 12',
      completions: 42,
      delta: '+12%',
      note: 'Mehr Wochenaufgaben durch kürzere Module.',
    },
    {
      id: 'trend-2',
      week: 'KW 13',
      completions: 47,
      delta: '+6%',
      note: 'Neue Achtsamkeitsserie gut angenommen.',
    },
    {
      id: 'trend-3',
      week: 'KW 14',
      completions: 51,
      delta: '+9%',
      note: 'Automatische Erinnerungen erhöhten Abschlussrate.',
    },
    {
      id: 'trend-4',
      week: 'KW 15',
      completions: 55,
      delta: '+7%',
      note: 'Therapeuten-Check-ins nach 48h testweise eingeführt.',
    },
  ],
  riskPatients: [
    {
      id: 'risk-1',
      name: 'Lina Krüger',
      risk: 'Abbruch-Risiko',
      reason: '2 verpasste Termine, niedrige Interaktion.',
      action: 'Heute kurzer Motivations-Call.',
    },
    {
      id: 'risk-2',
      name: 'Samuel Alavi',
      risk: 'Symptome steigen',
      reason: 'PHQ-9 Anstieg um 4 Punkte.',
      action: 'Angepasstes Wochenziel setzen.',
    },
  ],
  highlights: [
    {
      id: 'highlight-1',
      title: 'Neue Atemtrainings-Strecke',
      detail: '35% höhere Nutzungsrate bei Angstpatient:innen.',
    },
    {
      id: 'highlight-2',
      title: 'Teamfeedback umgesetzt',
      detail: 'Dokumentationsvorlage mit automatischen Bullet Points.',
    },
    {
      id: 'highlight-3',
      title: 'Digitale Intake-Assistenz',
      detail: 'Erstgesprächszeit um 8 Minuten reduziert.',
    },
  ],
};

export function getApiBaseUrl() {
  return BASE_API_URL;
}

export async function fetchTherapistDashboard() {
  // In a real backend call this would be a fetch/axios request. We keep a
  // short delay to emulate latency for better UX testing.
  await new Promise((resolve) => setTimeout(resolve, 220));
  return sampleTherapistData;
}

export default {
  getApiBaseUrl,
  fetchTherapistDashboard,
};
