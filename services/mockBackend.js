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
