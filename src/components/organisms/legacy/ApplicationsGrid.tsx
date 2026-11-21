import React from "react";
import { AppLink } from "@/components/atoms/AppLink";
import { Icon } from "@/components/atoms/Icon";
import { cssString } from "@/lib/cssString";
import type { ApplicationsPageContent } from "@/types/service.types";

export const ApplicationsGrid = ({ data }: { data: ApplicationsPageContent }) => (
  <section className={data.sectionsClass}>
    <div className="container">
      <div className="app-categories-grid">
        {data.categories.map((cat) => (
          <div key={cat.name} className="app-category-block reveal fade-up">
            <h3 className="category-name"><Icon name={cat.icon} /> {cat.name}</h3>
            <div className="app-sub-items" style={cssString(cat.itemsStyle)}>
              {cat.items.map((it) => (
                <AppLink key={it.href} className="sub-item" href={it.href} style={cssString(it.style)}>
                  <h4>
                    {it.title} <Icon name={it.iconClass} style={cssString(it.iconStyle)} />
                  </h4>
                  <p>{it.desc}</p>
                </AppLink>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);
