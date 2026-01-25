import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";

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
import { useNotify } from "../context/NotifyContext";
import {
    Conversation,
    createConversation,
    getConversations,
} from "../services/api";

type Variant = "patient" | "therapist";

function formatTimestamp(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  return date.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
}

export default function ChatList({ variant = "patient" }: { variant?: Variant }) {
  const { token, user } = useAuth();
  const { updateFromConversations } = useNotify();

  const u: any = user;
  const myId = u?.id ?? u?.userId ?? u?.user?.id ?? u?.profile?.id ?? null;

  const theme = useMemo(() => {
    if (variant === "therapist") {
      return {
        screenBg: "#E5E7EB",
        rowBg: "#F3F4F6",
        title: "#111827",
        subtitle: "#374151",
        time: "#111827",
        headerBg: "#E5E7EB",
        badgeRed: "#E53935",
        demoBtnBg: "#111827",
      };
    }
    return {
      screenBg: "#FADDC8",
      rowBg: "#F8E3D7",
      title: "#7C6FB3",
      subtitle: "#111827",
      time: "#7C6FB3",
      headerBg: "#FADDC8",
      badgeRed: "#E53935",
      demoBtnBg: "#7C6FB3",
    };
  }, [variant]);

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const chatPath = variant === "therapist" ? "/therapist-chat" : "/chat";

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

      updateFromConversations(data.conversations);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Chats konnten nicht geladen werden.");
    } finally {
      setLoading(false);
    }
  }, [token, updateFromConversations]);

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

      await loadConversations();

      const conv = data.conversation;

      const partner =
        Number(myId) === Number(conv.patientId) ? conv.therapist : conv.patient;

      router.push({
        pathname: chatPath,
        params: {
          conversationId: conv.id.toString(),
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
    const partner =
      Number(myId) === Number(item.patientId) ? item.therapist : item.patient;

    const lastMessageText = item.lastMessage?.content || "Keine Nachrichten";
    const timeLabel = item.lastMessage?.createdAt
      ? formatTimestamp(item.lastMessage.createdAt)
      : "";

    const unread = Number(item.unreadCount ?? 0);

    return (
      <Pressable
        style={[styles.row, { backgroundColor: theme.rowBg }]}
        onPress={() =>
          router.push({
            pathname: chatPath,
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
          <Text style={[styles.name, { color: theme.title }]}>{partner.email}</Text>
          <Text style={styles.status} numberOfLines={1}>
            {lastMessageText}
          </Text>
        </View>

        <View style={styles.meta}>
          {timeLabel ? (
            <Text style={[styles.time, { color: theme.time }]}>{timeLabel}</Text>
          ) : null}

          {unread > 0 ? (
            <View style={[styles.unreadBadge, { backgroundColor: theme.badgeRed }]}>
              <Text style={styles.unreadText}>
                {unread > 9 ? "9+" : String(unread)}
              </Text>
            </View>
          ) : null}
        </View>
      </Pressable>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.screenBg }]}>
      <View style={[styles.header, { backgroundColor: theme.headerBg }]}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={theme.title} />
        </Pressable>

        <Text style={[styles.title, { color: theme.title }]}>Calmora</Text>

        <Ionicons name="menu" size={22} color={theme.title} />
      </View>

      <Text style={[styles.subtitle, { color: theme.subtitle }]}>
        {variant === "therapist" ? "Therapist Chatliste" : "Chatliste"}
      </Text>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="small" color={theme.title} />
        </View>
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : conversations.length === 0 ? (
        <View>
          <Text style={[styles.emptyText, { color: theme.title }]}>
            Keine Unterhaltungen gefunden.
          </Text>

          <Pressable
            style={[styles.startButton, { backgroundColor: theme.demoBtnBg }]}
            onPress={startDemoChat}
          >
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
  container: { flex: 1, padding: 16 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  title: { fontSize: 20, fontWeight: "700" },
  subtitle: { fontSize: 14, marginBottom: 12 },

  row: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
  },
  avatar: { width: 48, height: 48, borderRadius: 24, marginRight: 12 },
  name: { fontWeight: "700", fontSize: 16 },
  status: { fontSize: 12, opacity: 0.7 },

  listContent: { paddingBottom: 20 },
  meta: { alignItems: "flex-end", justifyContent: "center", minWidth: 60 },
  time: { fontSize: 12 },

  centered: { marginTop: 20, alignItems: "center" },
  emptyText: { marginTop: 20 },
  errorText: { marginTop: 20, color: "#B00020" },

  startButton: {
    marginTop: 14,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  startButtonText: { color: "white", fontWeight: "700" },

  unreadBadge: {
    marginTop: 6,
    minWidth: 22,
    height: 22,
    paddingHorizontal: 6,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  unreadText: { color: "white", fontSize: 12, fontWeight: "700" },
});




