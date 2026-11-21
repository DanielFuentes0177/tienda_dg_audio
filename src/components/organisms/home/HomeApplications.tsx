import React from "react";
import { AppLink } from "@/components/atoms/AppLink";
import { Icon } from "@/components/atoms/Icon";
import type { HomePageContent } from "@/types/service.types";

export const HomeApplications = ({ data }: { data: HomePageContent["applications"] }) => (
  <section className="section section-black applications" id="aplicaciones">
    <div className="app-bg-shape shape-1" />
    <div className="app-bg-shape shape-2" />
    <div className="container">
      <div className="section-header reveal fade-up">
        <h2 className="section-title">{data.title}</h2>
        <p className="section-subtitle">{data.subtitle}</p>
      </div>
      <div className="app-categories-grid">
        {data.categories.map((cat) => (
          <div key={cat.name} className="app-category-block reveal fade-up">
            <h3 className="category-name"><Icon name={cat.icon} /> {cat.name}</h3>
            <p className="category-intro">{cat.intro}</p>
            <div className="app-sub-items">
              {cat.items.map((it) => (
                <AppLink key={it.href} className="sub-item" href={it.href}>
                  <Icon name={it.icon} />
                  <h4>{it.title}</h4>
                  <div className="hover-desc">{it.desc}</div>
                </AppLink>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="apps-footer reveal fade-up">
        <p className="apps-footer-text">{data.footerText}</p>
        <div className="apps-ctas">
          {data.ctas.map((c) => (
            <AppLink key={c.href} className={`btn ${c.variant} btn-large`} href={c.href}>{c.label}</AppLink>
          ))}
        </div>
      </div>
    </div>
  </section>
);
