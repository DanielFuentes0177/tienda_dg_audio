import type { Metadata } from "next";
import { ContactPageTemplate } from "@/components/templates/ContactPageTemplate";
import { homeContent } from "@/content/pages/home";
import { SITE } from "@/content/site";
import { serviceMetadata } from "@/lib/seo/serviceSeo";
import { withPageTexts } from "@/lib/pageTexts";

export const revalidate = 3600;

const TITLE = "Contacto | DG Audiosound — Audio y video en CDMX";
const DESCRIPTION =
  "Cuéntanos tu proyecto de audio, video o iluminación por WhatsApp (+52 55 3727 0177) o en contacto@dgaudiosound.com. Atendemos en CDMX y todo el país.";

export const generateMetadata = (): Promise<Metadata> => withPageTexts("/contacto", serviceMetadata({
  path: "/contacto",
  seo: { ...homeContent.seo, title: TITLE, description: DESCRIPTION, ogTitle: TITLE, ogDescription: DESCRIPTION, verification: undefined },
}));

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LocalBusiness",
      "@id": `${SITE.url}/#localbusiness`,
      name: SITE.name,
      url: `${SITE.url}/`,
      image: `${SITE.url}/assets/dg_logo.webp`,
      telephone: SITE.phoneTel,
      email: SITE.email,
      address: { "@type": "PostalAddress", addressLocality: "Ciudad de México", addressCountry: "MX" },
      areaServed: { "@type": "Country", name: "México" },
      sameAs: [SITE.social.facebook, SITE.social.instagram],
    },
    {
      "@type": "ContactPage",
      "@id": `${SITE.url}/contacto#webpage`,
      url: `${SITE.url}/contacto`,
      name: TITLE,
      about: { "@id": `${SITE.url}/#localbusiness` },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE.url}/` },
        { "@type": "ListItem", position: 2, name: "Contacto", item: `${SITE.url}/contacto` },
      ],
    },
  ],
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ContactPageTemplate
        title="Contacto"
        intro="Platícanos tu proyecto y te respondemos por WhatsApp o correo."
        contact={homeContent.contact}
      />
    </>
  );
}
