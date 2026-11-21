import React from "react";
import Image from "next/image";
import { AppLink } from "@/components/atoms/AppLink";
import { Icon } from "@/components/atoms/Icon";
import type { HomePageContent } from "@/types/service.types";

const delay = (ms: number | null) => (ms == null ? undefined : { transitionDelay: `${ms}ms` });

export const HomeSolutions = ({ data }: { data: HomePageContent["solutions"] }) => (
  <section className="section section-light-alt solutions" id="soluciones">
    <div className="container">
      <div className="section-header reveal fade-up">
        <h2 className="section-title">{data.title}</h2>
        <p className="section-subtitle">{data.subtitle}</p>
      </div>
      <div className="solutions-grid">
        {data.cards.map((c) => (
          <div key={c.href} className="solution-card reveal fade-up" style={delay(c.delay)}>
            <div className="solution-img">
              <Image src={c.img.src} alt={c.img.alt} width={c.img.width} height={c.img.height} />
              <div className="solution-apps-overlay">
                <span className="apps-title">{c.overlayTitle}</span>
                <div className="apps-tags">
                  {c.tags.map((t) => (
                    <span key={t} className="app-tag">{t}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="solution-content">
              <div className="solution-icon"><Icon name={c.icon} /></div>
              <h3 className="solution-title">{c.title}</h3>
              <p className="solution-desc">{c.desc}</p>
              <AppLink className="btn-solution" href={c.href}>{c.linkLabel}</AppLink>
            </div>
          </div>
        ))}
      </div>
      <p className="section-closing-text">{data.closing}</p>
    </div>
  </section>
);
