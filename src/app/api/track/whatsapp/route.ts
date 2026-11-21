import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const PATH_RE = /^\/[A-Za-z0-9\-_/]{0,150}$/;
const SOURCE_RE = /^[a-z0-9_-]{1,40}$/;
const BLOCKED_PREFIXES = ["/admin", "/api", "/login"];

/** Registra un clic en WhatsApp. Pública a propósito, pero validada y con límite por IP. */
export async function POST(req: Request) {
  const rl = rateLimit(`wa:${clientIp(req.headers)}`, 40, 10 * 60_000);
  if (!rl.ok) return new NextResponse(null, { status: 429 });

  try {
    const raw = await req.text();
    if (raw.length > 1000) return new NextResponse(null, { status: 413 });
    const { path, source } = JSON.parse(raw) as { path?: unknown; source?: unknown };
    if (typeof path !== "string" || typeof source !== "string") return new NextResponse(null, { status: 400 });
    if (!PATH_RE.test(path) || !SOURCE_RE.test(source)) return new NextResponse(null, { status: 400 });
    if (BLOCKED_PREFIXES.some((p) => path === p || path.startsWith(`${p}/`))) return new NextResponse(null, { status: 204 });

    await prisma.whatsappClick.create({ data: { path: path.replace(/\/+$/, "") || "/", source } });
    return new NextResponse(null, { status: 204 });
  } catch {
    return new NextResponse(null, { status: 400 });
  }
}
