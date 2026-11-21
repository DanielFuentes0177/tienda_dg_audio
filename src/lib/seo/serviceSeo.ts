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

/** JSON-LD: Service + BreadcrumbList + FAQPage (el FAQ es visible en la página). */
export function serviceJsonLd(c: ServicePageContent) {
  const url = `${SITE.url}${c.path}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: c.schema.name,
        serviceType: c.schema.serviceType,
        category: c.schema.category,
        url,
        areaServed: c.schema.areaServed,
        provider: { "@type": "Organization", name: SITE.name, url: `${SITE.url}/`, telephone: SITE.phoneDisplay },
        description: c.schema.description,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: c.breadcrumbs.map((b, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: b.name,
          item: `${SITE.url}${b.href}`,
        })),
      },
      {
        "@type": "FAQPage",
        mainEntity: c.faq.items.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      },
    ],
  };
}
