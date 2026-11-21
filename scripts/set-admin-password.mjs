/**
 * Cambia el correo y/o la contraseña del administrador SIN escribir la contraseña en el chat,
 * en el historial del shell ni en el código: se pide por la terminal con la entrada oculta.
 *
 *   node scripts/set-admin-password.mjs --email nuevo@correo.com
 *   node scripts/set-admin-password.mjs --from admin@dgaudio.com --email nuevo@correo.com
 *
 * Usa DATABASE_URL del .env (producción). Requiere contraseña de 12+ caracteres.
 */
import { createRequire } from "node:module";
import readline from "node:readline";
const require = createRequire(import.meta.url);
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

const arg = (name) => { const i = process.argv.indexOf(`--${name}`); return i > -1 ? process.argv[i + 1] : undefined; };

function askHidden(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    rl._writeToOutput = (s) => { if (s.includes(question)) rl.output.write(s); else rl.output.write(""); };
    rl.question(question, (answer) => { rl.output.write("\n"); rl.close(); resolve(answer); });
  });
}

async function main() {
  const users = await prisma.user.findMany({ select: { id: true, email: true } });
  const from = arg("from");
  const target = from ? users.find((u) => u.email === from) : users.length === 1 ? users[0] : null;
  if (!target) throw new Error(`No se pudo elegir el usuario (${users.map((u) => u.email).join(", ")}). Usa --from <correo>.`);

  const newEmail = (arg("email") || target.email).trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) throw new Error("Correo no válido.");

  const p1 = await askHidden("Nueva contraseña (12+ caracteres): ");
  const p2 = await askHidden("Repite la contraseña: ");
  if (p1 !== p2) throw new Error("Las contraseñas no coinciden.");
  if (p1.length < 12 || !/[A-Za-z]/.test(p1) || !/\d/.test(p1)) throw new Error("Usa 12+ caracteres con letras y números.");
  if (/dgaudio|dg-?audio|admin|123456|password|contraseña/i.test(p1) || /20\d\d/.test(p1)) {
    throw new Error("Evita nombres de la marca, 'admin', secuencias o años: son lo primero que se prueba.");
  }

  await prisma.user.update({ where: { id: target.id }, data: { email: newEmail, password: await bcrypt.hash(p1, 12) } });
  console.log(`Listo: ${target.email} -> ${newEmail}. Ya puedes iniciar sesión con la contraseña nueva.`);
}

main().catch((e) => { console.error("Error:", e.message); process.exit(1); }).finally(() => prisma.$disconnect());
