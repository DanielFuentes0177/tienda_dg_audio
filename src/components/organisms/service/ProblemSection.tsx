import React from "react";
import { RichText } from "@/components/atoms/RichText";
import { ProblemCard } from "@/components/molecules/ServiceCards";
import type { ServicePageContent } from "@/types/service.types";

export const ProblemSection = ({ problem }: { problem: ServicePageContent["problem"] }) => (
  <section className="lux-dark-section" id="problema">
    <div className="container">
      <div className="reveal fade-right" style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
        <span className="eyebrow">{problem.eyebrow}</span>
        <h2 className="section-title" style={{ marginBottom: "1.5rem" }}><RichText parts={problem.title} /></h2>
        {problem.paragraphs.map((p, i) => (
          <p key={i} style={{ marginBottom: "1.5rem" }}><RichText parts={p} /></p>
        ))}
        <div className="antithesis-problems lux-grid">
          {problem.cards.map((c) => (
            <ProblemCard key={c.title} {...c} />
          ))}
        </div>
      </div>
    </div>
  </section>
);
