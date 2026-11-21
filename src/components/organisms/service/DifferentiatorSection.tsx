import React from "react";
import { RichText } from "@/components/atoms/RichText";
import type { ServicePageContent } from "@/types/service.types";

export const DifferentiatorSection = ({ data }: { data: ServicePageContent["differentiator"] }) => {
  const ticker = [...data.brands.names, ...data.brands.names]; // duplicado para el bucle infinito
  return (
    <section className="section section-white">
      <div className="container split-dark">
        <div className="dark-panel reveal fade-right">
          <span className="eyebrow" style={{ color: "var(--color-primary)" }}>{data.dark.eyebrow}</span>
          <h2><RichText parts={data.dark.title} /></h2>
          {data.dark.paragraphs.map((p, i) => (
            <p key={i} style={i < data.dark.paragraphs.length - 1 ? { marginBottom: "1.5rem" } : undefined}><RichText parts={p} /></p>
          ))}
        </div>
        <div className="gold-panel reveal fade-left">
          <span className="eyebrow">{data.gold.eyebrow}</span>
          <h2><RichText parts={data.gold.title} /></h2>
          <ul className="check-list">
            {data.gold.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
      <div id="marcas" className="container" style={{ textAlign: "center", maxWidth: 800, marginTop: "5rem", marginBottom: "2rem" }}>
        <span className="eyebrow reveal fade-up">{data.brands.eyebrow}</span>
        <h2><RichText parts={data.brands.title} /></h2>
        <p className="section-subtitle reveal fade-up">{data.brands.subtitle}</p>
      </div>
      <div className="brands-ticker-wrapper reveal fade-up">
        <div className="brands-ticker">
          {ticker.map((name, i) => (
            <div key={`${name}-${i}`} className="ticker-item">{name}</div>
          ))}
        </div>
      </div>
    </section>
  );
};
