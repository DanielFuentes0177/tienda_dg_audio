import React from "react";
import Image from "next/image";
import { RichText } from "@/components/atoms/RichText";
import { BenefitCard } from "@/components/molecules/ServiceCards";
import type { ServicePageContent } from "@/types/service.types";

export const ServiceIntro = ({ intro }: { intro: ServicePageContent["intro"] }) => (
  <section className="section section-light">
    <div className="container two-col">
      <div className="reveal fade-right">
        <span className="eyebrow">{intro.eyebrow}</span>
        <h2><RichText parts={intro.title} /></h2>
        {intro.paragraphs.map((p, i) => (
          <p key={i} style={{ marginBottom: "1.5rem" }}><RichText parts={p} /></p>
        ))}
      </div>
      <div className="reveal fade-left">
        <figure
          className="image-card"
          style={{ borderRadius: "var(--radius-lg)", overflow: "hidden", boxShadow: "var(--shadow-md)", marginTop: "10px" }}
        >
          <Image
            src={intro.image.src}
            alt={intro.image.alt}
            width={intro.image.width}
            height={intro.image.height}
            style={{ width: "100%", height: "auto", objectFit: "cover" }}
          />
        </figure>
      </div>
    </div>
    <div className="container benefits-corp-grid">
      {intro.benefits.map((b) => (
        <BenefitCard key={b.title} {...b} />
      ))}
    </div>
  </section>
);
