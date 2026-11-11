import path from "path";

// Carpeta persistente fuera del código desplegado (sobrevive a cada deploy).
export const UPLOAD_DIR =
  process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads");

export function resolveUploadPath(relative: string): string | null {
  const full = path.resolve(UPLOAD_DIR, relative);
  if (full !== UPLOAD_DIR && !full.startsWith(UPLOAD_DIR + path.sep)) return null;
  return full;
}
