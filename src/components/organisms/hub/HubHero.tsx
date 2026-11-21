import React from "react";
import { Icon } from "@/components/atoms/Icon";
import { RichText } from "@/components/atoms/RichText";
import { cssString } from "@/lib/cssString";
import type { HubPageContent } from "@/types/service.types";

export const HubHero = ({ hero }: { hero: HubPageContent["hero"] }) => (
  <section className="hero-lux" id="inicio">
    <div className="hero-lux-slider">
      {hero.slides.map((src, i) => (
        <div key={src} className={`hero-lux-slide${i === 0 ? " active" : ""}`} style={{ backgroundImage: `url('${src}')` }} />
      ))}
    </div>
    <div className="hero-lux-overlay" />
    <div className="container-lux hero-lux-content">
      <div className="reveal-lux active">
        <span className="lux-kicker">{hero.kicker}</span>
        <h1 className="hero-lux-title"><RichText parts={hero.title} /></h1>
        <p className="hero-lux-subtitle">{hero.subtitle}</p>{" "}
        <a className="btn btn-primary btn-large" href={hero.ctaHref} style={cssString(hero.ctaStyle)}>
          {hero.ctaLabel}
        </a>
        <div className="hero-lux-badges">
          {hero.badges.map((b) => (
            <div key={b.label} className="hero-lux-badge">
              <Icon name={b.icon} />
              <span>{b.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);
