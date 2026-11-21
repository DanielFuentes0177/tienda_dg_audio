import React from "react";
import { Icon } from "@/components/atoms/Icon";
import { RichText } from "@/components/atoms/RichText";
import type { ServicePageContent } from "@/types/service.types";

export const ServiceHero = ({ hero, ctaHref }: { hero: ServicePageContent["hero"]; ctaHref: string }) => (
  <section className="corp-hero-v2" id="inicio">
    <div className="hero-slider">
      {hero.slides.map((src, i) => (
        <div key={src} className={`slide${i === 0 ? " active" : ""}`} style={{ backgroundImage: `url('${src}')` }} />
      ))}
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
          <Icon name={hero.ctaIcon} /> {hero.ctaLabel}
        </a>
        {hero.badges.length > 0 && (
          <div className="hero-badges">
            {hero.badges.map((b) => (
              <div key={b.label} className="hero-badge-item">
                <Icon name={b.icon} />
                <span>{b.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  </section>
);
