import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { ImageBackground, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import CustomDrawer from '../components/Customrawer';

const THERAPISTS = [
  { id: "1", name: "Herr Bellamy N", email: "therapist@example.com", rating: 4.5, reviews: 135 },
  { id: "2", name: "Herr Aziz D", email: "aziz@example.com", rating: 4.3, reviews: 130 },
  { id: "3", name: "Frau Marc M", email: "marc@example.com", rating: 4.3, reviews: 140 },
  { id: "4", name: "Herr O’Boyle J", email: "oboyle@example.com", rating: 4.5, reviews: 135 },
  { id: "5", name: "Herr Klimisch", email: "klimisch@example.com", rating: 4.2, reviews: 110 },
  { id: "6", name: "Herr Martinez", email: "martinez@example.com", rating: 4.4, reviews: 128 },
];


function TherapistCard({
  t, selected, onPress,
}: { t: { id: string; name: string; rating: number; reviews: number }; selected: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={a.cardTherapist}>
      <View style={{ height: 90, borderRadius: 12, backgroundColor: '#e5e7eb' }} />
      {selected && <View style={a.dot} />}
      <Text style={a.tName}>{t.name}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
        <Ionicons name="star" size={14} color="#f59e0b" />
        <Text style={a.tRating}>{t.rating.toFixed(1)} ({t.reviews} reviews)</Text>
      </View>
    </Pressable>
  );
}

export default function Appointment() {
  const [q, setQ] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return THERAPISTS;
    return THERAPISTS.filter(x => x.name.toLowerCase().includes(s));
  }, [q]);

  return (
    <ImageBackground source={require('../assets/bg.png')} style={a.bg} resizeMode="cover">
      <ScrollView style={a.wrap} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={a.header}>
          <TouchableOpacity onPress={() => router.push('/menu')} style={a.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#9E86B9" />
          </TouchableOpacity>
          <Text style={a.brand}>Calmora</Text>
          <TouchableOpacity onPress={() => setDrawerOpen(true)}>
            <Ionicons name="menu" size={28} color="#9E86B9" />
          </TouchableOpacity>
        </View>

        {/* Hero Section */}
        <View style={a.hero}>
          <View style={a.heroIcon}>
            <Ionicons name="calendar" size={40} color="#9E86B9" />
          </View>
          <Text style={a.heroTitle}>Termin buchen</Text>
          <Text style={a.heroSubtitle}>
            Wähle deinen Therapeuten und vereinbare einen Termin für deine nächste Sitzung
          </Text>
        </View>

        {/* Search Box */}
        <View style={a.searchBox}>
          <Ionicons name="search" size={18} color="#6b7280" />
          <TextInput 
            placeholder="Therapeuten suchen..." 
            value={q} 
            onChangeText={setQ} 
            style={a.searchInput}
            placeholderTextColor="#9CA3AF"
            autoCapitalize="none" 
          />
        </View>

        {/* Therapists Grid */}
        <Text style={a.sectionTitle}>Verfügbare Therapeuten</Text>
        <View style={a.grid}>
          {list.map(t => (
            <TherapistCard key={t.id} t={t} selected={selected === t.id} onPress={() => setSelected(t.id)} />
          ))}
        </View>

        {list.length === 0 && (
          <View style={a.emptyState}>
            <Ionicons name="search-outline" size={48} color="#D1D5DB" />
            <Text style={a.emptyText}>Kein Therapeut gefunden</Text>
          </View>
        )}

        {/* Continue Button */}
        <Pressable
          style={[a.primaryBtn, !selected && { opacity: 0.5 }]}
          disabled={!selected}
          onPress={() => {
            if (!selected) return;
            const t = THERAPISTS.find(x => x.id === selected)!;
            router.push({ pathname: '/appointment-details', params: { id: t.id, name: t.name, email: t.email } });
          }}
        >
          <Text style={a.primaryBtnText}>Termin auswählen</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </Pressable>
      </ScrollView>

      {/* Drawer Modal */}
      <Modal
        visible={drawerOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setDrawerOpen(false)}
      >
        <View style={a.drawerContainer}>
          <TouchableOpacity 
            style={a.drawerOverlay}
            activeOpacity={1}
            onPress={() => setDrawerOpen(false)}
          />
          <View style={a.drawerContent}>
            <CustomDrawer 
              navigation={{ navigate: (route: string) => { router.push(route as any); setDrawerOpen(false); } } as any}
              onLogout={() => { setDrawerOpen(false); router.push("/login-patient"); }}
            />
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
}

const a = StyleSheet.create({
  bg: { flex: 1 },
  wrap: { flex: 1, padding: 20 },
  
  /* HEADER */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
  },
  brand: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1F2937",
    letterSpacing: 0.5,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  /* HERO */
  hero: {
    alignItems: "center",
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  heroIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F3E8FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1F2937",
    marginBottom: 8,
    textAlign: "center",
  },
  heroSubtitle: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 22,
    maxWidth: 320,
  },

  /* SEARCH */
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: "#1F2937",
  },

  /* SECTION */
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 16,
  },

  /* GRID */
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 16,
    marginBottom: 24,
  },
  cardTherapist: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    gap: 12,
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  dot: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#9E86B9",
    borderWidth: 2,
    borderColor: "#fff",
  },
  tName: {
    fontWeight: "700",
    fontSize: 15,
    color: "#1F2937",
  },
  tRating: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "500",
  },

  /* EMPTY STATE */
  emptyState: {
    alignItems: "center",
    paddingVertical: 48,
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
    color: "#9CA3AF",
    fontWeight: "600",
  },

  /* BUTTON */
  primaryBtn: {
    flexDirection: "row",
    alignSelf: "center",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
    marginBottom: 32,
    backgroundColor: "#9E86B9",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    shadowColor: "#9E86B9",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryBtnText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
  },

  /* DRAWER */
  drawerContainer: {
    flex: 1,
    flexDirection: "row",
  },
  drawerOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  drawerContent: {
    width: 280,
    height: "100%",
  },
});