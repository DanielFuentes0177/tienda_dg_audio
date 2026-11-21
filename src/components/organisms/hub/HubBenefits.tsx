import React from "react";
import { Icon } from "@/components/atoms/Icon";
import { RichText } from "@/components/atoms/RichText";
import { cssString } from "@/lib/cssString";
import type { HubPageContent } from "@/types/service.types";

export const HubBenefits = ({ benefits }: { benefits: HubPageContent["benefits"] }) => (
  <section className="section-lux-white" id="beneficios">
    <div className="container-lux">
      <div style={{ textAlign: "center", maxWidth: 800, margin: "0 auto 5rem" }}>
        <span className="lux-kicker">{benefits.kicker}</span>
        <h2 className="lux-title" style={{ marginBottom: "1.5rem" }}><RichText parts={benefits.title} /></h2>
        <p style={{ color: "#555560", fontSize: "1.1rem", fontWeight: 300 }}>{benefits.subtitle}</p>
      </div>
      <div className="cards-lux-grid">
        {benefits.cards.map((c) => (
          <div key={c.title} className="card-lux reveal-lux" style={cssString(c.style)}>
            <div>
              <div className="card-lux-icon"><Icon name={c.icon} /></div>
              <h3 className="card-lux-title">{c.title}</h3>
              <p className="card-lux-desc">{c.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);
