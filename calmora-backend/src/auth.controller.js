const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

function signToken(userId) {
  return jwt.sign(
    { sub: userId },
    process.env.JWT_SECRET || "dev_secret",
    { expiresIn: "1h" }
  );
}

async function register(req, res) {
  // Debug: zeigt dir, ob die App wirklich das Backend trifft + welche Daten ankommen
  console.log("REGISTER BODY:", req.body);

  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ error: "Missing fields: email, password, role" });
    }

    // Wenn dein Frontend "Patient"/"Therapist" schickt, wird es dadurch akzeptiert
    const normalizedRole = String(role).toUpperCase();
    if (!["PATIENT", "THERAPIST"].includes(normalizedRole)) {
      return res.status(400).json({ error: "role must be PATIENT or THERAPIST" });
    }

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return res.status(409).json({ error: "Email already exists" });

    const roleRow = await prisma.role.findUnique({ where: { name: normalizedRole } });
    if (!roleRow) {
      return res.status(500).json({ error: "Roles not seeded. Run seed-roles.js" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        roles: { create: [{ roleId: roleRow.id }] },
        patientProfile: normalizedRole === "PATIENT" ? { create: {} } : undefined,
        therapistProfile: normalizedRole === "THERAPIST" ? { create: {} } : undefined,
      },
    });

    return res.status(201).json({ message: "User registered", userId: user.id });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function login(req, res) {
  console.log("LOGIN BODY:", req.body); // optional debug

  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Missing email or password" });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { roles: { include: { role: true } } },
    });

    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    const token = signToken(user.id);

    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        roles: user.roles.map((r) => r.role.name),
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = { register, login };
