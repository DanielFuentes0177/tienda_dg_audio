import React from "react";
import { AppLink } from "@/components/atoms/AppLink";
import { cssString } from "@/lib/cssString";
import type { CtaBannerContent } from "@/types/service.types";

/** Banner final con título, subtítulo y un botón (páginas /soluciones y /aplicaciones). */
export const CtaBanner = ({ cta }: { cta: CtaBannerContent }) => (
  <section className={cta.sectionClass} style={cssString(cta.sectionStyle)}>
    <div className="container">
      <h2 className={cta.titleClass}>{cta.title}</h2>
      <p className={cta.subtitleClass}>{cta.subtitle}</p>
      <div style={cssString(cta.btnWrapStyle)}>
        <AppLink className={cta.btnClass} href={cta.ctaHref}>{cta.ctaLabel}</AppLink>
      </div>
    </div>
  </section>
);
