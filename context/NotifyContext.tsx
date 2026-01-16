import React, { createContext, useContext, useState } from "react";

type NotifyState = {
  unreadChats: number;
  setUnreadChats: (n: number) => void;
};

const NotifyContext = createContext<NotifyState | null>(null);

export function NotifyProvider({ children }: { children: React.ReactNode }) {
  const [unreadChats, setUnreadChats] = useState(0);

  return (
    <NotifyContext.Provider value={{ unreadChats, setUnreadChats }}>
      {children}
    </NotifyContext.Provider>
  );
}

export function useNotify() {
  const ctx = useContext(NotifyContext);
  if (!ctx) throw new Error("useNotify must be used within NotifyProvider");
  return ctx;
}
