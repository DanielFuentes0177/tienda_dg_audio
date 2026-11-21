import React from "react";
import type { Metadata } from "next";
import { HomePageTemplate } from "@/components/templates/HomePageTemplate";
import { LegalPageTemplate } from "@/components/templates/LegalPageTemplate";
import { ApplicationsPageTemplate, SolutionsPageTemplate } from "@/components/templates/LegacyPagesTemplates";
import { solucionesContent } from "@/content/pages/soluciones";
import { aplicacionesContent } from "@/content/pages/aplicaciones";
import { homeContent, HOME_HERO_KICKERS } from "@/content/pages/home";
import { serviceJsonLd, serviceMetadata } from "@/lib/seo/serviceSeo";
import type { LegalPageContent } from "@/types/service.types";

const jsonLd = (data: { "@graph": unknown[] }) =>
  data["@graph"].length > 0 ? (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  ) : null;

export const homeMeta = (): Metadata => serviceMetadata(homeContent, { hreflang: true });

export function HomePage() {
  return (
    <>
      {jsonLd(serviceJsonLd(homeContent))}
      <HomePageTemplate content={homeContent} kickers={HOME_HERO_KICKERS} />
    </>
  );
}

export const legalMeta = (content: LegalPageContent): Metadata => serviceMetadata(content, { hreflang: true });

export function LegalPage({ content }: { content: LegalPageContent }) {
  return (
    <>
      {jsonLd(serviceJsonLd(content))}
      <LegalPageTemplate content={content} />
    </>
  );
}

export const solucionesMeta = (): Metadata => serviceMetadata(solucionesContent);

export function SolucionesPage() {
  return (
    <>
      {jsonLd(serviceJsonLd(solucionesContent))}
      <SolutionsPageTemplate content={solucionesContent} />
    </>
  );
}

export const aplicacionesMeta = (): Metadata => serviceMetadata(aplicacionesContent);

export function AplicacionesPage() {
  return (
    <>
      {jsonLd(serviceJsonLd(aplicacionesContent))}
      <ApplicationsPageTemplate content={aplicacionesContent} />
    </>
  );
}
