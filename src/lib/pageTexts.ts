import type { Metadata } from "next";
import prisma from "@/lib/prisma";

export const EDITABLE_FIELDS = { seoTitle: "Título SEO (title)", seoDescription: "Descripción SEO (meta description)" } as const;
export type EditableField = keyof typeof EDITABLE_FIELDS;

/**
 * Textos editados en el admin para una ruta. Nunca lanza: sin DATABASE_URL o sin la tabla
 * (migración aún no aplicada) devuelve {} y la página usa los textos del código.
 */
export async function getPageTexts(path: string): Promise<Partial<Record<EditableField, string>>> {
  if (!process.env.DATABASE_URL) return {};
  try {
    const rows = await prisma.pageText.findMany({ where: { path } });
    const out: Partial<Record<EditableField, string>> = {};
    for (const r of rows) if (r.field in EDITABLE_FIELDS && r.value.trim()) out[r.field as EditableField] = r.value.trim();
    return out;
  } catch {
    return {};
  }
}

/** Aplica los textos editados a un Metadata (title, description y sus equivalentes OG/Twitter). */
export async function withPageTexts(path: string, meta: Metadata): Promise<Metadata> {
  const t = await getPageTexts(path);
  if (!t.seoTitle && !t.seoDescription) return meta;
  const next: Metadata = { ...meta };
  if (t.seoTitle) {
    next.title = { absolute: t.seoTitle };
    next.openGraph = { ...meta.openGraph, title: t.seoTitle } as Metadata["openGraph"];
    next.twitter = { ...meta.twitter, title: t.seoTitle } as Metadata["twitter"];
  }
  if (t.seoDescription) {
    next.description = t.seoDescription;
    next.openGraph = { ...(next.openGraph ?? meta.openGraph), description: t.seoDescription } as Metadata["openGraph"];
    next.twitter = { ...(next.twitter ?? meta.twitter), description: t.seoDescription } as Metadata["twitter"];
  }
  return next;
}
