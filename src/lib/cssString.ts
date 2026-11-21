import type React from "react";

/** "padding: 18px; font-family: var(--x)" -> objeto style de React (para estilos en línea heredados del HTML). */
export function cssString(css: string | undefined | null): React.CSSProperties | undefined {
  if (!css) return undefined;
  const out: Record<string, string> = {};
  for (const decl of css.split(";")) {
    const i = decl.indexOf(":");
    if (i < 0) continue;
    const prop = decl.slice(0, i).trim();
    const value = decl.slice(i + 1).trim();
    if (!prop || !value) continue;
    const key = prop.startsWith("--") ? prop : prop.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
    out[key] = value;
  }
  return out as React.CSSProperties;
}
