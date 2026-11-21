"use client";

import React, { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/atoms/Icon";
import { RichText } from "@/components/atoms/RichText";
import { AppLink } from "@/components/atoms/AppLink";
import { cssString } from "@/lib/cssString";
import type { HubPageContent } from "@/types/service.types";

/** Carrusel de sistemas: al elegir uno, el panel se desvanece 500 ms y cambia (igual que el sitio HTML). */
export const HubShowcase = ({ showcase }: { showcase: HubPageContent["showcase"] }) => {
  const [index, setIndex] = useState(0);
  const [touched, setTouched] = useState(false);
  const [panelActive, setPanelActive] = useState(true);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const select = (i: number) => {
    setPanelActive(false);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setIndex(i);
      setTouched(true);
      setPanelActive(true);
    }, 500);
  };
  const system = touched ? showcase.systems[index] : showcase.initial;

  return (
    <section className="showcase-lux" id="sistemas">
      <div className="showcase-slider">
        {showcase.slides.map((src, i) => (
          <div key={src} className={`showcase-slide${i === index ? " active" : ""}`} style={{ backgroundImage: `url('${src}')` }} />
        ))}
      </div>
      <div className="showcase-container">
        <div className={`showcase-info-panel${panelActive ? " active" : ""}`}>
          <span className="lux-kicker" style={cssString(showcase.kickerStyle)}>{showcase.kicker}</span>
          <h2 className="showcase-slide-title"><RichText parts={system.title} /></h2>
          <p className="showcase-slide-desc">{system.desc}</p>
          <ul className="showcase-specs">
            {system.specs.map((spec) => (
              <li key={spec}><i className="fa-solid fa-circle-check" /> {spec}</li>
            ))}
          </ul>
          <AppLink className="gateway-lux-link" href={system.link}>
            {showcase.linkLabel} <i className="fa-solid fa-arrow-right" />
          </AppLink>
        </div>
        <div className="showcase-nav">
          {showcase.navLabels.map((label, i) => (
            <button key={label} type="button" className={`showcase-nav-btn${i === index ? " active" : ""}`} onClick={() => select(i)}>
              {label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
