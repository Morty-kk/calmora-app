import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
    ActivityIndicator,
    FlatList,
    Image,
    ImageBackground,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import BottomTabs from "../components/BottomTabs";
import CustomDrawer from "../components/Customrawer";
import { useAuth } from "../context/AuthContext";
import {
    Conversation,
    createConversation,
    getConversations,
} from "../services/api";

function formatTimestamp(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  return date.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
}

export default function ChatList() {
  const { token, user } = useAuth();

  // ✅ Fix TypeScript: user كـ any واستخراج role بشكل robust
  const u: any = user;
  const role = useMemo(
    () =>
      String(
        u?.role ?? u?.userRole ?? u?.user?.role ?? u?.profile?.role ?? ""
      ).toUpperCase(),
    [u]
  );
  const isTherapist = role === "THERAPIST";

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const loadConversations = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await getConversations(token);
      setConversations(data.conversations);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Chats konnten nicht geladen werden.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  useFocusEffect(
    useCallback(() => {
      loadConversations();
    }, [loadConversations])
  );

  useEffect(() => {
    if (!token) return;
    const interval = setInterval(loadConversations, 4000);
    return () => clearInterval(interval);
  }, [loadConversations, token]);

  const startDemoChat = async () => {
    if (!token) {
      setError("Bitte anmelden.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const data = await createConversation(token, {
        patientEmail: "patient@example.com",
        therapistEmail: "therapist@example.com",
      });

      // Reload list
      await loadConversations();

      const partner = isTherapist
        ? data.conversation.patient
        : data.conversation.therapist;

      // Direkt in Chat springen
      router.push({
        pathname: isTherapist ? "/therapist-chat" : "/chat",
        params: {
          conversationId: data.conversation.id.toString(),
          partnerEmail: partner.email,
        },
      });
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Conversation konnte nicht erstellt werden."
      );
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: Conversation }) => {
    const partner = isTherapist ? item.patient : item.therapist;

    const lastMessageText = item.lastMessage?.content || "Keine Nachrichten";
    const timeLabel = item.lastMessage?.createdAt
      ? formatTimestamp(item.lastMessage.createdAt)
      : "";

    return (
      <TouchableOpacity
        style={styles.row}
        onPress={() =>
          router.push({
            pathname: isTherapist ? "/therapist-chat" : "/chat",
            params: {
              conversationId: item.id.toString(),
              partnerEmail: partner.email,
            },
          })
        }
        activeOpacity={0.7}
      >
        <View style={styles.avatarContainer}>
          <Image
            source={require("../assets/profile-placeholder.jpg")}
            style={styles.avatar}
          />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{partner.email}</Text>
          <Text style={styles.status} numberOfLines={1}>
            {lastMessageText}
          </Text>
        </View>

        <View style={styles.meta}>
          {timeLabel && <Text style={styles.time}>{timeLabel}</Text>}
          <Ionicons name="chevron-forward" size={20} color="#9E86B9" />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ImageBackground
      source={require("../assets/bg.png")}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.wrap}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
            <Ionicons name="chevron-back" size={24} color="#2B2B2B" />
          </TouchableOpacity>

          <Text style={styles.brand}>Calmora</Text>

          <TouchableOpacity onPress={() => setMenuOpen(true)} activeOpacity={0.7}>
            <Ionicons name="menu" size={24} color="#2B2B2B" />
          </TouchableOpacity>
        </View>

        {/* Hero Section */}
        <View style={styles.hero}>
          <View style={styles.heroIconContainer}>
            <Ionicons name="chatbubbles" size={36} color="#9E86B9" />
          </View>
          <Text style={styles.heroTitle}>Meine Chats</Text>
        </View>

        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color="#9E86B9" />
          </View>
        ) : error ? (
          <View style={styles.errorCard}>
            <Ionicons name="alert-circle" size={32} color="#EF4444" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : conversations.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyCard}>
              <Ionicons name="chatbubble-outline" size={48} color="#9E86B9" />
              <Text style={styles.emptyTitle}>Keine Chats</Text>
              <Text style={styles.emptyText}>Du hast noch keine Unterhaltungen.</Text>
            </View>

            <TouchableOpacity 
              style={styles.startButton} 
              onPress={startDemoChat}
              activeOpacity={0.7}
            >
              <Ionicons name="add-circle" size={20} color="#fff" />
              <Text style={styles.startButtonText}>Demo Chat starten</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={conversations}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {/* Drawer Modal */}
      {menuOpen && (
        <Modal
          visible={menuOpen}
          transparent
          animationType="fade"
          onRequestClose={() => setMenuOpen(false)}
        >
          <View style={styles.drawerContainer}>
            <Pressable
              style={styles.drawerOverlay}
              onPress={() => setMenuOpen(false)}
            />
            <View style={styles.drawerContent}>
              <CustomDrawer
                navigation={{
                  navigate: (route: string) => {
                    router.push(route as any);
                    setMenuOpen(false);
                  },
                }}
                onLogout={() => {
                  setMenuOpen(false);
                }}
              />
            </View>
          </View>
        </Modal>
      )}

      <BottomTabs />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrap: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 8,
    marginBottom: 8,
  },
  brand: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2B2B2B",
  },

  hero: {
    alignItems: "center",
    paddingVertical: 20,
    gap: 12,
  },
  heroIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#F3E8FF",
    alignItems: "center",
    justifyContent: "center",
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2B2B2B",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: "#F3E8FF",
  },
  name: {
    fontWeight: "700",
    fontSize: 16,
    color: "#2B2B2B",
    marginBottom: 4,
  },
  status: {
    fontSize: 14,
    color: "#666",
  },
  listContent: {
    paddingBottom: 20,
  },
  meta: {
    alignItems: "flex-end",
    justifyContent: "center",
    gap: 4,
  },
  time: {
    fontSize: 12,
    color: "#999",
    marginBottom: 4,
  },

  centered: {
    marginTop: 40,
    alignItems: "center",
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  emptyCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 32,
    alignItems: "center",
    gap: 12,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2B2B2B",
  },
  emptyText: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
  },

  errorCard: {
    backgroundColor: "#FEE2E2",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    gap: 12,
    marginTop: 20,
  },
  errorText: {
    fontSize: 15,
    color: "#DC2626",
    textAlign: "center",
    fontWeight: "600",
  },

  startButton: {
    marginTop: 20,
    backgroundColor: "#9E86B9",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  startButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },

  /* Drawer */
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
