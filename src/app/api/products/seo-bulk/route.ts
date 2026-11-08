import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { parseSeoOnlyRows, inspectSeoOnlyRows, SeoOnlyInputError } from "@/lib/seo/seoOnlyRules.mjs";
import type { SeoOnlyRow, SeoOnlyInspection } from "@/lib/seo/seoOnlyRules.mjs";

export const runtime = "nodejs";
const MAX_BYTES = 2_000_000;
// This endpoint never writes without an explicitly enabled release flag.
const WRITE_FLAG = "SEO_BULK_WRITE_ENABLED";
const selectFields = {
  id: true, brand: true, model: true, name: true, description: true,
  category: true, subcategory: true, family: true, isActive: true,
  updatedAt: true, seoTitle: true, seoDescription: true,
} as const;

type InspectClient = Pick<typeof prisma, "product">;
async function inspectBatch(client: InspectClient, rows: SeoOnlyRow[]): Promise<SeoOnlyInspection> {
  const products = await client.product.findMany({
    where: { id: { in: rows.map(row => row.uuid) } },
    select: selectFields,
  });
  return inspectSeoOnlyRows(rows, products);
}
export async function POST(request: Request) {
  try {
    const configured = process.env.NEXTAUTH_URL;
    if (!configured || !process.env.STORE_ADMIN_IDS)
      return NextResponse.json({ error: "Administración SEO no configurada." }, { status: 503 });
    const expectedOrigin = new URL(configured).origin;
    if (request.headers.get("origin") !== expectedOrigin || new URL(request.url).origin !== expectedOrigin)
      return NextResponse.json({ error: "Origen no autorizado." }, { status: 403 });
    const session = await getServerSession(authOptions);
    const userId = String((session?.user as { id?: string } | undefined)?.id || "").toLowerCase();
    if (!userId) return NextResponse.json({ error: "Sesión requerida." }, { status: 401 });
    const admins = new Set(process.env.STORE_ADMIN_IDS.split(",").map(x => x.trim().toLowerCase()).filter(Boolean));
    if (!admins.has(userId)) return NextResponse.json({ error: "Administrador no autorizado." }, { status: 403 });
    if (!request.headers.get("content-type")?.startsWith("application/json"))
      return NextResponse.json({ error: "Solo se acepta JSON." }, { status: 415 });
    const bodyText = await request.text();
    if (bodyText.length > MAX_BYTES) throw new SeoOnlyInputError("Archivo mayor que 2 MB.");
    const body = JSON.parse(bodyText) as { mode?: string; rows?: unknown; fingerprint?: unknown };
    if (body.mode !== "preview" && body.mode !== "commit") throw new SeoOnlyInputError("Modo inválido.");
    const rows = parseSeoOnlyRows(body.rows);
    if (body.mode === "preview") {
      const inspection = await inspectBatch(prisma, rows);
      return NextResponse.json({
        mode: "preview", requestedCount: rows.length, fingerprint: inspection.fingerprint,
        modifiedCount: inspection.modifiedCount, unchangedCount: inspection.unchangedCount,
        blockedCount: inspection.blockedCount, blocked: inspection.blocked,
        ignoredColumns: inspection.ignoredColumns,
        changes: inspection.changes.map(c => ({ uuid: c.uuid, name: c.name, fields: c.fields })),
        writeEnabled: process.env[WRITE_FLAG] === "true",
        canCommit: inspection.blockedCount === 0 && process.env[WRITE_FLAG] === "true",
      });
    }
    if (process.env[WRITE_FLAG] !== "true")
      return NextResponse.json({ error: "Publicación SEO deshabilitada por control de liberación." }, { status: 403 });
    if (typeof body.fingerprint !== "string" || !/^[a-f0-9]{64}$/i.test(body.fingerprint))
      throw new SeoOnlyInputError("Primero realiza la simulación.");
    const count = await prisma.$transaction(async transaction => {
      const checked = await inspectBatch(transaction, rows);
      if (checked.blockedCount || checked.fingerprint !== body.fingerprint)
        throw new SeoOnlyInputError("Lote no aprobado o cambiado desde la simulación; cero escrituras.");
      for (const change of checked.changes) {
        // No upsert, no create, no stock, images, status, name, description or slug.
        await transaction.product.update({
          where: { id: change.uuid },
          data: change.patch as Prisma.ProductUpdateInput,
        });
      }
      return checked.changes.length;
    }, { timeout: 90_000 });
    return NextResponse.json({ success: true, updatedCount: count });
  } catch (error) {
    if (error instanceof SeoOnlyInputError || error instanceof SyntaxError)
      return NextResponse.json({ error: error.message }, { status: 400 });
    console.error("SEO-only batch validation failed");
    return NextResponse.json({ error: "No se pudo validar el lote. No se aplicó ningún cambio." }, { status: 500 });
  }
}
