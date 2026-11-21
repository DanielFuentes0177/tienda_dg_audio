import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

type AdminGuard =
  | { ok: true }
  | { ok: false; response: NextResponse };

/**
 * Úsalo al inicio de CADA handler de /api que modifique datos o exponga
 * información privada:
 *
 *   const guard = await requireAdmin();
 *   if (!guard.ok) return guard.response;
 */
export async function requireAdmin(): Promise<AdminGuard> {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return { ok: false, response: NextResponse.json({ error: "No autorizado" }, { status: 401 }) };
  }
  return { ok: true };
}

/** Para Server Actions ("use server"): lanza si no hay sesión de admin. */
export async function assertAdmin(): Promise<void> {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("No autorizado");
}

export async function isAdminSession(): Promise<boolean> {
  const session = await getServerSession(authOptions);
  return Boolean(session?.user);
}
