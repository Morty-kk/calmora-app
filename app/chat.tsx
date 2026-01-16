import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
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

import { useAuth } from "../context/AuthContext";
import { useNotify } from "../context/NotifyContext";
import {
  ChatMessage,
  getConversationMessages,
  markMessageRead,
  sendMessage,
} from "../services/api";

const PAGE_SIZE = 30;

function formatTime(value: string) {
  return new Date(value).toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ChatScreen() {
  const { token, user } = useAuth();
  const { setUnreadChats } = useNotify();

  // ✅ حل TypeScript: نخلي user any ونطلع id بأي اسم موجود
  const u: any = user;
  const myId =
    u?.id ?? u?.userId ?? u?.user?.id ?? u?.profile?.id ?? null;

  // ✅ reset badge أول ما تفتح صفحة الشات
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
    Number.isNaN(conversationIdNumber) || conversationIdNumber <= 0;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

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

          if (prev.length === 0) return data.messages;

          const latestIds = new Set(data.messages.map((message) => message.id));
          const preserved = prev.filter((message) => !latestIds.has(message.id));
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
    [conversationIdNumber, token, invalidConversation]
  );

  useEffect(() => {
    if (!token) {
      setError("Bitte anmelden, um Nachrichten zu sehen.");
      setLoading(false);
      return;
    }
    if (invalidConversation) {
      setError("Ungültige Unterhaltung.");
      setLoading(false);
      return;
    }
    loadMessages();
  }, [invalidConversation, loadMessages, token]);

  useEffect(() => {
    if (!token || invalidConversation) return;

    const interval = setInterval(() => {
      loadMessages();
    }, 4000);

    return () => clearInterval(interval);
  }, [loadMessages, token, invalidConversation]);

  // ✅ mark as read بدون user?.id
  useEffect(() => {
    if (!token || !myId) return;

    const unread = messages.filter(
      (message) => !message.readAt && message.senderId !== Number(myId)
    );

    unread.forEach((message) => {
      markMessageRead(token, message.id).catch(() => null);
    });
  }, [messages, token, myId]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;
    if (!token || invalidConversation || sending) return;

    const tempId = Date.now() * -1;

    const optimisticMessage: ChatMessage = {
      id: tempId,
      conversationId: conversationIdNumber,
      senderId: Number(myId) || 0,
      content: text,
      createdAt: new Date().toISOString(),
      readAt: null,
    };

    setMessages((prev) => [optimisticMessage, ...prev]);
    setInput("");
    setSending(true);

    try {
      const data = await sendMessage(token, conversationIdNumber, {
        content: text,
      });

      setMessages((prev) =>
        prev.map((message) => (message.id === tempId ? data.message : message))
      );
    } catch (err) {
      setMessages((prev) => prev.filter((message) => message.id !== tempId));
      setError(
        err instanceof Error
          ? err.message
          : "Nachricht konnte nicht gesendet werden."
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color="black" />
        </Pressable>

        <Image
          source={require("../assets/profile-placeholder.jpg")}
          style={styles.avatar}
        />
        <Text style={styles.name}>{normalizedPartnerEmail || "Chat"}</Text>

        <Ionicons
          name="call"
          size={22}
          color="black"
          style={{ marginLeft: "auto" }}
        />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={80}
      >
        {/* CHAT MIT HINTERGRUND */}
        <ImageBackground
          source={require("../assets/bg.png")}
          style={styles.chatArea}
          resizeMode="cover"
        >
          {loading ? (
            <View style={styles.centered}>
              <ActivityIndicator size="small" color="#7C6FB3" />
            </View>
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : messages.length === 0 ? (
            <Text style={styles.emptyText}>Noch keine Nachrichten.</Text>
          ) : (
            <FlatList
              data={messages}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => {
                const isUser = Number(item.senderId) === Number(myId);
                return (
                  <View
                    style={[
                      styles.bubble,
                      isUser ? styles.rightBubble : styles.leftBubble,
                    ]}
                  >
                    <Text style={isUser ? styles.rightText : styles.leftText}>
                      {item.content}
                    </Text>
                    <Text style={isUser ? styles.timeRight : styles.timeLeft}>
                      {`${formatTime(item.createdAt)}${isUser ? " ✓" : ""}`}
                    </Text>
                  </View>
                );
              }}
              inverted
              contentContainerStyle={styles.messagesContainer}
              showsVerticalScrollIndicator={false}
              onEndReached={() => {
                if (nextCursor) {
                  loadMessages({ cursor: nextCursor, append: true });
                }
              }}
              onEndReachedThreshold={0.4}
            />
          )}
        </ImageBackground>

        {/* EINGABE-LEISTE */}
        <View style={styles.inputBar}>
          <Ionicons name="add" size={26} />
          <TextInput
            placeholder="schreibe eine Nachricht..."
            style={styles.input}
            value={input}
            onChangeText={setInput}
            onSubmitEditing={handleSend}
            returnKeyType="send"
          />
          <TouchableOpacity onPress={handleSend}>
            <Ionicons name="send" size={22} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FADDC8",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    backgroundColor: "#FADDC8",
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    marginHorizontal: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
  },
  chatArea: {
    flex: 1,
  },
  messagesContainer: {
    padding: 15,
    paddingBottom: 24,
  },
  bubble: {
    padding: 12,
    borderRadius: 18,
    marginBottom: 10,
    maxWidth: "80%",
  },
  rightBubble: {
    backgroundColor: "#B28AD6",
    alignSelf: "flex-end",
  },
  leftBubble: {
    backgroundColor: "#FFD9B3",
    alignSelf: "flex-start",
  },
  rightText: {
    color: "white",
    fontSize: 14,
  },
  leftText: {
    color: "#4A4A4A",
    fontSize: 14,
  },
  timeRight: {
    fontSize: 10,
    color: "white",
    textAlign: "right",
    marginTop: 4,
  },
  timeLeft: {
    fontSize: 10,
    color: "#555",
    marginTop: 4,
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FADDC8",
    padding: 10,
  },
  input: {
    flex: 1,
    backgroundColor: "white",
    marginHorizontal: 10,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 14,
  },
  centered: {
    marginTop: 20,
    alignItems: "center",
  },
  emptyText: {
    marginTop: 20,
    color: "#7C6FB3",
    textAlign: "center",
  },
  errorText: {
    marginTop: 20,
    color: "#B00020",
    textAlign: "center",
  },
});

