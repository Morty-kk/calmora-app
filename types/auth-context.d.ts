import type { ReactNode } from 'react';

type Role = 'PATIENT' | 'THERAPIST' | 'ADMIN' | null;
type LoginPayload = { email: string; password: string };
type RegisterPayload = { email: string; password: string; phoneNumber?: string; role?: Role | string };
type AuthContextValue = {
  loading: boolean;
  initializing: boolean;
  token: string | null;
  role: Role;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<any>;
  register: (payload: RegisterPayload) => Promise<any>;
  logout: () => Promise<void> | void;
  refreshUser: (token?: string | null) => Promise<any>;
};

declare module "../context/AuthContext" {
  export const AuthProvider: ({ children }: { children: ReactNode }) => JSX.Element;
  export function useAuth(): AuthContextValue;
}
