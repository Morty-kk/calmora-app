const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  await prisma.role.upsert({ where: { name: "PATIENT" }, update: {}, create: { name: "PATIENT" } });
  await prisma.role.upsert({ where: { name: "THERAPIST" }, update: {}, create: { name: "THERAPIST" } });
  console.log("Roles seeded");
}

main().finally(() => prisma.$disconnect());
