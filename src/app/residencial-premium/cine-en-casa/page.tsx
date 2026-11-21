import type { Metadata } from "next";
import { ServicePageTemplate } from "@/components/templates/ServicePageTemplate";
import { cineEnCasa } from "@/content/services/cine-en-casa";
import { serviceJsonLd, serviceMetadata } from "@/lib/seo/serviceSeo";

export const metadata: Metadata = serviceMetadata(cineEnCasa);

export default function CineEnCasaPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd(cineEnCasa)) }} />
      <ServicePageTemplate content={cineEnCasa} />
    </>
  );
}
