import "server-only";
import { getServerSession } from "next-auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { authSecret, isAdminOrigin, isStoreAdmin } from "@/lib/admin-policy";

async function adminStatus() {
  const secret = authSecret();
  if (!secret) return 503;
  const session = await getServerSession({ ...authOptions, secret });
  if (!session?.user) return 401;
  return isStoreAdmin("id" in session.user ? session.user.id : undefined) ? 200 : 403;
}

export async function requireAdmin(request: Request) {
  let status = await adminStatus();
  if (status === 200 && request.method !== "GET" && !isAdminOrigin(request.headers.get("origin"))) {
    status = 403;
  }
  if (status === 200) return null;
  const error = status === 401 ? "Inicia sesión" : status === 403 ? "Acceso denegado" : "Administración no disponible";
  return NextResponse.json({ error }, { status, headers: { "Cache-Control": "private, no-store" } });
}

export async function requireAdminPage() {
  if (await adminStatus() !== 200) redirect("/login");
}

export async function requireAdminAction() {
  if (await adminStatus() !== 200 || !isAdminOrigin((await headers()).get("origin"))) {
    throw new Error("Acceso denegado");
  }
}
