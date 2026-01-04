const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

dotenvConfig();

const prisma = new PrismaClient();
const ALLOWED_ROLES = ['PATIENT', 'THERAPIST'];

function dotenvConfig() {
  const dotenv = require('dotenv');
  dotenv.config();
}

async function register(req, res) {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ error: 'email, password and role are required' });
    }

    const normalizedRole = String(role).toUpperCase();
    if (!ALLOWED_ROLES.includes(normalizedRole)) {
      return res.status(400).json({ error: 'role must be PATIENT or THERAPIST' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    const roleRecord = await prisma.role.findUnique({ where: { name: normalizedRole } });
    if (!roleRecord) {
      return res
        .status(500)
        .json({ error: 'Roles are missing. Please run `node src/seed-roles.js`.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        roles: {
          create: {
            role: { connect: { id: roleRecord.id } }
          }
        },
        patientProfile: normalizedRole === 'PATIENT' ? { create: {} } : undefined,
        therapistProfile: normalizedRole === 'THERAPIST' ? { create: {} } : undefined
      },
      include: {
        roles: { include: { role: true } }
      }
    });

    return res.status(201).json({
      id: user.id,
      email: user.email,
      roles: user.roles.map((r) => r.role.name)
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Register error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'email and password are required' });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        roles: { include: { role: true } }
      }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const userRoles = user.roles.map((r) => r.role.name);
    const token = jwt.sign({ sub: user.id, roles: userRoles }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });

    return res.json({
      token,
      user: { id: user.id, email: user.email },
      roles: userRoles
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  register,
  login
};
