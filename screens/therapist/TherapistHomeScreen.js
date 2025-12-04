import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';

import { fetchTherapistDashboard, getApiBaseUrl } from '../../services/mockBackend';

const SectionCard = ({ title, children }) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>{title}</Text>
    {children}
  </View>
);

const Pill = ({ label, tone = 'default' }) => (
  <View style={[styles.pill, tone === 'info' && styles.pillInfo, tone === 'accent' && styles.pillAccent]}>
    <Text style={[styles.pillText, tone !== 'default' && styles.pillTextStrong]}>{label}</Text>
  </View>
);

function renderSession({ item }) {
  return (
    <View style={styles.listRow}>
      <View style={{ flex: 1 }}>
        <Text style={styles.listPrimary}>{item.patient}</Text>
        <Text style={styles.listSecondary}>{item.type}</Text>
      </View>
      <Pill label={item.time} />
      <Pill label={item.status} tone="info" />
    </View>
  );
}

function renderTask({ item }) {
  return (
    <View style={styles.listRow}>
      <View style={{ flex: 1 }}>
        <Text style={styles.listPrimary}>{item.title}</Text>
        <Text style={styles.listSecondary}>{item.detail}</Text>
      </View>
      <Pill label={item.priority} tone="accent" />
    </View>
  );
}

function renderWaiting({ item }) {
  return (
    <View style={styles.listRow}>
      <View style={{ flex: 1 }}>
        <Text style={styles.listPrimary}>{item.name}</Text>
        <Text style={styles.listSecondary}>{item.reason}</Text>
      </View>
      <Pill label={item.since} />
    </View>
  );
}

export default function TherapistHomeScreen() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetchTherapistDashboard()
      .then((data) => {
        if (isMounted) setDashboard(data);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Therapeut Übersicht</Text>
      <Text style={styles.subtitle}>
        Backend-Basis: {getApiBaseUrl()} – simulierte Daten für Terminmanagement und Aufgaben.
      </Text>

      {loading && (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.loadingText}>Lade Dashboard …</Text>
        </View>
      )}

      {dashboard && !loading && (
        <View style={styles.grid}>
          <SectionCard title={`Willkommen, ${dashboard.therapist.name}`}>
            <Text style={styles.muted}>Praxis: {dashboard.therapist.clinic}</Text>
            <Text style={[styles.muted, { marginTop: 4 }]}>Heute stehen {dashboard.sessions.length} Termine an.</Text>
          </SectionCard>

          <SectionCard title="Heutige Termine">
            <FlatList
              scrollEnabled={false}
              data={dashboard.sessions}
              keyExtractor={(item) => item.id}
              renderItem={renderSession}
              ItemSeparatorComponent={() => <View style={styles.divider} />}
            />
          </SectionCard>

          <SectionCard title="To-dos für heute">
            <FlatList
              scrollEnabled={false}
              data={dashboard.tasks}
              keyExtractor={(item) => item.id}
              renderItem={renderTask}
              ItemSeparatorComponent={() => <View style={styles.divider} />}
            />
          </SectionCard>

          <SectionCard title="Wartezimmer">
            <FlatList
              scrollEnabled={false}
              data={dashboard.waitingRoom}
              keyExtractor={(item) => item.id}
              renderItem={renderWaiting}
              ItemSeparatorComponent={() => <View style={styles.divider} />}
            />
          </SectionCard>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8FAFC',
    padding: 24,
    gap: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 15,
    color: '#334155',
    marginBottom: 10,
  },
  grid: {
    gap: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },
  muted: {
    color: '#475569',
    fontSize: 15,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  listPrimary: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  listSecondary: {
    fontSize: 13,
    color: '#475569',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 10,
  },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#E2E8F0',
  },
  pillInfo: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  pillAccent: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  pillText: {
    color: '#1F2937',
    fontWeight: '600',
    fontSize: 13,
  },
  pillTextStrong: {
    color: '#111827',
  },
  loadingWrap: {
    backgroundColor: '#E2E8F0',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  loadingText: {
    color: '#0F172A',
    fontWeight: '600',
  },
});
