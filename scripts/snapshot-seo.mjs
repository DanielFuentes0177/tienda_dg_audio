#!/usr/bin/env node
// Línea base SEO de las URLs del sitemap (o de una lista).
// Uso:
//   node scripts/snapshot-seo.mjs snapshot [salida.json]      -> guarda la foto
//   node scripts/snapshot-seo.mjs diff antes.json despues.json -> compara dos fotos
//   Variables: BASE (por defecto https://www.dgaudiosound.com)
import { readFile, writeFile } from "node:fs/promises";

const BASE = process.env.BASE || "https://www.dgaudiosound.com";
const SITEMAPS = ["sitemap-pages.xml", "sitemap-blog.xml"]; // la tienda (2.100 fichas) se muestrea aparte
const UA = "dg-seo-snapshot/1.0";

const decode = (s) => s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'");
const pick = (html, re) => (re.exec(html)?.[1] ?? "").trim();

async function urlsFrom(path) {
  const xml = await (await fetch(`${BASE}/${path}`, { headers: { "user-agent": UA } })).text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

async function inspect(url) {
  // El proxy hacia estatico devuelve a veces 200 con cuerpo vacío: reintentar y contarlo.
  let res, html = "", emptyBodies = 0;
  for (let i = 0; i < 4; i++) {
    res = await fetch(url, { redirect: "manual", headers: { "user-agent": UA } });
    html = res.status === 200 ? await res.text() : "";
    if (res.status !== 200 || html.length > 0) break;
    emptyBodies++;
  }
  const ld = [...html.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  const types = new Set();
  for (const block of ld) for (const t of block.matchAll(/"@type"\s*:\s*"([A-Za-z]+)"/g)) types.add(t[1]);
  const text = html.replace(/<(script|style)[\s\S]*?<\/\1>/g, " ").replace(/<[^>]+>/g, " ");
  return {
    url,
    status: res.status,
    emptyBodies,
    location: res.headers.get("location") || "",
    title: decode(pick(html, /<title[^>]*>([^<]*)<\/title>/i)),
    description: decode(pick(html, /<meta[^>]+name="description"[^>]*content="([^"]*)"/i) || pick(html, /<meta[^>]+content="([^"]*)"[^>]+name="description"/i)),
    canonical: pick(html, /<link[^>]+rel="canonical"[^>]*href="([^"]*)"/i) || pick(html, /<link[^>]+href="([^"]*)"[^>]+rel="canonical"/i),
    robots: pick(html, /<meta[^>]+name="robots"[^>]*content="([^"]*)"/i),
    h1: (html.match(/<h1[\s>]/g) || []).length,
    jsonLdTypes: [...types].sort(),
    words: text.split(/\s+/).filter(Boolean).length,
    internalLinks: (html.match(/href="(\/[^"#]*|https:\/\/www\.dgaudiosound\.com[^"#]*)"/g) || []).length,
  };
}

async function snapshot(out) {
  const urls = [...new Set((await Promise.all(SITEMAPS.map(urlsFrom))).flat())];
  const extra = [`${BASE}/`, `${BASE}/aviso-de-privacidad`, `${BASE}/terminos-y-condiciones`, `${BASE}/soluciones`, `${BASE}/aplicaciones`, `${BASE}/contacto`];
  const all = [...new Set([...urls, ...extra])];
  const rows = [];
  for (const u of all) rows.push(await inspect(u));
  const data = { base: BASE, takenAt: new Date().toISOString(), rows };
  await writeFile(out, JSON.stringify(data, null, 2));
  const bad = rows.filter((r) => r.status !== 200);
  const empties = rows.filter((r) => r.emptyBodies > 0);
  console.log(`${rows.length} URLs guardadas en ${out}. No-200: ${bad.length}. Con respuesta vacía alguna vez: ${empties.length}`);
  for (const r of empties) console.log(`  vacío x${r.emptyBodies} ${r.url}`);
  for (const r of bad) console.log(`  ${r.status} ${r.url} ${r.location}`);
}

async function diff(a, b) {
  const A = JSON.parse(await readFile(a, "utf8")), B = JSON.parse(await readFile(b, "utf8"));
  const mapA = new Map(A.rows.map((r) => [r.url, r]));
  const fields = ["status", "title", "description", "canonical", "robots", "h1", "jsonLdTypes"];
  let changes = 0;
  for (const r of B.rows) {
    const o = mapA.get(r.url);
    if (!o) { console.log(`+ NUEVA ${r.url}`); changes++; continue; }
    for (const f of fields) {
      if (JSON.stringify(o[f]) !== JSON.stringify(r[f])) { console.log(`~ ${r.url}\n    ${f}: ${JSON.stringify(o[f])} -> ${JSON.stringify(r[f])}`); changes++; }
    }
    if (o.words && Math.abs(r.words - o.words) / o.words > 0.25) { console.log(`~ ${r.url}\n    words: ${o.words} -> ${r.words}`); changes++; }
  }
  for (const u of mapA.keys()) if (!B.rows.find((r) => r.url === u)) { console.log(`- FALTA ${u}`); changes++; }
  console.log(changes ? `${changes} diferencias.` : "Sin diferencias.");
  process.exitCode = changes ? 1 : 0;
}

const [cmd, ...args] = process.argv.slice(2);
if (cmd === "snapshot") await snapshot(args[0] || "seo-snapshot.json");
else if (cmd === "diff" && args.length === 2) await diff(args[0], args[1]);
else console.log("Uso: snapshot [salida.json] | diff antes.json despues.json");
