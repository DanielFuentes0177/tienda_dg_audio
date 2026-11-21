import type { Metadata } from "next";
import { ServicePageTemplate } from "@/components/templates/ServicePageTemplate";
import { cineEnCasa } from "@/content/services/cine-en-casa";
import { serviceJsonLd, serviceMetadata } from "@/lib/seo/serviceSeo";

// Acota el s-maxage de la página estática (por defecto 1 año) para que un CDN no sirva versiones viejas tras un deploy.
export const revalidate = 3600;

export const metadata: Metadata = serviceMetadata(cineEnCasa);

export default function CineEnCasaPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd(cineEnCasa)) }} />
      <ServicePageTemplate content={cineEnCasa} />
    </>
  );
}
