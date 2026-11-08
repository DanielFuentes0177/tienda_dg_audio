import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

async function main() {
  const email = process.env.SEED_USER_EMAIL?.trim();
  const password = process.env.SEED_USER_PASSWORD;
  const name = process.env.SEED_USER_NAME?.trim();
  if (!email || !name || !password || password.length < 16 || Buffer.byteLength(password) > 72) {
    throw new Error("El alta requiere identidad explícita y una contraseña válida.");
  }
  const prisma = new PrismaClient();
  try {
    if (await prisma.user.findUnique({ where: { email }, select: { id: true } })) return;
    await prisma.user.upsert({
      where: { email },
      update: {},
      create: { email, name, password: await bcrypt.hash(password, 12) },
    });
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(() => {
  console.error("No se completó el alta de usuario.");
  process.exitCode = 1;
});
