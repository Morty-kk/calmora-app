import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    ImageBackground,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const TAGS = ["Alle", "Alltag", "Therapie", "Abend"] as const;
type Tag = (typeof TAGS)[number];

const COURSES = [
  {
    id: "gentle-morning",
    title: "Sanfte Atemreise",
    desc: "Leichter Einstieg in deine Meditation – ideal für den Morgen.",
    tag: "Alltag" as Tag,
    length: "8 Min",
  },
  {
    id: "clear-head",
    title: "Klarer Kopf x 3",
    desc: "Drei kurze Sequenzen, um Grübelgedanken loszulassen.",
    tag: "Therapie" as Tag,
    length: "12 Min",
  },
  {
    id: "evening-wave",
    title: "Evening Balance",
    desc: "Sanfte Entspannung für den Abend, bevor du schlafen gehst.",
    tag: "Abend" as Tag,
    length: "10 Min",
  },
  {
    id: "inner-balance",
    title: "Innere Balance",
    desc: "Finde Ruhe in dir und komme in dein Gleichgewicht.",
    tag: "Alltag" as Tag,
    length: "15 Min",
  },
];

export default function MeditationCourses() {
  const [activeTag, setActiveTag] = useState<Tag>("Alle");

  const filtered =
    activeTag === "Alle"
      ? COURSES
      : COURSES.filter((c) => c.tag === activeTag);

  return (
    <ImageBackground
      source={require("../assets/bg.png")}
      style={styles.bg}
      resizeMode="cover"
    >
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={26} color="#111827" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Meditation</Text>

        <View style={styles.headerIconRight}>
          <Ionicons name="person-circle-outline" size={28} color="#1F2933" />
        </View>
      </View>

      <Text style={styles.sectionTitle}>Kurse</Text>

      {/* Tags */}
      <View style={styles.tagRow}>
        {TAGS.map((tag) => {
          const active = tag === activeTag;
          return (
            <TouchableOpacity
              key={tag}
              style={[styles.tag, active && styles.tagActive]}
              onPress={() => setActiveTag(tag)}
            >
              <Text style={[styles.tagText, active && styles.tagTextActive]}>
                {tag}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Kurskarten */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {filtered.map((course) => (
          <TouchableOpacity
            key={course.id}
            style={styles.courseCard}
            activeOpacity={0.85}
            onPress={() =>
              router.push({
                pathname: "/meditation-player/index",
                params: { id: course.id, title: course.title },
              })
            }
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.courseTitle}>{course.title}</Text>
              <Text style={styles.courseMeta}>
                {course.length} · {course.tag}
              </Text>
              <Text style={styles.courseDesc}>{course.desc}</Text>
            </View>

            <View style={styles.coursePlayBubble}>
              <Ionicons name="play" size={24} color="#fff" />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },
  headerIconRight: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },

  sectionTitle: {
    marginTop: 24,
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
  },

  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.7)",
    backgroundColor: "rgba(255,255,255,0.7)",
  },
  tagActive: {
    backgroundColor: "#9E86B9",
    borderColor: "#9E86B9",
  },
  tagText: {
    fontSize: 13,
    color: "#475569",
    fontWeight: "500",
  },
  tagTextActive: {
    color: "#F9FAFB",
    fontWeight: "700",
  },

  courseCard: {
    marginTop: 18,
    padding: 16,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.9)",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  courseMeta: {
    marginTop: 2,
    fontSize: 12,
    color: "#6B7280",
  },
  courseDesc: {
    marginTop: 6,
    fontSize: 13,
    color: "#4B5563",
  },
  coursePlayBubble: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#9E86B9",
    justifyContent: "center",
    alignItems: "center",
  },
});