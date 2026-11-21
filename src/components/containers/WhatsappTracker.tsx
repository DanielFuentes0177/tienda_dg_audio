"use client";

import { useEffect } from "react";
import { trackWhatsapp } from "@/lib/trackWhatsapp";

const WA_HOST = /^https?:\/\/(wa\.me|api\.whatsapp\.com|web\.whatsapp\.com)\//i;

const clean = (s: string) => s.toLowerCase().replace(/[^a-z0-9_-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40);

/** Nombre corto del botón: data-wa-source si existe; si no, se deduce de dónde está en la página. */
function sourceOf(a: HTMLAnchorElement): string {
  const explicit = a.dataset.waSource;
  if (explicit) return clean(explicit) || "enlace";
  if (a.closest("footer")) return "pie";
  if (a.closest("nav, header")) return "menu";
  const section = a.closest("section[id], div[id]");
  if (section?.id) return clean(section.id) || "enlace";
  return "enlace";
}

/** Contenedor: cuenta cada clic en un enlace de WhatsApp (no hay API de WhatsApp, así que se mide el clic). */
export function WhatsappTracker() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || !WA_HOST.test(a.href)) return;
      trackWhatsapp(sourceOf(a));
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);
  return null;
}
