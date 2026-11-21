import prisma from "@/lib/prisma";
import { SERVICE_PATHS } from "@/content/servicePaths";
import { EDITABLE_FIELDS, type EditableField } from "@/lib/pageTexts";
import { savePageTexts } from "./actions";

export const dynamic = "force-dynamic";

export default async function TextosPage() {
  let rows: { path: string; field: string; value: string }[] = [];
  let missingTable = false;
  try {
    rows = await prisma.pageText.findMany();
  } catch {
    missingTable = true;
  }
  const byPath = new Map<string, Partial<Record<EditableField, string>>>();
  for (const r of rows) byPath.set(r.path, { ...byPath.get(r.path), [r.field]: r.value });
  const paths = [...SERVICE_PATHS, "/contacto"];

  return (
    <div>
      <h1>Textos de las páginas</h1>
      <p style={{ color: "var(--text-muted)" }}>
        Sobrescriben el título y la descripción SEO de cada página. Déjalos vacíos para usar el texto original.
        Los cambios pueden tardar hasta una hora en verse (caché).
      </p>
      {missingTable && (
        <p style={{ color: "#b00020" }}>La tabla PageText aún no existe en la base de datos: hay que aplicar la migración.</p>
      )}
      {paths.map((path) => {
        const t = byPath.get(path) ?? {};
        return (
          <form key={path} action={savePageTexts} style={{ background: "#fff", border: "1px solid #e5e5e5", borderRadius: 10, padding: "1rem", margin: "1rem 0", display: "grid", gap: "0.5rem" }}>
            <input type="hidden" name="path" value={path} />
            <strong>{path}</strong>
            {(Object.keys(EDITABLE_FIELDS) as EditableField[]).map((f) => (
              <label key={f} style={{ display: "grid", gap: 4, fontSize: "0.85rem" }}>
                {EDITABLE_FIELDS[f]}
                {f === "seoDescription" ? (
                  <textarea name={f} defaultValue={t[f] ?? ""} rows={2} maxLength={320} />
                ) : (
                  <input name={f} defaultValue={t[f] ?? ""} maxLength={120} />
                )}
              </label>
            ))}
            <button type="submit" disabled={missingTable} style={{ justifySelf: "start" }}>Guardar</button>
          </form>
        );
      })}
    </div>
  );
}
