import React from "react";
import Link from "next/link";
import styles from "./RelatedServices.module.css";

export interface RelatedServicesProps {
  title: string;
  hubHref: string;
  hubLabel: string;
  items: { href: string; label: string }[];
}

/** Organismo dumb: enlaces internos a las otras soluciones del mismo grupo (ayuda a descubrir y a entender la jerarquía del sitio). */
export const RelatedServices = ({ title, hubHref, hubLabel, items }: RelatedServicesProps) => {
  if (items.length === 0) return null;
  return (
    <section className="section section-light" aria-labelledby="otras-soluciones">
      <div className="container">
        <h2 id="otras-soluciones" className={styles.title}>{title}</h2>
        <ul className={styles.list}>
          {items.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className={styles.link}>{item.label}</Link>
            </li>
          ))}
        </ul>
        <p className={styles.hub}>
          <Link href={hubHref}>{hubLabel}</Link>
        </p>
      </div>
    </section>
  );
};
