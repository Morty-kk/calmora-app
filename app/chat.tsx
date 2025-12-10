import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  ImageBackground,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

type Message = {
  id: string;
  text: string;
  from: "user" | "therapist";
  time: string;
};

const initialMessages: Message[] = [
  {
    id: "1",
    text: "Hallo Herr Bellamy, ich fühle mich in letzter Zeit sehr gestresst und weiß nicht genau warum.",
    from: "user",
    time: "10:13",
  },
  {
    id: "2",
    text: "Danke, dass du das sagst. Kannst du mir ein bisschen genauer beschreiben, was dich im Moment am meisten belastet?",
    from: "therapist",
    time: "10:14",
  },
  {
    id: "3",
    text: "Alles zu viel wird, Arbeit, Familie, alles zusammen. Ich kann mich kaum entspannen.",
    from: "user",
    time: "10:14",
  },
  {
    id: "4",
    text: "Wirklich schwer. Wir können gemeinsam schauen, was dir helfen könnte, etwas Ruhe und Kontrolle zurückzubekommen.",
    from: "therapist",
    time: "10:15",
  },
  {
    id: "5",
    text: "Das wäre gut. Ich möchte wirklich lernen, besser damit umzugehen.",
    from: "user",
    time: "10:16",
  },
];

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;

    const now = new Date();
    const time = now.toLocaleTimeString("de-DE", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      from: "user",
      time,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");
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
        <Text style={styles.name}>Herr Bellamy N</Text>

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
          <ScrollView
            contentContainerStyle={styles.messagesContainer}
            showsVerticalScrollIndicator={false}
          >
            {messages.map((m) => {
              const isUser = m.from === "user";
              return (
                <View
                  key={m.id}
                  style={[
                    styles.bubble,
                    isUser ? styles.rightBubble : styles.leftBubble,
                  ]}
                >
                  <Text style={isUser ? styles.rightText : styles.leftText}>
                    {m.text}
                  </Text>
                  <Text
                    style={isUser ? styles.timeRight : styles.timeLeft}
                  >{`${m.time}${isUser ? " ✓" : ""}`}</Text>
                </View>
              );
            })}

            {/* Schreib-Status (optional, immer sichtbar) */}
            <Text style={styles.typing}>Herr Bellamy schreibt…</Text>
          </ScrollView>
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
  typing: {
    fontSize: 12,
    color: "#666",
    marginTop: 8,
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
});
