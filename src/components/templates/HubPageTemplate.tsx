import React from "react";
import "@/styles/service-page.css";
import "@/styles/service-page-overrides.css";
import { HubHero } from "@/components/organisms/hub/HubHero";
import { HubProblem } from "@/components/organisms/hub/HubProblem";
import { HubShowcase } from "@/components/organisms/hub/HubShowcase";
import { HubBlueprint } from "@/components/organisms/hub/HubBlueprint";
import { HubBenefits } from "@/components/organisms/hub/HubBenefits";
import { HubProcess } from "@/components/organisms/hub/HubProcess";
import { HubGateway } from "@/components/organisms/hub/HubGateway";
import { HubBrands } from "@/components/organisms/hub/HubBrands";
import { HubFaq } from "@/components/organisms/hub/HubFaq";
import { HubContact } from "@/components/organisms/hub/HubContact";
import { ServicePageEffects } from "@/components/containers/ServicePageEffects";
import type { HubPageContent } from "@/types/service.types";

/** Template de las páginas hub (índice de cada grupo de soluciones). */
export const HubPageTemplate = ({ content }: { content: HubPageContent }) => (
  <div className="svc">
    <link rel="stylesheet" href="/assets/font-awesome.min.css" precedence="default" />
    <noscript>
      <style>{`.svc .reveal, .svc .reveal-lux { opacity: 1 !important; transform: none !important; }`}</style>
    </noscript>
    <div>
      <HubHero hero={content.hero} />
      <HubProblem problem={content.problem} />
      <HubShowcase showcase={content.showcase} />
      <HubBlueprint blueprint={content.blueprint} />
      <HubBenefits benefits={content.benefits} />
      <HubProcess process={content.process} />
      <HubGateway gateway={content.gateway} />
      <HubBrands brands={content.brands} />
      <HubFaq faq={content.faq} />
      <HubContact contact={content.contact} />
    </div>
    <ServicePageEffects variant="hub" />
  </div>
);
