"use client";

import { useState, type ChangeEvent } from "react";
import Papa from "papaparse";

type SeoRow = {
  id: string;
  seoTitle?: string;
  seoDescription?: string;
  slug?: string;
  description?: string;
  seoImageAlt?: string;
};
type Preview = {
  fingerprint: string;
  modifiedCount: number;
  unchangedCount: number;
  changes: Array<{ id: string; name: string; fields: string[] }>;
};
const translations: Record<string, string> = {
  seoTitle: "Título SEO", seoDescription: "Metadescripción",
  slug: "URL", description: "Descripción visible", seoImageAlt: "ALT de imagen",
};
const columns = {
  seoTitle: ["SEO_Titulo", "SEO_Title"],
  seoDescription: ["Meta_Descripcion", "Meta_Description"],
  slug: ["SEO_Slug"],
  description: ["Descripcion_Comercial"],
  seoImageAlt: ["SEO_ALT"],
} as const;
function cell(row: Record<string, unknown>, names: readonly string[]): string | undefined {
  for (const name of names) {
    const value = row[name];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return undefined;
}

export default function SeoProductsPage() {
  const [rows, setRows] = useState<SeoRow[]>([]);
  const [filename, setFilename] = useState("");
  const [preview, setPreview] = useState<Preview | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function onFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    setError(""); setSuccess(""); setPreview(null); setRows([]);
    if (!file) return;
    setFilename(file.name);
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete: result => {
        if (result.errors.length) {
          setError("No se pudo leer el CSV. Verifica la codificación UTF-8 y las columnas.");
          return;
        }
        if (!result.meta.fields?.includes("ID_Producto")) {
          setError("Falta la columna obligatoria ID_Producto.");
          return;
        }
        if (!result.data.length || result.data.length > 100) {
          setError("Cada archivo debe contener entre 1 y 100 productos.");
          return;
        }
        const mapped = result.data.map(row => ({
          id: (row.ID_Producto || "").trim(),
          seoTitle: cell(row, columns.seoTitle),
          seoDescription: cell(row, columns.seoDescription),
          slug: cell(row, columns.slug),
          description: cell(row, columns.description),
          seoImageAlt: cell(row, columns.seoImageAlt),
        }));
        if (mapped.some(row => !row.id)) {
          setError("Todas las filas requieren ID_Producto.");
          return;
        }
        if (mapped.some(row => Object.values(row).filter(Boolean).length < 2)) {
          setError("Hay productos sin campos SEO para actualizar.");
          return;
        }
        setRows(mapped);
      },
      error: () => setError("No se pudo leer el CSV."),
    });
  }

  async function callApi(mode: "preview" | "commit") {
    if (!rows.length) return;
    setBusy(true); setError(""); setSuccess("");
    try {
      const response = await fetch("/api/products/seo-bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, rows, fingerprint: preview?.fingerprint }),
      });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || "Operación rechazada.");
      if (mode === "preview") setPreview(json as Preview);
      else {
        setSuccess(`Actualización concluida: ${json.updatedCount} productos modificados. Verifica las fichas antes del siguiente lote.`);
        setPreview(null); setRows([]); setFilename("");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ocurrió un error.");
      setPreview(null);
    } finally {
      setBusy(false);
    }
  }

  function confirm() {
    if (!preview?.modifiedCount) return;
    const approved = window.confirm(`¿Publicar cambios SEO de ${preview.modifiedCount} productos en la tienda? No se alterarán existencias, imágenes ni estados.`);
    if (approved) void callApi("commit");
  }

  return (
    <main style={{ padding: "2rem", maxWidth: 1100, margin: "0 auto", color: "#222" }}>
      <p><a href="/admin/products">← Volver a productos</a></p>
      <h1>Actualización SEO por CSV</h1>
      <p>Máximo 100 productos por lote. Esta herramienta modifica exclusivamente SEO, ALT y, si lo incluyes, la descripción comercial.</p>
      <p style={{ background: "#f4f0e7", padding: "1rem", borderRadius: 8 }}>
        No usar el botón general «Importar CSV» para estos lotes. Las celdas vacías no borran datos.
        Primero revisa la vista previa; después confirma la publicación.
      </p>
      <section style={{ background: "white", padding: "1.5rem", border: "1px solid #ddd", borderRadius: 10 }}>
        <label htmlFor="seo-file" style={{ display: "block", fontWeight: 600, marginBottom: 8 }}>
          Archivo CSV UTF-8
        </label>
        <input id="seo-file" type="file" accept=".csv,text/csv" onChange={onFile} disabled={busy} />
        <p style={{ fontSize: 13, color: "#555", wordBreak: "break-word" }}>
          Columnas: ID_Producto (obligatoria), SEO_Titulo, Meta_Descripcion, SEO_Slug,
          Descripcion_Comercial, SEO_ALT. Los nombres, modelos, precios, imágenes,
          existencias y publicaciones permanecen intactos.
        </p>
        {filename && <p>Archivo: <strong>{filename}</strong> — {rows.length} registros</p>}
        <button type="button" disabled={busy || !rows.length} onClick={() => void callApi("preview")}
          style={{ padding: "0.7rem 1.2rem", background: "#2e2e2e", color: "white", border: 0, borderRadius: 6, cursor: "pointer" }}>
          {busy ? "Procesando…" : "Validar y previsualizar"}
        </button>
      </section>
      {error && <p role="alert" style={{ color: "#b91c1c", fontWeight: 600 }}>{error}</p>}
      {success && <p role="status" style={{ color: "#166534", fontWeight: 600 }}>{success}</p>}
      {preview && (
        <section style={{ marginTop: 20, padding: "1.5rem", border: "1px solid #ddd", borderRadius: 10, background: "white" }}>
          <h2>Vista previa — sin cambios aplicados</h2>
          <p>{preview.modifiedCount} a modificar · {preview.unchangedCount} sin cambios</p>
          <div style={{ maxHeight: 380, overflow: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr><th style={{ textAlign: "left", padding: 8 }}>Producto</th><th style={{ textAlign: "left", padding: 8 }}>Campos a modificar</th></tr></thead>
              <tbody>{preview.changes.map(c => (
                <tr key={c.id} style={{ borderTop: "1px solid #eee" }}>
                  <td style={{ padding: 8 }}>{c.name}<small style={{ display: "block", color: "#777" }}>{c.id}</small></td>
                  <td style={{ padding: 8 }}>{c.fields.map(x => translations[x] || x).join(", ")}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
          <button type="button" onClick={confirm} disabled={busy || !preview.modifiedCount}
            style={{ marginTop: 20, padding: "0.75rem 1.4rem", background: "#146c43", color: "white", border: 0, borderRadius: 6, cursor: "pointer", fontWeight: 700 }}>
            Confirmar y publicar {preview.modifiedCount} cambios
          </button>
        </section>
      )}
    </main>
  );
}
