const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("./prisma");

function signToken(userId) {
  return jwt.sign(
    { sub: userId },
    process.env.JWT_SECRET || "dev_secret",
    { expiresIn: "1h" }
  );
}

async function register(req, res) {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ error: "Missing fields: email, password, role" });
    }

    const normalizedRole = String(role).toUpperCase();
    if (!["PATIENT", "THERAPIST"].includes(normalizedRole)) {
      return res.status(400).json({ error: "role must be PATIENT or THERAPIST" });
    }

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return res.status(409).json({ error: "Email already exists" });

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: normalizedRole,
      },
    });

    return res.status(201).json({ message: "User registered", userId: user.id });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Missing email or password" });
    }

    const user = await prisma.user.findUnique({
      where: { email },
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
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = { register, login };
