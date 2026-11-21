import React from "react";
import { Icon, WHATSAPP_ICON } from "@/components/atoms/Icon";
import { RichText } from "@/components/atoms/RichText";
import { ProcessStep } from "@/components/molecules/ServiceCards";
import { cssString } from "@/lib/cssString";
import { whatsappUrl } from "@/lib/whatsapp";
import type { HubPageContent } from "@/types/service.types";

export const HubProcess = ({ process }: { process: HubPageContent["process"] }) => (
  <section className="section-lux-gray how-we-work" id="proceso">
    <div className="container-lux">
      <div style={{ textAlign: "center", maxWidth: 800, margin: "0 auto 5rem" }}>
        <span className="lux-kicker">{process.kicker}</span>
        <h2 className="lux-title"><RichText parts={process.title} /></h2>
        <p className="section-subtitle" style={{ color: "#555560", maxWidth: 700, margin: "1rem auto 0" }}>{process.subtitle}</p>
      </div>
      <div className="process-bento-grid reveal-lux">
        {process.steps.map((s, i) => (
          <ProcessStep key={s.title} step={i + 1} {...s} />
        ))}
      </div>
      <div className="process-footer-clean reveal-lux" style={{ textAlign: "center", marginTop: "5rem" }}>
        <p className="process-quote-simple">{process.quote}</p>
        <div className="process-cta">
          <a
            className="btn btn-whatsapp-large"
            href={whatsappUrl(process.ctaMessage)}
            target="_blank"
            rel="noopener noreferrer"
            style={cssString(process.ctaStyle)}
          >
            <Icon name={WHATSAPP_ICON} style={{ fontSize: "1.3rem" }} /> {process.ctaLabel}
          </a>
        </div>
      </div>
    </div>
  </section>
);
