import type { Metadata } from "next";
import { SITE } from "@/content/site";
import type { ServicePageContent } from "@/types/service.types";

/** Metadata (title, description, canonical, OG, Twitter) de una página de servicio. */
export function serviceMetadata(c: ServicePageContent): Metadata {
  const url = `${SITE.url}${c.path}`;
  const image = `${SITE.url}${c.seo.ogImage}`;
  return {
    title: { absolute: c.seo.title },
    description: c.seo.description,
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      locale: "es_MX",
      siteName: SITE.name,
      title: c.seo.title,
      description: c.seo.description,
      url,
      images: [{ url: image, alt: c.seo.ogImageAlt }],
    },
    twitter: { card: "summary_large_image", title: c.seo.title, description: c.seo.description, images: [image] },
  };
}

const plain = (v: unknown): string =>
  typeof v === "string" ? v : Array.isArray(v) ? v.map((p) => (p as { text: string }).text).join("") : "";

/**
 * JSON-LD: conserva el grafo original de la página y añade BreadcrumbList / FAQPage
 * cuando faltan (el FAQ es visible en la página, así que es válido).
 */
export function serviceJsonLd(c: ServicePageContent) {
  const url = `${SITE.url}${c.path}`;
  const graph = [...c.jsonLd];
  const has = (type: string) => graph.some((g) => g["@type"] === type);

  if (!has("BreadcrumbList") && c.breadcrumbs.length > 0) {
    graph.push({
      "@type": "BreadcrumbList",
      itemListElement: c.breadcrumbs.map((b, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: b.name,
        item: `${SITE.url}${b.href}`,
      })),
    });
  }
  if (!has("FAQPage") && c.faq.items.length > 0) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      mainEntity: c.faq.items.map((f) => ({
        "@type": "Question",
        name: plain(f.question),
        acceptedAnswer: { "@type": "Answer", text: plain(f.answer) },
      })),
    });
  }
  return { "@context": "https://schema.org", "@graph": graph };
}
