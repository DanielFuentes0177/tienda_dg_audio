"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { assertAdmin } from "@/lib/auth-guard";
import { EDITABLE_FIELDS, type EditableField } from "@/lib/pageTexts";
import { SERVICE_PATHS } from "@/content/servicePaths";

const VALID_PATHS = new Set([...SERVICE_PATHS, "/contacto"]);
const MAX: Record<EditableField, number> = { seoTitle: 120, seoDescription: 320 };

/** Guarda (o borra, si va vacío) los textos de una página. Lista blanca de ruta y campos. */
export async function savePageTexts(formData: FormData) {
  await assertAdmin();
  const path = String(formData.get("path") ?? "");
  if (!VALID_PATHS.has(path)) throw new Error("Ruta no válida");
  for (const field of Object.keys(EDITABLE_FIELDS) as EditableField[]) {
    const value = String(formData.get(field) ?? "").trim().slice(0, MAX[field]);
    if (value) {
      await prisma.pageText.upsert({
        where: { path_field: { path, field } },
        update: { value },
        create: { path, field, value },
      });
    } else {
      await prisma.pageText.deleteMany({ where: { path, field } });
    }
  }
  revalidatePath(path);
  revalidatePath("/admin/textos");
}
