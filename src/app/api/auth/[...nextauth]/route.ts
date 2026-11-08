import NextAuth from "next-auth";
import type { NextRequest } from "next/server";
import { authOptions } from "@/lib/auth";
import { authSecret } from "@/lib/admin-policy";

async function handler(request: NextRequest, context: { params: Promise<{ nextauth: string[] }> }) {
  const secret = authSecret();
  if (!secret) return Response.json({ error: "Autenticación no disponible" }, { status: 503 });
  return NextAuth({ ...authOptions, secret })(request, context);
}

export { handler as GET, handler as POST };
