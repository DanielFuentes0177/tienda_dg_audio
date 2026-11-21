"use client";

import React, { useState } from "react";
import { FaqItem } from "@/components/molecules/FaqItem";
import type { ServicePageContent } from "@/types/service.types";

/** Organismo con estado de UI local: un solo elemento abierto a la vez. */
export const FaqSection = ({ faq }: { faq: ServicePageContent["faq"] }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <section className="section section-light" id="faq">
      <div className="container" style={{ textAlign: "center", maxWidth: 800, marginBottom: "2rem" }}>
        <span className="eyebrow reveal fade-up">{faq.eyebrow}</span>
        <h2>{faq.title}</h2>
        <p className="section-subtitle reveal fade-up">{faq.subtitle}</p>
      </div>
      <div className="faq-lux-wrap reveal fade-up">
        {faq.items.map((item, i) => (
          <FaqItem
            key={item.question}
            question={item.question}
            answer={item.answer}
            open={openIndex === i}
            onToggle={() => setOpenIndex(openIndex === i ? null : i)}
          />
        ))}
      </div>
    </section>
  );
};
