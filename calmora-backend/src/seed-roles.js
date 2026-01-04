const { PrismaClient } = require('@prisma/client');
const dotenv = require('dotenv');

dotenv.config();

const prisma = new PrismaClient();

async function seedRoles() {
  const roles = [
    { name: 'PATIENT', description: 'Patient user' },
    { name: 'THERAPIST', description: 'Therapist user' }
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: role,
      create: role
    });
  }
}

seedRoles()
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('Roles seeded successfully');
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Error seeding roles:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
