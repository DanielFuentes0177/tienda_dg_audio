/**
 * Datos únicos del sitio (fuente de verdad para Navbar, Footer, WhatsApp, analítica).
 * Mantener alineado con el sitio HTML hasta terminar la migración.
 */
export const SITE = {
  name: "DG Audiosound",
  url: "https://www.dgaudiosound.com",
  email: "contacto@dgaudiosound.com",
  phoneDisplay: "+52 55 3727 0177",
  phoneTel: "+525537270177",
  whatsappUrl: "https://wa.me/525537270177",
  whatsappProjectUrl:
    "https://wa.me/525537270177?text=Hola,%20quisiera%20iniciar%20un%20proyecto%20de%20audio%20y%20video",
  location: "Ciudad de México, México",
  social: {
    facebook: "https://www.facebook.com/dgaudiosound",
    instagram: "https://www.instagram.com/dgaudiosound/",
  },
} as const;

export const TRACKING = {
  googleTagManagerId: "GTM-N65F3T7P",
  ga4MeasurementId: "G-H29S551ZJK",
  metaPixelId: "1977566363148263",
  consentStorageKey: "dg_cookie_consent",
} as const;

export interface NavLinkItem {
  label: string;
  href: string;
}

export const NAV_LINKS: NavLinkItem[] = [
  { label: "Inicio", href: "/" },
  { label: "Soluciones", href: "/#soluciones" },
  { label: "Aplicaciones", href: "/#aplicaciones" },
  { label: "Marcas", href: "/#marcas" },
  { label: "Tienda", href: "/tienda" },
  { label: "Blog", href: "/blog" },
  { label: "Contacto", href: "/#contacto" },
];

export const FOOTER_NAV_LINKS: NavLinkItem[] = [
  { label: "Inicio", href: "/" },
  { label: "Soluciones", href: "/#soluciones" },
  { label: "Nuestras Marcas", href: "/#marcas" },
  { label: "Tienda", href: "/tienda" },
  { label: "Blog DG", href: "/blog" },
];

export const FOOTER_SOLUTION_LINKS: NavLinkItem[] = [
  { label: "Residencial Premium", href: "/residencial-premium" },
  { label: "Negocios y Experiencias", href: "/negocios-y-experiencias" },
  { label: "Corporativo e Institucional", href: "/corporativo-e-institucional" },
  { label: "Eventos y Producción", href: "/eventos-y-produccion" },
];

export const FOOTER_LEGAL_LINKS: NavLinkItem[] = [
  { label: "Aviso de Privacidad", href: "/aviso-de-privacidad" },
  { label: "Términos y Condiciones", href: "/terminos-y-condiciones" },
];

export const FOOTER_DESCRIPTION =
  "Diseñamos e integramos soluciones de audio, video e iluminación para hogares, negocios, empresas y producción.";

/**
 * Rutas que sirve esta app Next. TODO lo demás lo sirve (por proxy) el sitio HTML
 * hasta terminar la migración: se enlaza con <a> (navegación completa, sin prefetch
 * de Next). Al migrar una página, añade aquí su prefijo.
 */
export const NEXT_ROUTE_PREFIXES = ["/tienda", "/blog", "/checkout", "/login", "/admin"];

export const isNextRoute = (href: string): boolean => {
  if (!href.startsWith("/") || href.startsWith("//")) return false;
  const path = href.split(/[?#]/)[0];
  return NEXT_ROUTE_PREFIXES.some((p) => path === p || path.startsWith(`${p}/`));
};
