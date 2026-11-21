import React from "react";
import { RichText } from "@/components/atoms/RichText";
import type { HomePageContent } from "@/types/service.types";

export const HomeBrands = ({ data }: { data: HomePageContent["brands"] }) => (
  <section className="section section-light-alt brands" id="marcas">
    <div className="container">
      <div className="section-header reveal fade-up">
        <h2 className="section-title"><RichText parts={data.title} /></h2>
        <p className="section-subtitle">{data.subtitle}</p>
      </div>
      <div className="brands-ticker-wrapper reveal fade-up">
        <div className="brands-ticker">
          {data.names.map((n, i) => (
            <div key={`${n}-${i}`} className="ticker-item">{n}</div>
          ))}
        </div>
      </div>
      <p className="section-closing-text">{data.closing}</p>
    </div>
  </section>
);
