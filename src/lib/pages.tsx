import React from "react";
import type { Metadata } from "next";
import { HomePageTemplate } from "@/components/templates/HomePageTemplate";
import { LegalPageTemplate } from "@/components/templates/LegalPageTemplate";
import { homeContent, HOME_HERO_KICKERS } from "@/content/pages/home";
import { serviceJsonLd, serviceMetadata } from "@/lib/seo/serviceSeo";
import type { LegalPageContent } from "@/types/service.types";

const jsonLd = (data: unknown) => (
  <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
);

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
