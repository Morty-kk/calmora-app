import { UserRole } from "@prisma/client";

export type PublicUser = {
  id: string;
  email: string;
  phoneNumber: string | null;
  role: UserRole;
};

export type AuthTokenPayload = {
  userId: string;
};
