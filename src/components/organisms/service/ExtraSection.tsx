import React from "react";
import { RichText } from "@/components/atoms/RichText";
import { BenefitCard } from "@/components/molecules/ServiceCards";
import type { ServicePageContent } from "@/types/service.types";

/** Sección "Qué hacemos" (tarjetas de beneficios) presente solo en algunas páginas. */
export const ExtraSection = ({ extra }: { extra: NonNullable<ServicePageContent["extra"]> }) => (
  <section className="section section-white">
    <div className="container value-prop-lux">
      <span className="eyebrow reveal fade-up">{extra.eyebrow}</span>
      <h2 className="section-title reveal fade-up"><RichText parts={extra.title} /></h2>
      <p className="section-subtitle reveal fade-up"><RichText parts={extra.subtitle} /></p>
    </div>
    <div className="container benefits-corp-grid">
      {extra.items.map((b) => (
        <BenefitCard key={b.title} {...b} />
      ))}
    </div>
  </section>
);
