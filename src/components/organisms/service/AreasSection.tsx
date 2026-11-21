import React from "react";
import Image from "next/image";
import { Icon, WHATSAPP_ICON } from "@/components/atoms/Icon";
import { RichText } from "@/components/atoms/RichText";
import { AreaCard } from "@/components/molecules/ServiceCards";
import type { ServicePageContent } from "@/types/service.types";

type Banner = NonNullable<ServicePageContent["areas"]["banner"]>;

const AreasBanner = ({ banner, href }: { banner: Banner; href: string }) => (
  <div className="container">
    <div className="event-banner reveal fade-up">
      <div className="event-img">
        <Image src={banner.image.src} alt={banner.image.alt} width={banner.image.width} height={banner.image.height} />
      </div>
      <div className="event-content">
        <span className="eyebrow" style={{ color: "var(--color-primary-hover)" }}>{banner.eyebrow}</span>
        <h2 style={{ fontSize: "2rem", marginBottom: "1.5rem", lineHeight: 1.2 }}><RichText parts={banner.title} /></h2>
        <p>{banner.text}</p>
        {banner.ctaLabel && (
          <a className="btn btn-primary btn-large" href={href} target="_blank" rel="noopener noreferrer">
            <Icon name={WHATSAPP_ICON} /> {banner.ctaLabel}
          </a>
        )}
      </div>
    </div>
  </div>
);

export const AreasSection = ({ areas, updateHref }: { areas: ServicePageContent["areas"]; updateHref: string }) => (
  <section className="section section-white">
    <div className="container" style={{ textAlign: "center", maxWidth: 800, marginBottom: "3.5rem" }}>
      <span className="eyebrow reveal fade-up">{areas.eyebrow}</span>
      <h2 className="section-title reveal fade-up"><RichText parts={areas.title} /></h2>
      <p className="section-subtitle reveal fade-up"><RichText parts={areas.subtitle} /></p>
    </div>
    <div className="container area-grid">
      {areas.items.map((a) => (
        <AreaCard key={a.label} {...a} />
      ))}
    </div>
    {areas.banner && <AreasBanner banner={areas.banner} href={updateHref} />}
  </section>
);
