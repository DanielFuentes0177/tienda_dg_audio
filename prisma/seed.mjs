import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { randomBytes } from "node:crypto";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@dgaudio.com";
  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (!existingUser) {
    // Sin contraseñas fijas en el repositorio: se genera una al azar y se muestra una sola vez.
    const password = process.env.ADMIN_PASSWORD || randomBytes(12).toString("base64url");
    const hashedPassword = await bcrypt.hash(password, 12);
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: "Admin DG Audio",
      },
    });
    console.log("Admin user created successfully.");
    if (!process.env.ADMIN_PASSWORD) console.log(`Contraseña inicial (guárdala y cámbiala): ${password}`);
  } else {
    console.log("Admin user already exists.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
