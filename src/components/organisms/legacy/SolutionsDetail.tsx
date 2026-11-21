import React from "react";
import Image from "next/image";
import { AppLink } from "@/components/atoms/AppLink";
import { cssString } from "@/lib/cssString";
import type { SolutionsPageContent } from "@/types/service.types";

export const SolutionsDetail = ({ blocks }: { blocks: SolutionsPageContent["blocks"] }) => (
  <section className="section section-light">
    <div className="container">
      {blocks.map((b) => (
        <div key={b.title} className="cta-container" style={cssString(b.wrapStyle)}>
          <div className={b.textClass} style={cssString(b.textStyle)}>
            <h2 className="section-title">{b.title}</h2>
            <p className="section-subtitle" style={cssString(b.subtitleStyle)}>{b.subtitle}</p>
            <ul style={cssString(b.bulletsStyle)}>
              {b.bullets.map((li) => (
                <li key={li}>{li}</li>
              ))}
            </ul>
            <AppLink className="btn btn-primary" href={b.ctaHref} style={cssString(b.ctaStyle)}>{b.ctaLabel}</AppLink>
          </div>
          <div className={b.imageClass}>
            <Image src={b.image.src} alt={b.image.alt} width={b.image.width} height={b.image.height} style={{ ...cssString(b.image.style), width: "100%", height: "auto" }} />
          </div>
        </div>
      ))}
    </div>
  </section>
);
