import React from "react";
import { Icon, WHATSAPP_ICON } from "@/components/atoms/Icon";
import { RichText } from "@/components/atoms/RichText";
import { ProcessStep } from "@/components/molecules/ServiceCards";
import type { ServicePageContent } from "@/types/service.types";

export const ProcessSection = ({ process, ctaHref }: { process: ServicePageContent["process"]; ctaHref: string }) => (
  <section className="section section-light-alt how-we-work" id="proceso">
    <div className="container">
      <div className="section-header reveal fade-up" style={{ textAlign: "center", maxWidth: 800, margin: "0 auto 5rem" }}>
        <span className="eyebrow">{process.eyebrow}</span>
        <h2 className="section-title"><RichText parts={process.title} /></h2>
        <p className="section-subtitle"><RichText parts={process.subtitle} /></p>
      </div>
      <div className="process-bento-grid reveal fade-up">
        {process.steps.map((s, i) => (
          <ProcessStep key={s.title} step={i + 1} {...s} />
        ))}
      </div>
      <div className="process-footer-clean reveal fade-up" style={{ textAlign: "center", marginTop: "5rem" }}>
        <p className="process-quote-simple">{process.quote}</p>
        <div className="process-cta">
          <a
            className="btn btn-whatsapp-large"
            href={ctaHref}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: "var(--color-whatsapp)", color: "var(--text-inverse)", padding: "1rem 2rem", borderRadius: 50,
              textDecoration: "none", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 10,
              boxShadow: "0 10px 20px rgba(37,211,102,0.15)", transition: "all 0.3s ease",
            }}
          >
            <Icon name={WHATSAPP_ICON} style={{ fontSize: "1.3rem" }} /> {process.ctaLabel}
          </a>
        </div>
      </div>
    </div>
  </section>
);
