import React from "react";
import { Icon } from "@/components/atoms/Icon";
import type { HomePageContent } from "@/types/service.types";

const delay = (ms: number | null) => (ms == null ? undefined : { transitionDelay: `${ms}ms` });

export const HomeWhyUs = ({ data }: { data: HomePageContent["whyUs"] }) => (
  <section className="section section-dark why-us" id="nosotros">
    <div className="container">
      <div className="section-header reveal fade-up">
        <h2 className="section-title">{data.title}</h2>
        <p className="section-subtitle">{data.subtitle}</p>
      </div>
      <div className="why-us-grid">
        {data.cards.map((c) => (
          <div key={c.title} className="why-card reveal fade-up" style={delay(c.delay)}>
            <div className="why-icon"><Icon name={c.icon} /></div>
            <h3>{c.title}</h3>
            <p>{c.text}</p>
          </div>
        ))}
      </div>
      <p className={`section-closing-text ${data.closingClass}`.trim()}>{data.closing}</p>
    </div>
  </section>
);
