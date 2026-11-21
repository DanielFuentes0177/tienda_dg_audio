import React from "react";
import "@/styles/service-page.css";
import "@/styles/service-page-overrides.css";
import { CtaBanner } from "@/components/organisms/legacy/CtaBanner";
import { SolutionsDetail } from "@/components/organisms/legacy/SolutionsDetail";
import { ApplicationsGrid } from "@/components/organisms/legacy/ApplicationsGrid";
import { ServicePageEffects } from "@/components/containers/ServicePageEffects";
import { cssString } from "@/lib/cssString";
import type { ApplicationsPageContent, SolutionsPageContent } from "@/types/service.types";

const Shell = ({ mainStyle, children }: { mainStyle: string; children: React.ReactNode }) => (
  <div className="svc">
    <link rel="stylesheet" href="/assets/font-awesome.min.css" precedence="default" />
    <noscript>
      <style>{`.svc .reveal, .svc .reveal-lux { opacity: 1 !important; transform: none !important; }`}</style>
    </noscript>
    <div style={cssString(mainStyle)}>{children}</div>
    <ServicePageEffects />
  </div>
);

/** Template de /soluciones. */
export const SolutionsPageTemplate = ({ content }: { content: SolutionsPageContent }) => (
  <Shell mainStyle={content.mainStyle}>
    <section className="section section-dark" style={cssString(content.hero.sectionStyle)}>
      <div className="container">
        <h1 className="hero-title" style={cssString(content.hero.titleStyle)}>{content.hero.title}</h1>
        <p className="hero-subtitle">{content.hero.subtitle}</p>
      </div>
    </section>
    <SolutionsDetail blocks={content.blocks} />
    <CtaBanner cta={content.cta} />
  </Shell>
);

/** Template de /aplicaciones. */
export const ApplicationsPageTemplate = ({ content }: { content: ApplicationsPageContent }) => (
  <Shell mainStyle={content.mainStyle}>
    <section className={content.hero.sectionClass} style={cssString(content.hero.sectionStyle)}>
      <div className="container">
        <h1 className="hero-title">{content.hero.title}</h1>
        <p className={content.hero.subtitleClass}>{content.hero.subtitle}</p>
      </div>
    </section>
    <ApplicationsGrid data={content} />
    <CtaBanner cta={content.cta} />
  </Shell>
);
