import React from "react";
import { AppLink } from "@/components/atoms/AppLink";
import { IncludeCard } from "@/components/molecules/ServiceCards";
import type { ServicePageContent } from "@/types/service.types";

export const IncludesSection = ({ includes }: { includes: ServicePageContent["includes"] }) => (
  <section className="section section-light-alt" id="incluye">
    <div className="container" style={{ textAlign: "center", maxWidth: 800, marginBottom: "3.5rem" }}>
      <span className="eyebrow reveal fade-up">{includes.eyebrow}</span>
      <h2 className="section-title reveal fade-up">{includes.title}</h2>
      <p className="section-subtitle reveal fade-up">
        {includes.subtitle}{" "}
        <AppLink href={includes.related.href}>{includes.related.label}</AppLink>.
      </p>
    </div>
    <div className="container include-grid">
      {includes.items.map((item) => (
        <IncludeCard key={item.title} {...item} />
      ))}
    </div>
  </section>
);
