import React from "react";
import Image from "next/image";
import { Icon } from "@/components/atoms/Icon";
import { AreaCard } from "@/components/molecules/ServiceCards";
import type { ServicePageContent } from "@/types/service.types";

export const AreasSection = ({ areas, updateHref }: { areas: ServicePageContent["areas"]; updateHref: string }) => (
  <section className="section section-white">
    <div className="container" style={{ textAlign: "center", maxWidth: 800, marginBottom: "3.5rem" }}>
      <span className="eyebrow reveal fade-up">{areas.eyebrow}</span>
      <h2 className="section-title reveal fade-up">{areas.title}</h2>
      <p className="section-subtitle reveal fade-up">{areas.subtitle}</p>
    </div>
    <div className="container area-grid">
      {areas.items.map((a) => (
        <AreaCard key={a.label} {...a} />
      ))}
    </div>
    <div className="container">
      <div className="event-banner reveal fade-up">
        <div className="event-img">
          <Image src={areas.banner.image.src} alt={areas.banner.image.alt} width={areas.banner.image.width} height={areas.banner.image.height} />
        </div>
        <div className="event-content">
          <span className="eyebrow" style={{ color: "var(--color-primary-hover)" }}>{areas.banner.eyebrow}</span>
          <h2 style={{ fontSize: "2rem", marginBottom: "1.5rem", lineHeight: 1.2 }}>{areas.banner.title}</h2>
          <p>{areas.banner.text}</p>
          <a className="btn btn-primary btn-large" href={updateHref} target="_blank" rel="noopener noreferrer">
            <Icon name="whatsapp" /> {areas.banner.ctaLabel}
          </a>
        </div>
      </div>
    </div>
  </section>
);
