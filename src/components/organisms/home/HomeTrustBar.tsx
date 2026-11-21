import React from "react";
import { Icon } from "@/components/atoms/Icon";
import type { HomePageContent } from "@/types/service.types";

export const HomeTrustBar = ({ items }: { items: HomePageContent["trust"] }) => (
  <div className="container trust-bar-wrapper">
    <section className="trust-bar reveal fade-up">
      {items.map((it, i) => (
        <React.Fragment key={it.title}>
          {i > 0 && <div className="trust-divider" />}
          <div className="trust-item">
            <div className="trust-icon"><Icon name={it.icon} /></div>
            <div className="trust-text">
              <div className="trust-title">{it.title}</div>
              <p>{it.text}</p>
            </div>
          </div>
        </React.Fragment>
      ))}
    </section>
  </div>
);
