import React from "react";
import { AppLink } from "@/components/atoms/AppLink";
import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";
import styles from "./Footer.module.css";

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterProps {
  description: string;
  navLinks: FooterLink[];
  solutionLinks: FooterLink[];
  legalLinks: FooterLink[];
  contact: { phone: string; email: string; location: string };
  social: { facebook: string; instagram: string };
  year: number;
  homeHref: string;
  logoSrc?: string;
}

/** Organismo presentacional: todo el contenido llega por props (ver src/content/site.ts). */
export const Footer = ({
  description,
  navLinks,
  solutionLinks,
  legalLinks,
  contact,
  social,
  year,
  homeHref,
  logoSrc = "/dg_logo@2x.webp",
}: FooterProps) => (
  <footer className={styles.footer}>
    <div className={`container ${styles.footerContainer}`}>
      <div className="footer-col brand-col">
        <a href={homeHref} className={styles.footerLogo}>
          <Image src={logoSrc} alt="DG AUDIOSOUND Logo" width={112} height={112} className={styles.footerLogoImg} />
        </a>
        <p className={styles.footerDesc}>{description}</p>
        <div className={styles.socialLinks}>
          <a href={social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
          </a>
          <a href={social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
          </a>
        </div>
      </div>

      <div className="footer-col">
        <h4 className={styles.footerTitle}>Navegación</h4>
        <ul className={styles.footerLinks}>
          {navLinks.map((l) => (
            <li key={l.href}><AppLink href={l.href}>{l.label}</AppLink></li>
          ))}
        </ul>
      </div>

      <div className="footer-col">
        <h4 className={styles.footerTitle}>Soluciones</h4>
        <ul className={styles.footerLinks}>
          {solutionLinks.map((l) => (
            <li key={l.href}><AppLink href={l.href}>{l.label}</AppLink></li>
          ))}
        </ul>
      </div>

      <div className="footer-col">
        <h4 className={styles.footerTitle}>Contacto</h4>
        <ul className={styles.footerContact}>
          <li><Phone size={18} /> {contact.phone}</li>
          <li><Mail size={18} /> {contact.email}</li>
          <li><MapPin size={18} /> {contact.location}</li>
        </ul>
      </div>
    </div>

    <div className={styles.footerBottom}>
      <div className={`container ${styles.footerBottomContainer}`}>
        <p>© {year} DG Audiosound. Todos los derechos reservados.</p>
        <div className={styles.footerLegal}>
          {legalLinks.map((l) => (
            <AppLink key={l.href} href={l.href}>{l.label}</AppLink>
          ))}
        </div>
      </div>
    </div>
  </footer>
);
