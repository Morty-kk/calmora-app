import { Stack } from "expo-router";

import { AuthProvider } from "../context/AuthContext";
import { UserProvider } from "../context/UserContext";

export default function Layout() {
  return (
    <UserProvider>
      <AuthProvider>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </AuthProvider>
    </UserProvider>
  );
}
