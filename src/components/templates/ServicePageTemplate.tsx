import React from "react";
import "@/styles/service-page.css";
import "@/styles/service-page-overrides.css";
import { ServiceHero } from "@/components/organisms/service/ServiceHero";
import { ServiceIntro } from "@/components/organisms/service/ServiceIntro";
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
  const quote = whatsappUrl(content.whatsappMessages.quote);
  const update = whatsappUrl(content.whatsappMessages.update);
  return (
    <div className="svc">
      <noscript>
        <style>{`.svc .reveal, .svc .reveal-lux { opacity: 1 !important; transform: none !important; }`}</style>
      </noscript>
      <div>
        <ServiceHero hero={content.hero} ctaHref={quote} />
        <ServiceIntro intro={content.intro} />
        <ProblemSection problem={content.problem} />
        <IncludesSection includes={content.includes} />
        <AreasSection areas={content.areas} updateHref={update} />
        <ProcessSection process={content.process} ctaHref={quote} />
        <DifferentiatorSection data={content.differentiator} />
        <FaqSection faq={content.faq} />
        <ServiceContactContainer contact={content.contact} whatsappMessage={content.whatsappMessages.quote} />
      </div>
      <ServicePageEffects />
    </div>
  );
};
