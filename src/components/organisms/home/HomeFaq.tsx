"use client";

import React, { useState } from "react";
import { AccordionItem } from "@/components/molecules/AccordionItem";
import type { HomePageContent } from "@/types/service.types";

export const HomeFaq = ({ faq }: { faq: HomePageContent["faq"] }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <section className="section section-black faq" id="faq">
      <div className="container faq-container">
        <div className="section-header reveal fade-up">
          <h2 className="section-title">{faq.title}</h2>
        </div>
        <div className="accordion-wrapper reveal fade-up" style={{ transitionDelay: "100ms" }}>
          {faq.items.map((item, i) => (
            <AccordionItem
              key={item.question}
              question={item.question}
              answer={item.answer}
              open={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
