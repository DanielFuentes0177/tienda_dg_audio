import React from "react";
import { AppLink } from "@/components/atoms/AppLink";
import { Icon } from "@/components/atoms/Icon";
import { RichText } from "@/components/atoms/RichText";
import { cssString } from "@/lib/cssString";
import type { HomePageContent } from "@/types/service.types";

export const HomeHero = ({ hero }: { hero: HomePageContent["hero"] }) => (
  <section className="hero" id="inicio">
    <div className="hero-slider">
      {hero.slides.map((s, i) =>
        i === 0 ? (
          <div key={s.bgClass} className={`slide active ${s.bgClass}`} />
        ) : (
          // Fondos de las demás diapositivas: se cargan diferidos (HomeEffects añade la clase tras 2,5 s)
          <div key={s.bgClass} className="slide" data-bg-class={s.bgClass} />
        )
      )}
    </div>
    <div className="hero-overlay" />
    <div className="container hero-container">
      <div className="hero-content">
        <span className="hero-kicker" style={cssString(hero.kickerStyle)}>{hero.kicker}</span>
        <h1 className="hero-title"><RichText parts={hero.title} /></h1>
        <p className="hero-subtitle">{hero.subtitle}</p>
        <div className="hero-specialties">
          {hero.specialties.map((sp) => (
            <AppLink key={sp.href} className="specialty-tag" href={sp.href}>
              <Icon name={sp.icon} /> {sp.label}
            </AppLink>
          ))}
        </div>
        <div className="hero-buttons">
          {hero.buttons.map((b) => (
            <AppLink key={b.href} className={`btn ${b.variant} btn-large`} href={b.href} style={cssString(b.style)}>
              {b.label}
            </AppLink>
          ))}
        </div>
        <p className="hero-subtext" style={cssString(hero.subtextStyle)}>{hero.subtext}</p>
      </div>
    </div>
    <div className="hero-bottom-curve">
      <svg viewBox="0 0 1440 120" xmlns="http://www.w3.org/2000/svg">
        <path d="M0,64L80,69.3C160,75,320,85,480,85.3C640,85,800,75,960,64C1120,53,1280,43,1360,37.3L1440,32L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z" />
      </svg>
    </div>
  </section>
);
