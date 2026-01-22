import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth } from "../../context/AuthContext";
import { useNotify } from "../../context/NotifyContext";
import {
  ChatMessage,
  getConversationMessages,
  markConversationRead,
  sendMessage,
} from "../../services/api";

const PAGE_SIZE = 30;

function formatTime(value: string) {
  return new Date(value).toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function TherapistChatScreen() {
  const { token, user } = useAuth();
  const { setUnreadChats } = useNotify();
  const insets = useSafeAreaInsets();

  // ✅ Robust id
  const u: any = user;
  const myId = u?.id ?? u?.userId ?? u?.user?.id ?? u?.profile?.id ?? null;

  // ✅ reset badge لما الطبيب يفتح الشات
  useEffect(() => {
    setUnreadChats(0);
  }, [setUnreadChats]);

  const { conversationId, partnerEmail } = useLocalSearchParams();

  const normalizedConversationId = Array.isArray(conversationId)
    ? conversationId[0]
    : conversationId;

  const normalizedPartnerEmail = Array.isArray(partnerEmail)
    ? partnerEmail[0]
    : partnerEmail;

  const conversationIdNumber = useMemo(
    () => Number(normalizedConversationId),
    [normalizedConversationId]
  );

  const invalidConversation =
    !conversationIdNumber || Number.isNaN(conversationIdNumber);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  const listRef = useRef<FlatList<ChatMessage>>(null);

  /** ================= LOAD MESSAGES ================= */
  const loadMessages = useCallback(
    async (options: { cursor?: number; append?: boolean } = {}) => {
      if (!token || invalidConversation) return;

      if (!options.append) setLoading(true);
      setError(null);

      try {
        const data = await getConversationMessages(token, conversationIdNumber, {
          limit: PAGE_SIZE,
          cursor: options.cursor,
        });

        setNextCursor(data.nextCursor);

        setMessages((prev) => {
          if (options.append) return [...prev, ...data.messages];

          const latestIds = new Set(data.messages.map((m) => m.id));
          const preserved = prev.filter((m) => !latestIds.has(m.id));
          return [...data.messages, ...preserved];
        });
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Nachrichten konnten nicht geladen werden."
        );
      } finally {
        if (!options.append) setLoading(false);
      }
    },
    [token, invalidConversation, conversationIdNumber]
  );

  /** ================= INITIAL LOAD ================= */
  useEffect(() => {
    if (!token) {
      setError("Bitte anmelden.");
      setLoading(false);
      return;
    }
    if (invalidConversation) {
      setError("Ungültige Unterhaltung.");
      setLoading(false);
      return;
    }
    loadMessages();
  }, [token, invalidConversation, loadMessages]);

  /** ================= POLLING ================= */
  useEffect(() => {
    if (!token || invalidConversation) return;
    const interval = setInterval(() => loadMessages(), 4000);
    return () => clearInterval(interval);
  }, [token, invalidConversation, loadMessages]);

  /** ================= MARK CONVERSATION AS READ ================= */
  useEffect(() => {
    if (!token || !myId || invalidConversation) return;
    if (messages.length === 0) return;

    const hasUnreadFromOther = messages.some(
      (m) => !m.readAt && m.senderId !== Number(myId)
    );
    if (!hasUnreadFromOther) return;

    // Optimistic UI
    const nowIso = new Date().toISOString();
    setMessages((prev) =>
      prev.map((m) =>
        !m.readAt && m.senderId !== Number(myId) ? { ...m, readAt: nowIso } : m
      )
    );

    markConversationRead(token, conversationIdNumber).catch(() => null);
  }, [messages, token, myId, conversationIdNumber, invalidConversation]);

  /** ================= SEND MESSAGE ================= */
  const handleSend = async () => {
    const text = input.trim();
    if (!text || !token || !myId || invalidConversation || sending) return;

    const tempId = Date.now() * -1;

    const optimistic: ChatMessage = {
      id: tempId,
      conversationId: conversationIdNumber,
      senderId: Number(myId) || 0,
      content: text,
      createdAt: new Date().toISOString(),
      readAt: null,
    };

    setMessages((prev) => [optimistic, ...prev]);
    setInput("");
    setSending(true);

    try {
      const data = await sendMessage(token, conversationIdNumber, {
        content: text,
      });

      setMessages((prev) =>
        prev.map((m) => (m.id === tempId ? data.message : m))
      );
    } catch (err) {
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
      setError(
        err instanceof Error
          ? err.message
          : "Nachricht konnte nicht gesendet werden."
      );
    } finally {
      setSending(false);
    }
  };

  /** ================= UI ================= */
  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 14) }]}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color="#111827" />
        </Pressable>

        <Image
          source={require("../../assets/profile-placeholder.jpg")}
          style={styles.avatar}
        />

        <View style={{ flex: 1 }}>
          <Text style={styles.roleBadge}>THERAPIST</Text>
          <Text style={styles.name} numberOfLines={1}>
            {normalizedPartnerEmail || "Chat"}
          </Text>
        </View>

        <Ionicons name="call" size={22} color="#111827" />
      </View>

      {/* ✅ على iOS: خليه يزحلق المحتوى بشكل طبيعي بدون absolute bar */}
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        // ✅ offset منطقي: مسافة safe-area + الهيدر (تقريباً)
        keyboardVerticalOffset={Platform.OS === "ios" ? Math.max(insets.top, 14) + 56 : 0}
      >
        <ImageBackground
          source={require("../../assets/bg.png")}
          style={styles.chatArea}
        >
          {loading ? (
            <View style={styles.centered}>
              <ActivityIndicator size="small" color="#6B7280" />
            </View>
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : (
            <FlatList
              ref={listRef}
              data={messages}
              keyExtractor={(item) => item.id.toString()}
              inverted
              showsVerticalScrollIndicator={false}
              keyboardDismissMode="interactive"
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.messages}
              renderItem={({ item }) => {
                const isMe = Number(item.senderId) === Number(myId);
                return (
                  <View
                    style={[
                      styles.bubble,
                      isMe ? styles.rightBubble : styles.leftBubble,
                    ]}
                  >
                    <Text style={isMe ? styles.rightText : styles.leftText}>
                      {item.content}
                    </Text>

                    <Text style={isMe ? styles.timeRight : styles.timeLeft}>
                      {formatTime(item.createdAt)}
                      {isMe ? (item.readAt ? " ✓✓" : " ✓") : ""}
                    </Text>
                  </View>
                );
              }}
              onEndReached={() => {
                if (nextCursor !== null) {
                  loadMessages({ cursor: nextCursor, append: true });
                }
              }}
              onEndReachedThreshold={0.4}
            />
          )}
        </ImageBackground>

        {/* ✅ INPUT BAR (بدون absolute) */}
        <View
          style={[
            styles.bottomBar,
            { paddingBottom: Math.max(insets.bottom, 10) },
          ]}
        >
          <TextInput
            style={styles.input}
            placeholder="Nachricht schreiben..."
            placeholderTextColor="#6B7280"
            value={input}
            onChangeText={setInput}
            onSubmitEditing={handleSend}
            returnKeyType="send"
          />
          <TouchableOpacity onPress={handleSend} disabled={sending}>
            <Ionicons
              name="send"
              size={22}
              color={sending ? "#9CA3AF" : "#111827"}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

