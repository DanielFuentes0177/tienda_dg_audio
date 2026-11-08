"use client";

import { useState, type ChangeEvent } from "react";
import Papa from "papaparse";

type CsvRow = Record<string, string>;
type Preview = {
  fingerprint: string; requestedCount: number; modifiedCount: number;
  unchangedCount: number; blockedCount: number; writeEnabled: boolean; canCommit: boolean;
  ignoredColumns: string[];
  blocked: Array<{uuid: string; reason: string}>;
  changes: Array<{uuid: string; name: string; fields: string[]}>;
};
const supportedHeaders = [
  "CONTROL_NO_IMPORTAR", "uuid", "baseline_sha256", "baseline_updated_at",
  "brand_solo_guard", "model_solo_guard", "seo_title", "seo_meta_description",
  "seo_h1", "seo_body", "seo_slug_propuesto_no_aplicar",
  "estado_revision", "validacion_fabricante", "fuente_oficial", "inmutables_guard",
];
const requiredHeaders = [
  "CONTROL_NO_IMPORTAR", "uuid", "baseline_sha256", "baseline_updated_at",
  "brand_solo_guard", "model_solo_guard", "seo_title", "seo_meta_description", "inmutables_guard",
];

export default function SeoProductsPage() {
  const [rows, setRows] = useState<CsvRow[]>([]);
  const [filename, setFilename] = useState("");
  const [preview, setPreview] = useState<Preview | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function onFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setRows([]); setPreview(null); setError(""); setSuccess(""); setFilename(file?.name || "");
    if (!file) return;
    Papa.parse<CsvRow>(file, {
      header: true, skipEmptyLines: true,
      transformHeader: h => h.replace(/^\uFEFF/, "").trim(),
      complete: result => {
        if (result.errors.length) {
          setError("CSV inválido. Revisa las comillas y los separadores."); return;
        }
        const header = result.meta.fields || [];
        if (requiredHeaders.some(h => !header.includes(h))) {
          setError("Faltan columnas obligatorias del formato SEO-only del lote 002."); return;
        }
        if (header.some(h => !supportedHeaders.includes(h))) {
          setError("El archivo contiene columnas prohibidas; no se aceptan precios, stock, imágenes ni estados."); return;
        }
        if (!result.data.length || result.data.length > 100) {
          setError("Carga un lote de 1 a 100 productos."); return;
        }
        setRows(result.data);
      },
      error: () => setError("No fue posible leer el CSV."),
    });
  }

  async function execute(mode: "preview" | "commit") {
    if (!rows.length) return;
    setBusy(true); setError(""); setSuccess("");
    try {
      const response = await fetch("/api/products/seo-bulk", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, rows, fingerprint: preview?.fingerprint }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Solicitud rechazada.");
      if (mode === "preview") setPreview(payload as Preview);
      else {
        setSuccess("Actualización realizada: " + payload.updatedCount +
          " fichas; únicamente título SEO y metadescripción.");
        setPreview(null); setRows([]); setFilename("");
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Operación rechazada.");
      if (mode === "commit") setPreview(null);
    } finally { setBusy(false); }
  }

  function confirm() {
    if (!preview?.canCommit || !preview.modifiedCount) return;
    if (window.confirm("¿Publicar los metadatos SEO de " + preview.modifiedCount +
      " fichas? Nunca se cambian productos, precios, imágenes, stock, nombres ni URLs."))
      void execute("commit");
  }

  return (
    <main style={{ margin: "auto", padding: "2rem", maxWidth: 1100, color: "#222" }}>
      <p><a href="/admin/products">← Volver a productos</a></p>
      <h1>DG Audiosound · CSV SEO-only por UUID</h1>
      <p>Máximo 100 fichas por lote. Primero realiza una simulación sin cambios.</p>
      <p style={{ background: "#f9f1df", padding: 16, borderRadius: 8 }}>
        <strong>NO utilices el importador general de productos.</strong> Esta herramienta
        actualiza exclusivamente <strong>título SEO y metadescripción</strong>.
        H1, texto y slugs del CSV son propuestas y se ignoran deliberadamente.
        No modifica nombres, precios, stock, imágenes, categorías ni estatus.
      </p>
      <section style={{ background: "white", padding: 24, border: "1px solid #ddd", borderRadius: 10 }}>
        <label htmlFor="seo-file" style={{ display: "block", fontWeight: 700, marginBottom: 8 }}>
          CSV SEO-only del lote 002
        </label>
        <input id="seo-file" type="file" accept=".csv,text/csv" disabled={busy} onChange={onFile} />
        <p style={{ fontSize: 13, color: "#555" }}>
          Identificación: uuid, baseline_sha256, baseline_updated_at, brand_solo_guard,
          model_solo_guard. SEO: seo_title y seo_meta_description.
          Se exige la marca de control y la aprobación editorial/técnica.
        </p>
        <p>Archivo: <strong>{filename || "Sin archivo"}</strong> — {rows.length} fichas</p>
        <button type="button" onClick={() => void execute("preview")} disabled={busy || !rows.length}
          style={{ padding: 12, color: "white", background: "#252525", border: 0, borderRadius: 6 }}>
          {busy ? "Validando…" : "Simular sin aplicar cambios"}
        </button>
      </section>
      {error && <p role="alert" style={{ color: "#a11" }}>{error}</p>}
      {success && <p role="status" style={{ color: "#166534" }}>{success}</p>}
      {preview && <section style={{ marginTop: 20, padding: 24, background: "white", border: "1px solid #ddd" }}>
        <h2>Vista previa — cero escrituras</h2>
        <p>
          {preview.requestedCount} examinados · {preview.modifiedCount} propuestas de cambio SEO ·
          {preview.blockedCount} bloqueados
        </p>
        {!preview.writeEnabled && <p style={{ color: "#a11" }}>
          Escritura deshabilitada en este entorno.
        </p>}
        <p>Campos que <strong>no</strong> se actualizarán: {preview.ignoredColumns.join(", ")}.</p>
        <div style={{ maxHeight: 360, overflow: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr><th style={{ textAlign: "left" }}>UUID</th>
              <th style={{ textAlign: "left" }}>Bloqueo</th></tr></thead>
            <tbody>{preview.blocked.map(item => <tr key={item.uuid} style={{ borderTop: "1px solid #eee" }}>
              <td style={{ padding: 7, fontSize: 12 }}>{item.uuid}</td>
              <td style={{ padding: 7 }}>{item.reason}</td>
            </tr>)}</tbody>
          </table>
        </div>
        <button type="button" onClick={confirm} disabled={busy || !preview.canCommit || !preview.modifiedCount}
          style={{ padding: 12, marginTop: 16, color: "white", background: preview.canCommit ? "#18653d" : "#888",
            border: 0, borderRadius: 6 }}>
          {preview.canCommit ? "Confirmar y publicar cambios SEO" : "Publicación bloqueada hasta aprobación"}
        </button>
      </section>}
    </main>
  );
}
