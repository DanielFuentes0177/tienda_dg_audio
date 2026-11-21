import React from "react";
import { RichText } from "@/components/atoms/RichText";
import type { HomePageContent } from "@/types/service.types";

const delay = (ms: number | null) => (ms == null ? undefined : { transitionDelay: `${ms}ms` });

export const HomeAdvice = ({ advice }: { advice: HomePageContent["advice"] }) => (
  <section className="section-dark-premium">
    <div className="container">
      <span className="advice-badge reveal fade-up">{advice.badge}</span>
      <h2 className="advice-title reveal fade-up"><RichText parts={advice.title} /></h2>
      <p className="advice-subtitle reveal fade-up">{advice.subtitle}</p>
      <div className="advice-grid">
        {advice.cards.map((c, i) => (
          <div key={i} className="advice-card reveal fade-up" style={delay(c.delay)}>
            <h3><RichText parts={c.title} /></h3>
            <p>{c.text}</p>
          </div>
        ))}
      </div>
      <p className="advice-footer-text reveal fade-up">{advice.footer}</p>
    </div>
  </section>
);
