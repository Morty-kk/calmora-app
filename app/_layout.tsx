import "expo-router/entry";

import { Stack, router, usePathname } from "expo-router";
import { useEffect, useRef } from "react";
import { Alert } from "react-native";

import { AuthProvider, useAuth } from "../context/AuthContext";
import { NotifyProvider, useNotify } from "../context/NotifyContext";

import { getConversations } from "../services/api";

function InAppChatNotifier() {
  const { token, user } = useAuth();
  const { setUnreadChats } = useNotify();
  const pathname = usePathname();

  // نخزن آخر lastMessageId لكل محادثة حتى نعرف إذا في جديد
  const lastSeenMapRef = useRef<Record<number, number>>({});
  const initializedRef = useRef(false);

  useEffect(() => {
    const u: any = user;

    const myId =
      u?.id ?? u?.userId ?? u?.user?.id ?? u?.profile?.id ?? null;

    const roleValue =
      u?.role ?? u?.userRole ?? u?.user?.role ?? u?.profile?.role ?? "";

    if (!token || !myId) return;

    const isTherapist = String(roleValue).toUpperCase() === "THERAPIST";

    const tick = async () => {
      try {
        const data: any = await getConversations(token);
        const conversations: any[] = data?.conversations ?? [];

        // ✅ تحديث Badge Count (لو عندك unreadCount)
        const unreadTotal = conversations.reduce((sum, c) => {
          const cnt = Number(c?.unreadCount ?? 0);
          return sum + (Number.isFinite(cnt) ? cnt : 0);
        }, 0);
        setUnreadChats(unreadTotal);

        // أول مرة: baseline بدون Alerts
        if (!initializedRef.current) {
          conversations.forEach((c: any) => {
            const convId = Number(c?.id);
            const lastId = Number(c?.lastMessage?.id);
            if (convId && lastId) {
              lastSeenMapRef.current[convId] = lastId;
            }
          });
          initializedRef.current = true;
          return;
        }

        for (const c of conversations) {
          const convId = Number(c?.id);
          if (!convId) continue;

          const lastMsg = c?.lastMessage;
          const newLastId = Number(lastMsg?.id);
          if (!newLastId) continue;

          const lastSeenId = lastSeenMapRef.current[convId] ?? 0;

          // ما في جديد
          if (newLastId <= lastSeenId) continue;

          // حدّث الخريطة فورًا حتى ما يكرر التنبيه
          lastSeenMapRef.current[convId] = newLastId;

          // إذا الرسالة مني أنا → ما بدنا تنبيه
          const senderId = Number(lastMsg?.senderId);
          if (senderId === Number(myId)) continue;

          // إذا أنا حاليًا جوّا صفحة الشات → ما تطلع تنبيه
          const isOnChatScreen =
            pathname === "/chat" ||
            pathname === "/therapist-chat" ||
            pathname?.includes("chat");

          if (isOnChatScreen) continue;

          const partner = isTherapist ? c?.patient : c?.therapist;
          const partnerEmail = partner?.email ?? "Chat";
          const content = lastMsg?.content ?? "";

          Alert.alert("Neue Nachricht", `${partnerEmail}: ${content}`, [
            { text: "Später", style: "cancel" },
            {
              text: "Öffnen",
              onPress: () => {
                router.push({
                  pathname: isTherapist ? "/therapist-chat" : "/chat",
                  params: {
                    conversationId: String(convId),
                    partnerEmail,
                  },
                });
              },
            },
          ]);

          // تنبيه واحد بكل tick حتى ما يصير spam
          break;
        }
      } catch {
        // ignore
      }
    };

    tick();
    const interval = setInterval(tick, 4000);
    return () => clearInterval(interval);
  }, [token, user, pathname, setUnreadChats]);

  return null;
}

function RootLayout() {
  return (
    <>
      <InAppChatNotifier />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}

export default function Layout() {
  return (
    <AuthProvider>
      <NotifyProvider>
        <RootLayout />
      </NotifyProvider>
    </AuthProvider>
  );
}


