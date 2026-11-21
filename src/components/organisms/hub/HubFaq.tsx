"use client";

import React, { useState } from "react";
import { RichText } from "@/components/atoms/RichText";
import { FaqItem } from "@/components/molecules/FaqItem";
import type { HubPageContent } from "@/types/service.types";

export const HubFaq = ({ faq }: { faq: HubPageContent["faq"] }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <section className="section-lux-white" id="faq">
      <div className="container-lux">
        <div style={{ textAlign: "center", maxWidth: 800, margin: "0 auto 5rem" }}>
          <span className="lux-kicker">{faq.kicker}</span>
          <h2 className="lux-title"><RichText parts={faq.title} /></h2>
        </div>
        <div className="faq-lux-wrap reveal-lux">
          {faq.items.map((item, i) => (
            <FaqItem
              key={item.question}
              question={item.question}
              answer={item.answer}
              open={openIndex === i}
              plus={false}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
