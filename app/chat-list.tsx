import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";


import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

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

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

      // ✅ FIX: robust role check
      const isTherapist = (user?.role ?? "").toUpperCase() === "THERAPIST";
      const partner = isTherapist
        ? data.conversation.patient
        : data.conversation.therapist;

      // Direkt in Chat springen
      router.push({
        pathname: "/chat",
        params: {
          conversationId: data.conversation.id.toString(),
          partnerEmail: partner.email,
        },
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Conversation konnte nicht erstellt werden.");
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: Conversation }) => {
    // ✅ FIX: robust role check
    const partner = item.therapist;


    const lastMessageText = item.lastMessage?.content || "Keine Nachrichten";
    const timeLabel = item.lastMessage?.createdAt
      ? formatTimestamp(item.lastMessage.createdAt)
      : "";

    return (
      <Pressable
        style={styles.row}
        onPress={() =>
          router.push({
            pathname: "/chat",
            params: {
              conversationId: item.id.toString(),
              partnerEmail: partner.email,
            },
          })
        }
      >
        <Image
          source={require("../assets/profile-placeholder.jpg")}
          style={styles.avatar}
        />

        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{partner.email}</Text>
          <Text style={styles.status} numberOfLines={1}>
            {lastMessageText}
          </Text>
        </View>

        <View style={styles.meta}>
          {timeLabel ? <Text style={styles.time}>{timeLabel}</Text> : null}
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} />
        </Pressable>

        <Text style={styles.title}>Calmora</Text>

        <Ionicons name="menu" size={22} />
      </View>

      <Text style={styles.subtitle}>Chatliste</Text>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="small" color="#7C6FB3" />
        </View>
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : conversations.length === 0 ? (
        <View>
          <Text style={styles.emptyText}>Keine Unterhaltungen gefunden.</Text>

          <Pressable style={styles.startButton} onPress={startDemoChat}>
            <Text style={styles.startButtonText}>Start Chat (Demo)</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FADDC8",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#7C6FB3",
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8E3D7",
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  name: {
    fontWeight: "700",
    fontSize: 16,
  },
  status: {
    fontSize: 12,
    opacity: 0.7,
  },
  listContent: {
    paddingBottom: 20,
  },
  meta: {
    alignItems: "flex-end",
    justifyContent: "center",
    minWidth: 60,
  },
  time: {
    fontSize: 12,
    color: "#7C6FB3",
  },
  centered: {
    marginTop: 20,
    alignItems: "center",
  },
  emptyText: {
    marginTop: 20,
    color: "#7C6FB3",
  },
  errorText: {
    marginTop: 20,
    color: "#B00020",
  },

  // ✅ زر إنشاء محادثة Demo
  startButton: {
    marginTop: 14,
    backgroundColor: "#7C6FB3",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  startButtonText: {
    color: "white",
    fontWeight: "700",
  },
});


