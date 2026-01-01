import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type Msg = {
  id: string;
  from: "patient" | "therapist";
  text: string;
  time: string;
};

export default function TherapistChat() {
  const params = useLocalSearchParams<{ name?: string }>();
  const chatName = params.name ?? "Karl Heinz";

  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  const [messages, setMessages] = useState<Msg[]>(
    useMemo(
      () => [
        {
          id: "1",
          from: "patient",
          text: "Hallo Herr Bellamy, ich fühle mich in letzter Zeit sehr gestresst und weiß nicht genau warum.",
          time: "10:13",
        },
        {
          id: "2",
          from: "therapist",
          text: "Danke, dass du das sagst. Kannst du mir ein bisschen genauer beschreiben, was dich im Moment am meisten belastet?",
          time: "10:14",
        },
        {
          id: "3",
          from: "patient",
          text: "alles zu viel wird, Arbeit, Familie, alles zusammen Ich kann mich kaum entspannen",
          time: "10:14",
        },
        {
          id: "4",
          from: "therapist",
          text: "wirklich schwer. Wir können gemeinsam schauen, was dir helfen könnte, etwas Ruhe und Kontrolle zurückzubekommen",
          time: "10:15",
        },
        {
          id: "5",
          from: "patient",
          text: "Das wäre gut. Ich möchte wirklich lernen, besser damit umzugehen.",
          time: "10:16",
        },
      ],
      []
    )
  );

  const scrollRef = useRef<ScrollView>(null);

  const scrollToEnd = () => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    });
  };

  const send = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");

    setMessages((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        from: "therapist",
        text: trimmed,
        time: `${hh}:${mm}`,
      },
    ]);
    setInput("");
    setTyping(false);
    scrollToEnd();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
    >
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={10} style={styles.iconBtn}>
          <Ionicons name="arrow-back" size={22} color="#111" />
        </Pressable>

        <View style={styles.headerCenter}>
          <View style={styles.avatarSmall} />
          <Text style={styles.headerTitle}>{chatName}</Text>
        </View>

        <Pressable onPress={() => {}} hitSlop={10} style={styles.iconBtn}>
          <Ionicons name="call" size={20} color="#111" />
        </Pressable>
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollRef}
        style={styles.chatArea}
        contentContainerStyle={styles.chatContent}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={scrollToEnd}
      >
        {messages.map((m) => {
          const isTherapist = m.from === "therapist";
          return (
            <View key={m.id} style={styles.msgBlock}>
              <View
                style={[
                  styles.bubble,
                  isTherapist ? styles.rightBubble : styles.leftBubble,
                ]}
              >
                <Text style={styles.bubbleText}>{m.text}</Text>
              </View>

              <Text style={[styles.time, isTherapist ? styles.timeRight : styles.timeLeft]}>
                {m.time} {isTherapist ? "✓" : ""}
              </Text>
            </View>
          );
        })}

        <Text style={styles.typingText}>{typing ? `${chatName} schreibt...` : ""}</Text>
      </ScrollView>

      {/* Input Bar */}
      <View style={styles.inputRow}>
        <Pressable onPress={() => {}} hitSlop={10} style={styles.plusBtn}>
          <Ionicons name="add" size={24} color="#111" />
        </Pressable>

        <TextInput
          style={styles.input}
          placeholder="schreib eine Nachricht..."
          value={input}
          onChangeText={(t) => {
            setInput(t);
            setTyping(true);
          }}
          onSubmitEditing={send}
          returnKeyType="send"
        />

        <Pressable onPress={send} hitSlop={10} style={styles.sendBtn}>
          <Ionicons name="send" size={18} color="#111" />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  header: {
    height: 74,
    backgroundColor: "#BDBDBD",
    paddingHorizontal: 14,
    paddingTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#EDEDED",
    justifyContent: "center",
    alignItems: "center",
  },

  headerCenter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  avatarSmall: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#D9D9D9",
  },

  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
  },

  chatArea: { flex: 1 },

  chatContent: {
    paddingHorizontal: 14,
    paddingVertical: 14,
    paddingBottom: 18,
  },

  msgBlock: { marginBottom: 10 },

  bubble: {
    maxWidth: "78%",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  leftBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#9E9E9E",
  },

  rightBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#F1F1F1",
  },

  bubbleText: {
    fontSize: 13,
    color: "#111",
    fontWeight: "600",
    lineHeight: 18,
  },

  time: {
    fontSize: 11,
    color: "#3B5BA9",
    marginTop: 4,
    opacity: 0.85,
  },

  timeLeft: { alignSelf: "flex-start" },
  timeRight: { alignSelf: "flex-end" },

  typingText: {
    marginTop: 6,
    fontSize: 12,
    color: "#3B5BA9",
    opacity: 0.7,
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    backgroundColor: "#fff",
  },

  plusBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#EDEDED",
    justifyContent: "center",
    alignItems: "center",
  },

  input: {
    flex: 1,
    height: 44,
    backgroundColor: "#EDEDED",
    borderRadius: 14,
    paddingHorizontal: 14,
    fontSize: 14,
    fontWeight: "600",
    color: "#111",
  },

  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#EDEDED",
    justifyContent: "center",
    alignItems: "center",
  },
});
