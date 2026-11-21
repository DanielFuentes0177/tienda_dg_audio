export type IconName =
  | "award" | "sliders" | "volume-off" | "display" | "lightbulb" | "alert"
  | "clipboard" | "mic" | "video" | "couch" | "wrench" | "headset"
  | "search-chart" | "ruler" | "file" | "user-check" | "whatsapp" | "mail" | "pin";

/** Texto con partes resaltadas en dorado (accent). */
export interface TextPart {
  text: string;
  accent?: boolean;
}

export interface ServiceImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface IconCard {
  icon: IconName;
  title: string;
  text: string;
}

export interface ServicePageContent {
  path: string; // "/residencial-premium/cine-en-casa"
  seo: { title: string; description: string; ogImage: string; ogImageAlt: string };
  schema: { name: string; serviceType: string; category: string; areaServed: string; description: string };
  breadcrumbs: { name: string; href: string }[];
  /** Texto base de WhatsApp para los botones de la página */
  whatsappMessages: { quote: string; update: string };
  hero: { kicker: string; title: TextPart[]; paragraphs: string[]; image: string; ctaLabel: string };
  intro: {
    eyebrow: string;
    title: TextPart[];
    paragraphs: string[];
    image: ServiceImage;
    benefits: IconCard[];
  };
  problem: { eyebrow: string; title: string; paragraphs: string[]; cards: IconCard[] };
  includes: {
    eyebrow: string;
    title: string;
    subtitle: string;
    related: { label: string; href: string };
    items: IconCard[];
  };
  areas: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: { image: ServiceImage; label: string }[];
    banner: { image: ServiceImage; eyebrow: string; title: string; text: string; ctaLabel: string };
  };
  process: {
    eyebrow: string;
    title: string;
    subtitle: string;
    steps: IconCard[];
    quote: string;
    ctaLabel: string;
  };
  differentiator: {
    dark: { eyebrow: string; title: string; paragraphs: string[] };
    gold: { eyebrow: string; title: string; items: string[] };
    brands: { eyebrow: string; title: TextPart[]; subtitle: string; names: string[] };
  };
  faq: { eyebrow: string; title: string; subtitle: string; items: { question: string; answer: string }[] };
  contact: {
    title: TextPart[];
    subtitle: string;
    panelTitle: TextPart[];
    panelText: string;
    whatsappDetail: string;
    coverage: string;
    formTitle: string;
    formDescription: string;
    projectFieldLabel: string;
    projectFieldPlaceholder: string;
    projectTypes: string[];
    messagePlaceholder: string;
    submitLabel: string;
    pageHeading: string;
  };
}
