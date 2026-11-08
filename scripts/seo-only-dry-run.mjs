#!/usr/bin/env node
// Dry-run local. No DB connection, HTTP request, product writes or artifact writes.
import fs from "node:fs";
import { parseSeoOnlyRows, inspectSeoOnlyRows } from "../src/lib/seo/seoOnlyRules.mjs";
function parseCsv(source) {
  const text = source.replace(/^\uFEFF/, "");
  const records = []; let row = [], cell = "", quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"') { if (quoted && text[i + 1] === '"') { cell += '"'; i++; } else quoted = !quoted; }
    else if (c === "," && !quoted) { row.push(cell); cell = ""; }
    else if ((c === "\r" || c === "\n") && !quoted) {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(cell); records.push(row); row = []; cell = "";
    } else cell += c;
  }
  if (quoted) throw Error("CSV con comillas sin cerrar.");
  if (cell || row.length) { row.push(cell); records.push(row); }
  const [headers, ...data] = records.filter(r => r.some(v => v));
  if (!headers) throw Error("CSV vacío.");
  return data.map(r => {
    if (r.length !== headers.length) throw Error("CSV con columnas inconsistentes.");
    return Object.fromEntries(headers.map((h, i) => [h, r[i]]));
  });
}
const [csvFile, jsonFile] = process.argv.slice(2);
if (!csvFile || !jsonFile) {
  console.error("Uso: node scripts/seo-only-dry-run.mjs lote.csv products.json");
  process.exitCode = 2;
} else {
  const products = JSON.parse(fs.readFileSync(jsonFile, "utf8"));
  const original = JSON.stringify(products);
  const rows = parseSeoOnlyRows(parseCsv(fs.readFileSync(csvFile, "utf8")));
  const result = inspectSeoOnlyRows(rows, products);
  if (JSON.stringify(products) !== original) throw Error("ERROR: el dry-run mutó la exportación.");
  console.log(JSON.stringify({
    mode: "DRY_RUN_NO_WRITE", productsInSnapshot: products.length, requested: rows.length,
    uniqueUuids: new Set(rows.map(r => r.uuid)).size,
    proposedMetadataChanges: result.modifiedCount, blocked: result.blockedCount,
    statuses: Object.fromEntries([...new Set(rows.map(r => r.estado_revision))].map(status =>
      [status, rows.filter(r => r.estado_revision === status).length])),
    noDatabaseWrites: true, noFileWrites: true,
    fieldsThatWouldChange: ["seoTitle", "seoDescription"],
    ignoredColumns: result.ignoredColumns,
    fingerprint: result.fingerprint,
  }, null, 2));
  if (result.blockedCount !== rows.length) process.exitCode = 3;
}
