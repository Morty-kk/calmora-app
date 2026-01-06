import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";

import { prisma } from "../prisma.js";
import { JWT_SECRET } from "../config.js";
import { PublicUser } from "../types.js";

const router = Router();

const roleEnum = z.enum(["PATIENT", "THERAPIST", "ADMIN"]);

const registerSchema = z.object({
  email: z.string().email(),
  phoneNumber: z.string().min(6).optional(),
  password: z.string().min(6),
  role: roleEnum.default("PATIENT"),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

function toPublicUser(user: {
  id: string;
  email: string;
  phoneNumber: string | null;
  role: string;
}): PublicUser {
  return {
    id: user.id,
    email: user.email,
    phoneNumber: user.phoneNumber,
    role: user.role as PublicUser["role"],
  };
}

router.post("/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid payload", errors: parsed.error.flatten() });
  }

  const { email, phoneNumber, password, role } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(409).json({ message: "User with this email already exists" });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const created = await prisma.user.create({
    data: {
      email,
      phoneNumber: phoneNumber || null,
      passwordHash,
      role,
    },
  });

  const token = jwt.sign({ userId: created.id }, JWT_SECRET!, { expiresIn: "7d" });

  return res.status(201).json({ user: toPublicUser(created), token });
});

router.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid payload", errors: parsed.error.flatten() });
  }

  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET!, { expiresIn: "7d" });

  return res.json({ user: toPublicUser(user), token });
});

export default router;
