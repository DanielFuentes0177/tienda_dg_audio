"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { RichText } from "@/components/atoms/RichText";
import type { BlueprintEntry, HubPageContent } from "@/types/service.types";

type Blueprint = HubPageContent["blueprint"];

/** Plano técnico interactivo: al elegir un punto el panel se desvanece 350 ms y cambia. */
export const HubBlueprint = ({ blueprint }: { blueprint: Blueprint }) => {
  const [entry, setEntry] = useState<(BlueprintEntry & { header?: string }) | null>(null);
  const [hidden, setHidden] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const shown = entry ?? blueprint.initial;
  const header = entry?.header ?? blueprint.panelHeader;

  const select = (key: string) => {
    const data = blueprint.entries[key];
    if (!data) return;
    setHidden(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setEntry(data);
      setHidden(false);
    }, 350);
  };

  return (
    <section className="section-lux-dark-alt" id="blueprint">
      <div className="container-lux">
        <div style={{ maxWidth: 800 }}>
          <span className="lux-kicker">{blueprint.kicker}</span>
          <h2 className="lux-title"><RichText parts={blueprint.title} /></h2>
          <p className="lux-lead"><RichText parts={blueprint.lead} /></p>
        </div>
        <div className="blueprint-grid">
          <div className="blueprint-viewer">
            <Image src={blueprint.image.src} alt={blueprint.image.alt} width={blueprint.image.width} height={blueprint.image.height} />
            <div className="blueprint-svg-wrap">
              <svg className="blueprint-svg" preserveAspectRatio="none" viewBox="0 0 100 100">
                <rect fill="none" height="80" width="80" x="10" y="10" />
                <line x1="50" x2="50" y1="10" y2="90" />
                <line x1="10" x2="90" y1="50" y2="50" />
                <circle cx="50" cy="50" fill="none" r="30" />
              </svg>
            </div>
            {blueprint.hotspots.map((h) => (
              <div key={h.key} className={`blueprint-hotspot ${h.spot}`} data-target={h.key} onClick={() => select(h.key)}>
                <span className="blueprint-hotspot-label">{h.label}</span>
              </div>
            ))}
          </div>
          <div
            className="blueprint-panel"
            id="blueprint-details"
            style={hidden ? { opacity: 0, transform: "translateY(20px)" } : { opacity: 1, transform: "none" }}
          >
            <span className="blueprint-panel-header" id="bp-header">{header}</span>
            <h3 className="blueprint-panel-title" id="bp-title"><RichText parts={shown.title} /></h3>
            <p className="blueprint-panel-desc" id="bp-desc">{shown.desc}</p>
            <div className="blueprint-tech-grid">
              <div className="blueprint-tech-item">
                <strong id="bp-tech1-title">{shown.tech1Title}</strong>
                <span id="bp-tech1-desc">{shown.tech1Desc}</span>
              </div>
              <div className="blueprint-tech-item">
                <strong id="bp-tech2-title">{shown.tech2Title}</strong>
                <span id="bp-tech2-desc">{shown.tech2Desc}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
