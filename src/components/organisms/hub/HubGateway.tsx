import React from "react";
import Image from "next/image";
import { AppLink } from "@/components/atoms/AppLink";
import { RichText } from "@/components/atoms/RichText";
import { cssString } from "@/lib/cssString";
import type { HubPageContent } from "@/types/service.types";

export const HubGateway = ({ gateway }: { gateway: HubPageContent["gateway"] }) => (
  <section className="section-lux-white" id="aplicaciones">
    <div className="container-lux">
      <div style={{ maxWidth: 800, marginBottom: "5rem" }}>
        <span className="lux-kicker">{gateway.kicker}</span>
        <h2 className="lux-title"><RichText parts={gateway.title} /></h2>
        <p className="lux-lead"><RichText parts={gateway.lead} /></p>
      </div>
      <div className="gateway-lux-grid">
        {gateway.cards.map((c) => (
          <div key={c.href} className="gateway-lux-card reveal-lux" style={cssString(c.style)}>
            <Image className="gateway-lux-img" src={c.src} alt={c.alt} width={c.width} height={c.height} />
            <div className="gateway-lux-overlay" />
            <div className="gateway-lux-content">
              <h3>{c.title}</h3>
              <p>{c.text}</p>
              <AppLink className="gateway-lux-link" href={c.href}>
                {c.linkLabel} <i className="fa-solid fa-arrow-right" />
              </AppLink>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);
