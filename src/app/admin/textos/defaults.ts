import { SERVICES } from "@/content/services";
import { HUBS } from "@/content/hubs";
import { homeContent } from "@/content/pages/home";
import { solucionesContent } from "@/content/pages/soluciones";
import { aplicacionesContent } from "@/content/pages/aplicaciones";

export interface PageEntry {
  path: string;
  label: string;
  group: string;
  title: string;
  description: string;
}

const CONTACT = {
  title: "Contacto | DG Audiosound — Audio y video en CDMX",
  description:
    "Cuéntanos tu proyecto de audio, video o iluminación. Escríbenos por WhatsApp al +52 55 3727 0177 o a contacto@dgaudiosound.com. Atendemos en Ciudad de México y todo el país.",
};

const GROUP_LABEL: Record<string, string> = {
  "residencial-premium": "Residencial Premium",
  "negocios-y-experiencias": "Negocios y Experiencias",
  "corporativo-e-institucional": "Corporativo e Institucional",
  "eventos-y-produccion": "Eventos y Producción",
};

const pretty = (slug: string) => slug.replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase());

/** Todas las páginas editables con su título y descripción originales (los del código). */
export function getPageEntries(): PageEntry[] {
  const out: PageEntry[] = [
    { path: "/", label: "Inicio", group: "Principales", title: homeContent.seo.title, description: homeContent.seo.description },
    { path: "/contacto", label: "Contacto", group: "Principales", ...CONTACT },
    { path: "/soluciones", label: "Soluciones", group: "Principales", title: solucionesContent.seo.title, description: solucionesContent.seo.description },
    { path: "/aplicaciones", label: "Aplicaciones", group: "Principales", title: aplicacionesContent.seo.title, description: aplicacionesContent.seo.description },
  ];
  for (const [path, hub] of Object.entries(HUBS)) {
    const g = path.slice(1);
    out.push({ path, label: `${GROUP_LABEL[g] ?? pretty(g)} (índice)`, group: GROUP_LABEL[g] ?? pretty(g), title: hub.seo.title, description: hub.seo.description });
  }
  for (const [path, svc] of Object.entries(SERVICES)) {
    const [, g, slug] = path.split("/");
    out.push({ path, label: pretty(slug), group: GROUP_LABEL[g] ?? pretty(g), title: svc.seo.title, description: svc.seo.description });
  }
  return out;
}
