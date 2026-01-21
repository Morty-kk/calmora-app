import React, { createContext, useContext, useMemo, useState } from "react";
import type { Conversation } from "../services/api";

type NotifyState = {
  unreadChats: number;

  // ✅ نحدث الرقم مباشرة
  setUnreadChats: (n: number) => void;

  // ✅ جديد: نحسبه من conversations
  updateFromConversations: (conversations: Conversation[]) => void;
};

const NotifyContext = createContext<NotifyState | null>(null);

export function NotifyProvider({ children }: { children: React.ReactNode }) {
  const [unreadChats, setUnreadChats] = useState(0);

  const updateFromConversations = (conversations: Conversation[]) => {
    const total = conversations.reduce((sum, c) => {
      return sum + Number(c.unreadCount ?? 0);
    }, 0);

    setUnreadChats(total);
  };

  const value = useMemo(
    () => ({
      unreadChats,
      setUnreadChats,
      updateFromConversations,
    }),
    [unreadChats]
  );

  return (
    <NotifyContext.Provider value={value}>
      {children}
    </NotifyContext.Provider>
  );
}

export function useNotify() {
  const ctx = useContext(NotifyContext);
  if (!ctx) {
    throw new Error("useNotify must be used within NotifyProvider");
  }
  return ctx;
}

