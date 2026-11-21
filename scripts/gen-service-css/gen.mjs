import postcss from "postcss";
import prefixer from "postcss-prefix-selector";
import fs from "node:fs";
const src = fs.readFileSync("/Users/kelebra/Documents/Rpm_Code/Dg_audio/styles/bundle.min.css", "utf8")
  .replaceAll("../assets/", "/assets/");
const out = await postcss([
  prefixer({
    prefix: ".svc",
    transform(prefix, selector, prefixed) {
      const s = selector.trim();
      if (s === ":root" || s === "html" || s === "body" || s === "html, body") return prefix;
      if (s === "*" || s.startsWith("*,") || s === "*::before" || s === "*::after") return `${prefix} ${s}`;
      if (s.startsWith("html ") || s.startsWith("body ")) return `${prefix} ${s.replace(/^(html|body)\s+/, "")}`;
      return prefixed;
    },
  }),
]).process(src, { from: undefined });
const header = `/* GENERADO desde el sitio HTML (styles/bundle.min.css) con selectores prefijados por .svc.
   Es CSS heredado: se reemplaza gradualmente por CSS Modules por componente (ver skill atomic-design-nextjs).
   No editar a mano; regenerar con scripts/gen-service-css si el diseño HTML cambia. */\n`;
fs.writeFileSync("service-page.css", header + out.css);
console.log("bytes", out.css.length);
