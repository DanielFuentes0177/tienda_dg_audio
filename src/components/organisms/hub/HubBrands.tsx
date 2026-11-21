import React from "react";
import { RichText } from "@/components/atoms/RichText";
import { cssString } from "@/lib/cssString";
import type { HubPageContent } from "@/types/service.types";

export const HubBrands = ({ brands }: { brands: HubPageContent["brands"] }) => (
  <section className="section-lux-gray brands" id="marcas" style={cssString(brands.sectionStyle)}>
    <div className="container-lux">
      <div style={{ textAlign: "center", maxWidth: 800, margin: "0 auto 3rem" }}>
        <span className="lux-kicker">{brands.kicker}</span>
        <h2 className="lux-title" style={cssString(brands.titleStyle)}><RichText parts={brands.title} /></h2>
        <p className="section-subtitle" style={{ color: "#555560", maxWidth: 700, margin: "1rem auto 0" }}>{brands.subtitle}</p>
      </div>
      <div className="brands-ticker-wrapper reveal-lux">
        <div className="brands-ticker">
          {brands.names.map((n, i) => (
            <div key={`${n}-${i}`} className="ticker-item">{n}</div>
          ))}
        </div>
      </div>
    </div>
  </section>
);
