import React from "react";
import { Icon, WHATSAPP_ICON } from "@/components/atoms/Icon";
import { RichText } from "@/components/atoms/RichText";
import { ProcessStep } from "@/components/molecules/ServiceCards";
import { whatsappUrl } from "@/lib/whatsapp";
import type { HomePageContent } from "@/types/service.types";

export const HomeProcess = ({ data }: { data: HomePageContent["process"] }) => (
  <section className="section section-light-alt how-we-work" id="proceso">
    <div className="container">
      <div className="section-header reveal fade-up">
        <h2 className="section-title"><RichText parts={data.title} /></h2>
        <p className="section-subtitle">{data.subtitle}</p>
      </div>
      <div className="process-bento-grid reveal fade-up">
        {data.steps.map((s, i) => (
          <ProcessStep key={s.title} step={i + 1} {...s} />
        ))}
      </div>
      <div className="process-footer-clean reveal fade-up">
        <p className="process-quote-simple">{data.quote}</p>
        <div className="process-cta">
          <a className="btn btn-whatsapp-large" href={whatsappUrl(data.ctaMessage)} target="_blank" rel="noopener noreferrer">
            <Icon name={WHATSAPP_ICON} /> {data.ctaLabel}
          </a>
        </div>
      </div>
    </div>
  </section>
);
