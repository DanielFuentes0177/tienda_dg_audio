import React from "react";
import "@/styles/service-page.css";
import "@/styles/service-page-overrides.css";
import { ServiceHero } from "@/components/organisms/service/ServiceHero";
import { ServiceIntro } from "@/components/organisms/service/ServiceIntro";
import { ExtraSection } from "@/components/organisms/service/ExtraSection";
import { ProblemSection } from "@/components/organisms/service/ProblemSection";
import { IncludesSection } from "@/components/organisms/service/IncludesSection";
import { AreasSection } from "@/components/organisms/service/AreasSection";
import { ProcessSection } from "@/components/organisms/service/ProcessSection";
import { DifferentiatorSection } from "@/components/organisms/service/DifferentiatorSection";
import { FaqSection } from "@/components/organisms/service/FaqSection";
import { ServiceContactContainer } from "@/components/containers/ServiceContactContainer";
import { ServicePageEffects } from "@/components/containers/ServicePageEffects";
import { whatsappUrl } from "@/lib/whatsapp";
import type { ServicePageContent } from "@/types/service.types";

/** Template (sin datos propios): compone la página de servicio a partir del contenido tipado. */
export const ServicePageTemplate = ({ content }: { content: ServicePageContent }) => {
  const quote = whatsappUrl(content.hero.ctaMessage);
  const update = whatsappUrl(content.areas.banner?.ctaMessage ?? content.hero.ctaMessage);
  const process = whatsappUrl(content.process.ctaMessage);
  return (
    <div className="svc">
      {/* Font Awesome (mismo set de íconos del sitio HTML); React 19 la eleva al <head> */}
      <link rel="stylesheet" href="/assets/font-awesome.min.css" precedence="default" />
      <noscript>
        <style>{`.svc .reveal, .svc .reveal-lux { opacity: 1 !important; transform: none !important; }`}</style>
      </noscript>
      <div>
        <ServiceHero hero={content.hero} ctaHref={quote} />
        <ServiceIntro intro={content.intro} />
        <ProblemSection problem={content.problem} />
        {content.extra && <ExtraSection extra={content.extra} />}
        <IncludesSection includes={content.includes} />
        <AreasSection areas={content.areas} updateHref={update} />
        <ProcessSection process={content.process} ctaHref={process} />
        <DifferentiatorSection data={content.differentiator} />
        <FaqSection faq={content.faq} />
        <ServiceContactContainer contact={content.contact} whatsappMessage={content.hero.ctaMessage} />
      </div>
      <ServicePageEffects />
    </div>
  );
};
