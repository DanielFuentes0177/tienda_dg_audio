import React from "react";
import { Icon } from "@/components/atoms/Icon";
import { RichText } from "@/components/atoms/RichText";
import type { HomePageContent } from "@/types/service.types";

const delay = (ms: number | null) => (ms == null ? undefined : { transitionDelay: `${ms}ms` });

export const HomeAssurance = ({ data }: { data: HomePageContent["assurance"] }) => (
  <section className="section-premium-white">
    <div className="container">
      <div className="process-header reveal fade-up">
        <h2 className="process-title"><RichText parts={data.title} /></h2>
        <p className="process-subtitle">{data.subtitle}</p>
      </div>
      <div className="process-grid">
        {data.cards.map((c) => (
          <div key={c.num} className="process-card reveal fade-up" style={delay(c.delay)}>
            <span aria-hidden="true" className="process-number">{c.num}</span>
            <div className="process-icon-box"><Icon name={c.icon} /></div>
            <h3>{c.title}</h3>
            <p>{c.text}</p>
          </div>
        ))}
      </div>
      <p className="section-closing-text">{data.closing}</p>
    </div>
  </section>
);
