export interface PageSeo {
  title: string;
  description: string;
  ogImage: string;
  ogImageAlt: string;
  ogTitle?: string;
  ogDescription?: string;
  robots?: string;
  /** Verificación de Google Search Console (meta google-site-verification). */
  verification?: string;
}

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
  seo: PageSeo;
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

/* ------------------------------------------------------------------ */
/* Páginas HUB (índice de cada grupo: /residencial-premium, etc.)      */
/* ------------------------------------------------------------------ */

export interface HubImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface HubPageContent {
  path: string;
  seo: PageSeo;
  breadcrumbs: { name: string; href: string }[];
  jsonLd: Record<string, unknown>[];
  floatMessage: string;
  hero: {
    slides: string[];
    kicker: string;
    title: InlinePart[];
    subtitle: string;
    ctaLabel: string;
    ctaHref: string;
    ctaStyle: string;
    badges: { icon: string | null; label: string }[];
  };
  problem: {
    kicker: string;
    title: Inline;
    lead: Inline;
    leadStyle: string;
    body: Inline | null;
    bodyStyle: string;
    cards: (IconCard & { iconStyle: string })[];
    cardsStyle: string;
    cardsReveal: boolean;
    /** true: texto e imagen lado a lado (negocios). */
    sideLayout: boolean;
    image: { src: string; alt: string; style: string; width: number; height: number } | null;
    imageWrapStyle: string;
  };
  showcase: {
    kicker: string;
    kickerStyle: string;
    slides: string[];
    linkLabel: string;
    navLabels: string[];
    /** Contenido del panel tal como viene en el HTML (la primera vez); después se usa `systems`, como en el JS original. */
    initial: { title: Inline; desc: string; specs: string[]; link: string };
    systems: { title: Inline; desc: string; specs: string[]; link: string }[];
  };
  blueprint: {
    kicker: string;
    title: Inline;
    lead: Inline;
    image: { src: string; alt: string; width: number; height: number };
    hotspots: { key: string; spot: string; label: string }[];
    panelHeader: string;
    initial: BlueprintEntry;
    entries: Record<string, BlueprintEntry & { header: string }>;
  };
  benefits: { kicker: string; title: Inline; subtitle: string; cards: { icon: string | null; title: string; text: string; style: string }[] };
  process: {
    kicker: string;
    title: Inline;
    subtitle: string;
    steps: (IconCard & { num: string })[];
    quote: string;
    ctaLabel: string;
    ctaMessage: string;
    ctaStyle: string;
  };
  gateway: {
    kicker: string;
    title: Inline;
    lead: Inline;
    cards: { src: string; alt: string; title: string; text: string; href: string; linkLabel: string; style: string; width: number; height: number }[];
  };
  brands: { kicker: string; title: Inline; titleStyle: string; subtitle: string; names: string[]; sectionStyle: string };
  faq: { kicker: string; title: Inline; items: { question: string; answer: string }[] };
  contact: {
    title: InlinePart[];
    subtitle: string;
    badge: string;
    panelTitle: InlinePart[];
    panelText: string;
    methods: { icon: string | null; label: string; detail: string; href: string }[];
    formTitle: string;
    formDescription: string;
    labels: Record<string, string>;
    placeholders: Record<string, string>;
    required: Record<string, boolean>;
    selectPlaceholder: string;
    projectTypes: { value: string; label: string }[];
    submitLabel: string;
    privacyNote: Inline;
    /** Mensaje de WhatsApp con {name} {company} {phone} {city} {project} {message}. */
    whatsappTemplate: string;
  };
}

export interface BlueprintEntry {
  title: Inline;
  desc: string;
  tech1Title: string;
  tech1Desc: string;
  tech2Title: string;
  tech2Desc: string;
}


/* ------------------------------------------------------------------ */
/* HOME                                                                */
/* ------------------------------------------------------------------ */

export interface HomeCta {
  label: string;
  href: string;
  variant: "btn-primary" | "btn-secondary";
}

export interface HomePageContent {
  path: string;
  seo: PageSeo;
  jsonLd: Record<string, unknown>[];
  hero: {
    kicker: string;
    kickerStyle: string;
    title: InlinePart[];
    subtitle: string;
    slides: { bgClass: string }[];
    specialties: { icon: string | null; label: string; href: string }[];
    buttons: (HomeCta & { style: string })[];
    subtext: string;
    subtextStyle: string;
  };
  trust: { icon: string | null; title: string; text: string }[];
  advice: { badge: string; title: Inline; subtitle: string; cards: { title: Inline; text: string; delay: number | null }[]; footer: string };
  assurance: {
    title: Inline;
    subtitle: string;
    cards: { num: string; icon: string | null; title: string; text: string; delay: number | null }[];
    closing: string;
  };
  solutions: {
    title: string;
    subtitle: string;
    cards: {
      delay: number | null;
      img: { src: string; alt: string; width: number; height: number };
      overlayTitle: string;
      tags: string[];
      icon: string | null;
      title: string;
      desc: string;
      linkLabel: string;
      href: string;
    }[];
    closing: string;
  };
  applications: {
    title: string;
    subtitle: string;
    categories: { icon: string | null; name: string; intro: string; items: { href: string; icon: string | null; title: string; desc: string }[] }[];
    footerText: string;
    ctas: HomeCta[];
  };
  process: {
    title: Inline;
    subtitle: string;
    steps: { num: string; icon: string | null; title: string; text: string }[];
    quote: string;
    ctaLabel: string;
    ctaMessage: string;
  };
  whyUs: {
    title: string;
    subtitle: string;
    cards: { icon: string | null; title: string; text: string; delay: number | null }[];
    closing: string;
    closingClass: string;
  };
  brands: { title: Inline; subtitle: string; names: string[]; closing: string };
  faq: { title: string; items: { question: string; answer: string }[] };
  contact: {
    title: InlinePart[];
    titleStyle: string;
    sectionStyle: string;
    subtitle: string;
    badge: string;
    panelTitle: InlinePart[];
    panelText: string;
    methods: { icon: string | null; label: string; detail: string; href: string }[];
    formTitle: string;
    formDescription: string;
    labels: Record<string, string>;
    placeholders: Record<string, string>;
    required: Record<string, boolean>;
    selectPlaceholder: string;
    selectPlaceholderDisabled: boolean;
    projectTypes: { value: string; label: string }[];
    submitLabel: string;
    privacyNote: Inline;
    whatsappTemplate: string;
  };
}

/* ------------------------------------------------------------------ */
/* LEGAL (aviso de privacidad, términos y condiciones)                 */
/* ------------------------------------------------------------------ */

export type LegalBlock = { type: "p"; text: Inline } | { type: "ul"; items: Inline[] };

export interface LegalPageContent {
  path: string;
  seo: PageSeo;
  jsonLd: Record<string, unknown>[];
  title: string;
  updated: string;
  indexTitle: string;
  index: { href: string; label: string }[];
  sections: { id: string; title: string; blocks: LegalBlock[] }[];
}
