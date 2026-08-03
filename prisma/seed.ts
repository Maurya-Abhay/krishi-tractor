import { PrismaClient, ServiceUnit } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminName = process.env.SEED_ADMIN_NAME;
  const adminPhone = process.env.SEED_ADMIN_PHONE;
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;

  if (!adminName || !adminPhone || !adminPassword) {
    throw new Error(
      "SEED_ADMIN_NAME, SEED_ADMIN_PHONE and SEED_ADMIN_PASSWORD must be set in .env before seeding."
    );
  }

  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { phone: adminPhone },
    update: {},
    create: { name: adminName, phone: adminPhone, passwordHash },
  });

  const services: { name: string; unit: ServiceUnit; defaultRate: number }[] = [
    { name: "Sukha Jutai", unit: ServiceUnit.KATHA, defaultRate: 150 },
    { name: "Lewahi", unit: ServiceUnit.KATHA, defaultRate: 120 },
    { name: "Harvest Machine", unit: ServiceUnit.HOUR, defaultRate: 800 },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { name: service.name },
      update: {},
      create: service,
    });
  }

  console.log("Seed complete: admin user and 3 default services created.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
