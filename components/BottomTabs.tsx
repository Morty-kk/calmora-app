import { Ionicons } from "@expo/vector-icons";
import { Link, usePathname } from "expo-router";
import { Platform, Pressable, Text, View } from "react-native";

import { useNotify } from "../context/NotifyContext";

export default function BottomTabs() {
  const path = usePathname();
  const { unreadChats } = useNotify();

  const isActive = (href: string) => path === href;

  const Item = ({
    href,
    label,
    icon,
    showBadge = false,
  }: {
    href: "/menu" | "/chat-list" | "/profile";
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
    showBadge?: boolean;
  }) => (
    <Link href={href} asChild>
      <Pressable
        style={{
          flex: 1,
          alignItems: "center",
          paddingVertical: 10,
          gap: 2,
          opacity: isActive(href) ? 1 : 0.7,
        }}
      >
        <View style={{ position: "relative" }}>
          <Ionicons name={icon} size={18} color="#111827" />

          {/* ✅ Badge فقط على Chat */}
          {showBadge && unreadChats > 0 && (
            <View
              style={{
                position: "absolute",
                top: -6,
                right: -10,
                minWidth: 18,
                height: 18,
                borderRadius: 9,
                paddingHorizontal: 5,
                backgroundColor: "red",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 11,
                  fontWeight: "700",
                }}
              >
                {unreadChats > 99 ? "99+" : unreadChats}
              </Text>
            </View>
          )}
        </View>

        <Text
          style={{
            fontSize: 12,
            fontWeight: isActive(href) ? "800" : "500",
          }}
        >
          {label}
        </Text>
      </Pressable>
    </Link>
  );

  return (
    <View
      style={{
        position: Platform.select({ web: "fixed", default: "absolute" }) as any,
        left: 16,
        right: 16,
        bottom: 16,
        backgroundColor: "#F5D8C9",
        borderRadius: 16,
        flexDirection: "row",
        shadowOpacity: 0.08,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
        borderWidth: 1,
        borderColor: "#00000010",
        zIndex: 1,
        elevation: 8,
        pointerEvents: "auto",
      }}
    >
      <Item href="/menu" label="Startseite" icon="home" />
      <Item
        href="/chat-list"
        label="Chat"
        icon="chatbubble-ellipses"
        showBadge
      />
      <Item href="/profile" label="Profil" icon="person" />
    </View>
  );
}
