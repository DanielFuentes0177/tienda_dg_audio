import React from "react";
import Image from "next/image";
import { Icon } from "@/components/atoms/Icon";
import { RichText } from "@/components/atoms/RichText";
import { cssString } from "@/lib/cssString";
import type { HubPageContent } from "@/types/service.types";

type Problem = HubPageContent["problem"];

const Copy = ({ p }: { p: Problem }) => (
  <>
    <span className="lux-kicker">{p.kicker}</span>
    <h2 className="lux-title"><RichText parts={p.title} /></h2>
    <p className="lux-lead" style={cssString(p.leadStyle)}><RichText parts={p.lead} /></p>
    {p.body && <p style={cssString(p.bodyStyle)}><RichText parts={p.body} /></p>}
  </>
);

const Cards = ({ p }: { p: Problem }) => (
  <div className={`antithesis-problems${p.cardsReveal ? " reveal-lux" : ""}`} style={cssString(p.cardsStyle)}>
    {p.cards.map((c) => (
      <div key={c.title} className="antithesis-problem-card" style={{ textAlign: "center" }}>
        <Icon name={c.icon} style={cssString(c.iconStyle)} />
        <h3>{c.title}</h3>
        <p>{c.text}</p>
      </div>
    ))}
  </div>
);

export const HubProblem = ({ problem }: { problem: Problem }) => (
  <section className="section-lux-white" id="problema">
    <div className="container-lux">
      {problem.sideLayout && problem.image ? (
        <>
          <div className="antithesis-grid" style={{ alignItems: "center" }}>
            <div className="reveal-lux"><Copy p={problem} /></div>
            <div className="antithesis-visual-wrapper reveal-lux" style={cssString(problem.imageWrapStyle)}>
              <Image
                className="antithesis-main-img"
                src={problem.image.src}
                alt={problem.image.alt}
                width={problem.image.width}
                height={problem.image.height}
                style={cssString(problem.image.style)}
              />
            </div>
          </div>
          <Cards p={problem} />
        </>
      ) : (
        <div className="reveal-lux">
          <Copy p={problem} />
          <Cards p={problem} />
        </div>
      )}
    </div>
  </section>
);
