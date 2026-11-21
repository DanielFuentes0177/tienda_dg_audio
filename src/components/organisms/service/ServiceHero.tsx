import React from "react";
import { Icon } from "@/components/atoms/Icon";
import { RichText } from "@/components/atoms/RichText";
import type { ServicePageContent } from "@/types/service.types";

export const ServiceHero = ({ hero, ctaHref }: { hero: ServicePageContent["hero"]; ctaHref: string }) => (
  <section className="corp-hero-v2" id="inicio">
    <div className="hero-slider">
      <div className="slide active" style={{ backgroundImage: `url('${hero.image}')` }} />
    </div>
    <div className="corp-hero-overlay" />
    <div className="container">
      <div className="reveal active">
        <span className="hero-kicker">{hero.kicker}</span>
        <h1><RichText parts={hero.title} /></h1>
        <p className="hero-subtitle">
          {hero.paragraphs.map((p, i) => (
            <React.Fragment key={i}>
              {i > 0 && (<><br /><br /></>)}
              {p}
            </React.Fragment>
          ))}
        </p>
        <a className="btn btn-primary btn-large" href={ctaHref} target="_blank" rel="noopener noreferrer">
          <Icon name="whatsapp" /> {hero.ctaLabel}
        </a>
      </div>
    </div>
  </section>
);
