import React from "react";
import "@/styles/service-page.css";
import "@/styles/service-page-overrides.css";
import { HomeHero } from "@/components/organisms/home/HomeHero";
import { HomeTrustBar } from "@/components/organisms/home/HomeTrustBar";
import { HomeAdvice } from "@/components/organisms/home/HomeAdvice";
import { HomeAssurance } from "@/components/organisms/home/HomeAssurance";
import { HomeSolutions } from "@/components/organisms/home/HomeSolutions";
import { HomeApplications } from "@/components/organisms/home/HomeApplications";
import { HomeProcess } from "@/components/organisms/home/HomeProcess";
import { HomeWhyUs } from "@/components/organisms/home/HomeWhyUs";
import { HomeBrands } from "@/components/organisms/home/HomeBrands";
import { HomeFaq } from "@/components/organisms/home/HomeFaq";
import { HomeContact } from "@/components/organisms/home/HomeContact";
import { ServicePageEffects } from "@/components/containers/ServicePageEffects";
import type { HomePageContent } from "@/types/service.types";

/** Template de la home. */
export const HomePageTemplate = ({ content, kickers }: { content: HomePageContent; kickers: string[] }) => (
  <div className="svc">
    <link rel="stylesheet" href="/assets/font-awesome.min.css" precedence="default" />
    <noscript>
      <style>{`.svc .reveal, .svc .reveal-lux { opacity: 1 !important; transform: none !important; }`}</style>
    </noscript>
    <div>
      <HomeHero hero={content.hero} />
      <HomeTrustBar items={content.trust} />
      <HomeAdvice advice={content.advice} />
      <HomeAssurance data={content.assurance} />
      <HomeSolutions data={content.solutions} />
      <HomeApplications data={content.applications} />
      <HomeProcess data={content.process} />
      <HomeWhyUs data={content.whyUs} />
      <HomeBrands data={content.brands} />
      <HomeFaq faq={content.faq} />
      <HomeContact contact={content.contact} />
    </div>
    <ServicePageEffects variant="home" kickers={kickers} />
  </div>
);
