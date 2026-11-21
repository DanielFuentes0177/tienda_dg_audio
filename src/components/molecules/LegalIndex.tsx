"use client";

import React, { useEffect, useState } from "react";

export interface LegalIndexProps {
  title: string;
  items: { href: string; label: string }[];
}

/** Índice lateral de las páginas legales con resaltado de la sección visible (scroll-spy). */
export const LegalIndex = ({ title, items }: LegalIndexProps) => {
  const [current, setCurrent] = useState<string>(items[0]?.href ?? "");

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("article div[id]"));
    const onScroll = () => {
      let active = "";
      sections.forEach((s) => {
        if (window.scrollY >= s.offsetTop - 150) active = `#${s.id}`;
      });
      setCurrent(active);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <aside className="legal-sidebar">
      <div className="legal-index-card">
        <h3>{title}</h3>
        <ul className="legal-index-list">
          {items.map((it) => (
            <li key={it.href}>
              <a href={it.href} className={current === it.href ? "active" : undefined}>{it.label}</a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};
