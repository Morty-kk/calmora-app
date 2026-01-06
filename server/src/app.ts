import cors from "cors";
import express from "express";

import authRouter from "./routes/auth.js";
import { authMiddleware } from "./middleware/auth.js";
import { prisma } from "./prisma.js";
import { PublicUser } from "./types.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/auth", authRouter);

app.get("/me", authMiddleware, async (req, res) => {
  const userId = (req as any).userId as string | undefined;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, phoneNumber: true, role: true },
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const payload: PublicUser = {
    id: user.id,
    email: user.email,
    phoneNumber: user.phoneNumber,
    role: user.role,
  };

  return res.json({ user: payload });
});

export default app;
