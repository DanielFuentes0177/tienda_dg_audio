import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { getAuthSecret } from "@/lib/auth-secret";
import { clearFailures, clientIp, failuresLocked, recordFailure } from "@/lib/rate-limit";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" }
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Credenciales inválidas");
        }

        const ip = clientIp({ get: (n: string) => (req?.headers as Record<string, string> | undefined)?.[n.toLowerCase()] ?? null });
        const email = String(credentials.email).trim().toLowerCase();
        const ipKey = `login-ip:${ip}`;
        const emailKey = `login-email:${email}`;
        const WINDOW = 15 * 60_000;
        if (failuresLocked(ipKey, 30, WINDOW).locked || failuresLocked(emailKey, 8, WINDOW).locked) {
          throw new Error("Demasiados intentos fallidos. Espera unos minutos e inténtalo de nuevo.");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.trim() }
        });

        if (!user) {
          recordFailure(ipKey);
          recordFailure(emailKey);
          throw new Error("Credenciales inválidas");
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordValid) {
          recordFailure(ipKey);
          recordFailure(emailKey);
          throw new Error("Credenciales inválidas");
        }

        clearFailures(emailKey);

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (session.user as any).id = token.id;
      }
      return session;
    }
  },
  secret: getAuthSecret(),
};
