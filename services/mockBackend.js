// Simple mock backend interactions for Calmora.
// This file centralizes backend-like data to keep UI components focused on presentation.

const BASE_API_URL = 'https://api.calmora.local';

const sampleTherapistData = {
  therapist: {
    id: 'therapist-1',
    name: 'Dr. Jana Müller',
    clinic: 'Praxis am Park',
  },
  sessions: [
    {
      id: 'session-1',
      patient: 'Lea Sommer',
      time: '09:30',
      type: 'Video-Termin',
      status: 'Bestätigt',
    },
    {
      id: 'session-2',
      patient: 'Tom Becker',
      time: '11:00',
      type: 'Vor Ort',
      status: 'Wartet',
    },
    {
      id: 'session-3',
      patient: 'Mina Köhler',
      time: '14:15',
      type: 'Video-Termin',
      status: 'Bestätigt',
    },
  ],
  tasks: [
    {
      id: 'task-1',
      title: 'Patientenakte aktualisieren',
      detail: 'Notizen aus der letzten Sitzung mit Lea ergänzen.',
      priority: 'Hoch',
    },
    {
      id: 'task-2',
      title: 'Nachricht an Tom senden',
      detail: 'Link zum Atemübungs-Video teilen.',
      priority: 'Mittel',
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
  ],
};

export function getApiBaseUrl() {
  return BASE_API_URL;
}

export async function fetchTherapistDashboard() {
  // In a real backend call this would be a fetch/axios request. We keep a
  // short delay to emulate latency for better UX testing.
  await new Promise((resolve) => setTimeout(resolve, 200));
  return sampleTherapistData;
}

export default {
  getApiBaseUrl,
  fetchTherapistDashboard,
};
