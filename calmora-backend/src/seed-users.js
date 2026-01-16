const bcrypt = require("bcrypt");

const prisma = require("./prisma");

async function main() {
  const patientEmail = "patient@example.com";
  const therapistEmail = "therapist@example.com";
  const defaultPassword = "Password123!";

  const passwordHash = await bcrypt.hash(defaultPassword, 10);

  await prisma.user.upsert({
  where: { email: patientEmail },
  update: { name: "Patient Demo" },
  create: {
    email: patientEmail,
    passwordHash,
    role: "PATIENT",
    name: "Patient Demo",
  },
});


  await prisma.user.upsert({
  where: { email: therapistEmail },
  update: { name: "Therapist Demo" },
  create: {
    email: therapistEmail,
    passwordHash,
    role: "THERAPIST",
    name: "Therapist Demo",
  },
});


  // eslint-disable-next-line no-console
  console.log("Seeded patient and therapist users");
}

main()
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error("Seed error:", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
