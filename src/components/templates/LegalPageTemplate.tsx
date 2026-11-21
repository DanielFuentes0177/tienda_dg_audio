import React from "react";
import "@/styles/service-page.css";
import "@/styles/service-page-overrides.css";
import { RichText } from "@/components/atoms/RichText";
import { LegalIndex } from "@/components/molecules/LegalIndex";
import type { LegalPageContent } from "@/types/service.types";

/** Template de las páginas legales (aviso de privacidad, términos y condiciones). */
export const LegalPageTemplate = ({ content }: { content: LegalPageContent }) => (
  <div className="svc">
    <div>
      <div className="container legal-header">
        <h1>{content.title}</h1>
        <p>{content.updated}</p>
      </div>
      <section className="legal-section">
        <div className="container legal-container">
          <LegalIndex title={content.indexTitle} items={content.index} />
          <article className="legal-article">
            {content.sections.map((sec) => (
              <div key={sec.id} id={sec.id}>
                <h2>{sec.title}</h2>
                {sec.blocks.map((b, i) =>
                  b.type === "p" ? (
                    <p key={i}><RichText parts={b.text} /></p>
                  ) : (
                    <ul key={i}>
                      {b.items.map((it, j) => (
                        <li key={j}><RichText parts={it} /></li>
                      ))}
                    </ul>
                  )
                )}
              </div>
            ))}
          </article>
        </div>
      </section>
    </div>
  </div>
);
