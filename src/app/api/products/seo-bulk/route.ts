import { createHash } from "node:crypto";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { STORE_ORIGIN } from "@/lib/seo/productSeo";

export const runtime = "nodejs";
type SeoRow = {
  id: string;
  name?: string;
  seoTitle?: string;
  seoDescription?: string;
  slug?: string;
  description?: string;
  seoImageAlt?: string;
};
type SeoUpdate = Omit<SeoRow, "id">;

const allowedFields = new Set(["id", "name", "seoTitle", "seoDescription", "slug", "description", "seoImageAlt"]);
const limits: Record<keyof SeoUpdate, number> = {
  name: 180, seoTitle: 150, seoDescription: 300, slug: 140, description: 16000, seoImageAlt: 180,
};
const uuidPattern = /^[a-f0-9]{8}-(?:[a-f0-9]{4}-){3}[a-f0-9]{12}$/i;
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const fields: Array<keyof SeoUpdate> = ["name", "seoTitle", "seoDescription", "slug", "description", "seoImageAlt"];

class InvalidBatch extends Error {}

function parseRows(value: unknown): SeoRow[] {
  if (!Array.isArray(value) || value.length === 0 || value.length > 100) {
    throw new InvalidBatch("Se permiten entre 1 y 100 productos por lote.");
  }
  const ids = new Set<string>();
  const slugs = new Set<string>();
  return value.map((entry, index): SeoRow => {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
      throw new InvalidBatch("Fila " + (index + 1) + ": formato inválido.");
    }
    const raw = entry as Record<string, unknown>;
    if (Object.keys(raw).some(key => !allowedFields.has(key))) {
      throw new InvalidBatch("Fila " + (index + 1) + ": contiene columnas no autorizadas.");
    }
    const id = String(raw.id || "").trim().toLowerCase();
    if (!uuidPattern.test(id) || ids.has(id)) {
      throw new InvalidBatch("Fila " + (index + 1) + ": ID inválido o repetido.");
    }
    ids.add(id);
    const row: SeoRow = { id };
    for (const field of fields) {
      const value = raw[field];
      if (value === undefined || value === "") continue;
      if (typeof value !== "string") throw new InvalidBatch("Valor inválido en " + field);
      const text = value.trim();
      if (!text) continue;
      if (text.length > limits[field]) throw new InvalidBatch(field + " excede el máximo de " + limits[field] + " caracteres.");
      if (field === "slug") {
        const slug = text.toLowerCase();
        if (!slugPattern.test(slug) || uuidPattern.test(slug) || slugs.has(slug)) {
          throw new InvalidBatch("Slug inválido o repetido: " + slug);
        }
        slugs.add(slug);
        row.slug = slug;
      } else {
        row[field] = text;
      }
    }
    if (fields.every(field => row[field] === undefined)) {
      throw new InvalidBatch("Fila " + (index + 1) + ": no contiene datos SEO para actualizar.");
    }
    return row;
  });
}

async function inspectBatch(client: any, rows: SeoRow[]) {
  const ids = rows.map(x => x.id);
  const products = await client.product.findMany({
    where: { id: { in: ids } },
    select: { id: true, name: true, isActive: true, updatedAt: true, slug: true,
      seoTitle: true, seoDescription: true, seoImageAlt: true, description: true },
  });
  const byId = new Map<string, any>(products.map((x: any) => [x.id, x]));
  if (products.length !== ids.length || rows.some(row => !byId.get(row.id)?.isActive)) {
    throw new InvalidBatch("Hay IDs inexistentes o productos inactivos. No se aplicó ningún cambio.");
  }
  const wantedSlugs = rows.flatMap(row => row.slug ? [row.slug] : []);
  if (wantedSlugs.length) {
    const conflicts = await client.product.findMany({
      where: { slug: { in: wantedSlugs }, id: { notIn: ids } },
      select: { slug: true },
    });
    if (conflicts.length) throw new InvalidBatch("Uno o más slugs ya pertenecen a otro producto.");
  }
  const changes: Array<{ id: string; name: string; fields: string[]; patch: SeoUpdate }> = [];
  for (const row of rows) {
    const product = byId.get(row.id)!;
    const patch: SeoUpdate = {};
    for (const field of fields) {
      if (row[field] !== undefined && row[field] !== product[field]) {
        // El JSON aceptado solo contiene el subconjunto explícito de campos SEO.
        Object.assign(patch, { [field]: row[field] });
      }
    }
    if (Object.keys(patch).length) changes.push({
      id: row.id, name: product.name, fields: Object.keys(patch), patch,
    });
  }
  const snapshot = rows.map(row => {
    const product = byId.get(row.id)!;
    return { id: product.id, name: product.name, updatedAt: product.updatedAt.toISOString(),
      slug: product.slug, seoTitle: product.seoTitle,
      seoDescription: product.seoDescription, seoImageAlt: product.seoImageAlt,
      description: product.description };
  });
  const fingerprint = createHash("sha256")
    .update(JSON.stringify({ rows, snapshot })).digest("hex");
  return { changes, fingerprint };
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string } | undefined)?.id?.toLowerCase();
    if (!userId) return NextResponse.json({ error: "Sesión requerida." }, { status: 401 });
    const admins = (process.env.STORE_ADMIN_IDS || "").split(",")
      .map(value => value.trim().toLowerCase()).filter(Boolean);
    if (!admins.includes(userId)) return NextResponse.json({ error: "Acceso no autorizado." }, { status: 403 });

    const configured = new URL(process.env.NEXTAUTH_URL || STORE_ORIGIN).origin;
    if (request.headers.get("origin") !== configured) {
      return NextResponse.json({ error: "Origen no permitido." }, { status: 403 });
    }
    if (!request.headers.get("content-type")?.startsWith("application/json")) {
      return NextResponse.json({ error: "Se requiere JSON." }, { status: 415 });
    }
    const text = await request.text();
    if (text.length > 2_000_000) throw new InvalidBatch("El lote supera el tamaño máximo.");
    const body = JSON.parse(text);
    if (body?.mode !== "preview" && body?.mode !== "commit") {
      throw new InvalidBatch("Modo inválido.");
    }
    const rows = parseRows(body.rows);
    if (body.mode === "preview") {
      const result = await inspectBatch(prisma, rows);
      return NextResponse.json({
        fingerprint: result.fingerprint,
        modifiedCount: result.changes.length,
        unchangedCount: rows.length - result.changes.length,
        changes: result.changes.map(({ id, name, fields }) => ({ id, name, fields })),
      });
    }
    if (typeof body.fingerprint !== "string" || !/^[a-f0-9]{64}$/.test(body.fingerprint)) {
      throw new InvalidBatch("Primero ejecuta la vista previa.");
    }
    const result = await prisma.$transaction(async tx => {
      const checked = await inspectBatch(tx, rows);
      if (checked.fingerprint !== body.fingerprint) {
        throw new InvalidBatch("Los datos cambiaron desde la vista previa. Vuelve a revisar el lote.");
      }
      for (const change of checked.changes) {
        await tx.product.update({
          where: { id: change.id },
          data: change.patch as Prisma.ProductUpdateInput,
        });
      }
      return { count: checked.changes.length };
    }, { timeout: 30000 });
    return NextResponse.json({ success: true, updatedCount: result.count });
  } catch (err) {
    const message = err instanceof InvalidBatch ? err.message : "No se aplicó el lote. Revisa los datos y vuelve a intentar.";
    return NextResponse.json({ error: message }, { status: err instanceof InvalidBatch ? 400 : 500 });
  }
}
