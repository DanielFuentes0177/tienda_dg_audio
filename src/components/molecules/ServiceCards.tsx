import React from "react";
import Image from "next/image";
import { Icon } from "@/components/atoms/Icon";
import type { IconCard, ServiceImage } from "@/types/service.types";

/** Moléculas dumb de tarjetas de las páginas de servicio (clases heredadas del sitio HTML). */

export const BenefitCard = ({ icon, title, text }: IconCard) => (
  <div className="benefit-v2-card reveal fade-up">
    <div className="icon"><Icon name={icon} /></div>
    <h3>{title}</h3>
    <p>{text}</p>
  </div>
);

export const ProblemCard = ({ icon, title, text }: IconCard) => (
  <div className="antithesis-problem-card lux-card">
    <Icon name={icon} />
    <h3>{title}</h3>
    <p>{text}</p>
  </div>
);

export const IncludeCard = ({ icon, title, text }: IconCard) => (
  <div className="include-card reveal fade-up">
    <h3 style={{ color: "var(--color-primary-hover)" }}>
      <Icon name={icon} /> {title}
    </h3>
    <p>{text}</p>
  </div>
);

export const ProcessStep = ({ icon, title, text, step, num }: IconCard & { step: number; num?: string }) => (
  <div className="process-bento-item">
    <div className="bento-header">
      <span className="bento-num">{num ?? step}</span>
      <Icon name={icon} />
    </div>
    <h3>{title}</h3>
    <p>{text}</p>
  </div>
);

export const AreaCard = ({ image, label }: { image: ServiceImage; label: string }) => (
  <div className="area-card">
    <Image src={image.src} alt={image.alt} width={image.width} height={image.height} />
    <span>{label}</span>
  </div>
);
