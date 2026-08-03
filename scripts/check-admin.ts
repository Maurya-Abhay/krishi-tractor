import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    const user = await prisma.user.findUnique({ where: { phone: "9661329757" } });
    if (!user) {
      console.log("ADMIN_USER_NOT_FOUND");
      return;
    }
    console.log("ADMIN_USER_FOUND", { phone: user.phone, name: user.name, hashLength: user.passwordHash.length });
    const valid = await bcrypt.compare("abhay123", user.passwordHash);
    console.log("PASSWORD_MATCH", valid);
  } catch (error) {
    console.error("ERROR", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
