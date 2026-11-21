/** Fragmento de texto con formato: acento dorado, enlace o negrita. "\n" = salto de línea. */
export interface InlinePart {
  text: string;
  accent?: boolean; // .text-accent
  gradient?: boolean; // .text-gradient-gold
  href?: string;
  bold?: boolean;
}
/** Texto simple o con formato. */
export type Inline = string | InlinePart[];

export interface ServiceImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

/** `icon` = clases de Font Awesome tal como están en el sitio HTML (p. ej. "fa-solid fa-award"). */
export interface IconCard {
  icon: string | null;
  title: string;
  text: string;
}

export interface ServicePageContent {
  path: string; // "/residencial-premium/cine-en-casa"
  seo: { title: string; description: string; ogImage: string; ogImageAlt: string };
  breadcrumbs: { name: string; href: string }[];
  /** Grafo JSON-LD original de la página (se conserva tal cual; se completa con FAQPage/BreadcrumbList si faltan). */
  jsonLd: Record<string, unknown>[];
  /** Mensaje del botón flotante de WhatsApp (vacío = genérico). */
  floatMessage: string;
  hero: {
    kicker: string;
    title: InlinePart[];
    paragraphs: string[];
    badges: { icon: string | null; label: string }[];
    slides: string[];
    ctaLabel: string;
    ctaIcon: string | null;
    ctaMessage: string;
  };
  intro: {
    eyebrow: string;
    title: InlinePart[];
    paragraphs: Inline[];
    image: ServiceImage;
    benefits: IconCard[];
  };
  problem: { eyebrow: string; title: Inline; paragraphs: Inline[]; cards: IconCard[] };
  /** Sección opcional "Qué hacemos" con tarjetas (presente en algunas páginas). */
  extra?: { eyebrow: string; title: Inline; subtitle: Inline; items: IconCard[] };
  includes: { eyebrow: string; title: Inline; subtitle: Inline; items: IconCard[] };
  areas: {
    eyebrow: string;
    title: Inline;
    subtitle: Inline;
    items: { image: ServiceImage; label: string }[];
    banner?: { image: ServiceImage; eyebrow: string; title: Inline; text: string; ctaLabel: string; ctaMessage: string };
  };
  process: {
    eyebrow: string;
    title: Inline;
    subtitle: Inline;
    steps: (IconCard & { num?: string })[];
    quote: string; // con sus comillas tal como en el sitio HTML
    ctaLabel: string;
    ctaMessage: string;
  };
  differentiator: {
    dark: { eyebrow: string; title: Inline; paragraphs: Inline[] };
    gold: { eyebrow: string; title: Inline; items: string[] };
    brands: { eyebrow: string; title: InlinePart[]; subtitle: string; names: string[] };
  };
  faq: { eyebrow: string; title: Inline; subtitle: Inline; items: { question: string; answer: string }[] };
  contact: {
    title: InlinePart[];
    subtitle: string;
    badge: string;
    panelTitle: InlinePart[];
    panelText: string;
    methods: { icon: string | null; label: string; detail: string }[];
    formTitle: Inline;
    formDescription: string;
    labels: Record<string, string>;
    placeholders: Record<string, string>;
    required: Record<string, boolean>;
    selectPlaceholder: string;
    projectTypes: { value: string; label: string }[];
    submitLabel: string;
    pageHeading: string;
  };
}