/** ================= STYLES ================= */
const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: "#E5E7EB" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingBottom: 10,
    gap: 10,
    backgroundColor: "#E5E7EB",
    borderBottomWidth: 1,
    borderBottomColor: "#D1D5DB",
  },
  roleBadge: { fontSize: 11, fontWeight: "700", color: "#6B7280" },
  avatar: { width: 34, height: 34, borderRadius: 17 },
  name: { fontSize: 16, fontWeight: "600", color: "#111827" },

  chatArea: { flex: 1 },
  messages: { padding: 16, paddingBottom: 12 },

  bubble: {
    maxWidth: "80%",
    padding: 14,
    borderRadius: 18,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  rightBubble: { backgroundColor: "#9E86B9", alignSelf: "flex-end" },
  leftBubble: {
    backgroundColor: "#FFFFFF",
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  rightText: { color: "white", fontSize: 16, lineHeight: 22 },
  leftText: { color: "#111827", fontSize: 16, lineHeight: 22 },
  timeRight: { fontSize: 11, color: "rgba(255,255,255,0.85)", marginTop: 6, fontWeight: "500" },
  timeLeft: { fontSize: 11, color: "#9CA3AF", marginTop: 6, fontWeight: "500" },

  bottomBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E5E7EB",
    paddingHorizontal: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#D1D5DB",
  },
  input: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 10,
    color: "#111827",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },

  centered: { marginTop: 20, alignItems: "center" },
  errorText: { textAlign: "center", marginTop: 20, color: "#B00020" },
});
