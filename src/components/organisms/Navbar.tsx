"use client";

import React, { useState, useEffect } from "react";
import { AppLink } from "@/components/atoms/AppLink";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import styles from "./Navbar.module.css";

export interface NavbarLink {
  label: string;
  href: string;
}

export type NavbarCta =
  | { kind: "link"; label: string; href: string }
  | { kind: "cart"; count: number; onClick: () => void };

export interface NavbarProps {
  links: NavbarLink[];
  cta: NavbarCta;
  pathname: string;
  homeHref: string;
  logoSrc?: string;
}

const isActive = (pathname: string, href: string) => {
  if (href.includes("#")) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
};

/**
 * Organismo presentacional. Recibe enlaces, CTA y ruta por props.
 * Estado local solo de UI (scroll, menú móvil, tema claro/oscuro según sección).
 */
export const Navbar = ({ links, cta, pathname, homeHref, logoSrc = "/dg_logo@2x.webp" }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  // El menú móvil se cierra solo al cambiar de ruta: se guarda en qué ruta se abrió.
  const [menuOpenPath, setMenuOpenPath] = useState<string | null>(null);
  const isMenuOpen = menuOpenPath === pathname;
  // Fuera de la home la barra es siempre clara; en la home depende de la sección visible.
  const [sectionLight, setSectionLight] = useState(false);
  const isNavLight = pathname !== "/" || sectionLight;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Cambia el tema de la barra según la sección visible
  useEffect(() => {
    const lightSections = Array.from(
      document.querySelectorAll(
        ".section-light, .section-light-alt, .section-premium-white, .trust-bar-wrapper, .brands, .solutions, .how-we-work, .contact-bubbles-section"
      )
    );
    const darkSections = Array.from(
      document.querySelectorAll(".hero, .section-dark, .section-black, .section-dark-premium, .applications, .faq, .why-us, footer")
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          if (lightSections.includes(entry.target)) setSectionLight(false);
          else if (darkSections.includes(entry.target)) setSectionLight(true);
        });
      },
      { rootMargin: "-70px 0px -50% 0px", threshold: 0 }
    );

    [...lightSections, ...darkSections].forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [pathname]);

  return (
    <header className={`${styles.navbar} ${isScrolled ? styles.scrolled : ""} ${isNavLight ? styles.navLight : ""}`}>
      <div className={styles.navContainer}>
        <a href={homeHref} className={styles.logo}>
          <Image src={logoSrc} alt="DG AUDIOSOUND Logo" width={105} height={105} className={styles.logoImg} priority />
        </a>

        <nav className={`${styles.navMenu} ${isMenuOpen ? styles.open : ""}`}>
          <ul className={styles.navList}>
            {links.map((link) => (
              <li key={link.href} className={styles.navItem}>
                <AppLink
                  href={link.href}
                  className={`${styles.navLink} ${isActive(pathname, link.href) ? styles.active : ""}`}
                >
                  {link.label}
                </AppLink>
              </li>
            ))}
          </ul>

          {cta.kind === "cart" ? (
            <button
              className={styles.navCta}
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              onClick={cta.onClick}
            >
              <ShoppingCart size={18} />
              Cotización ({cta.count})
            </button>
          ) : (
            <AppLink href={cta.href} className={styles.navCta}>
              {cta.label}
            </AppLink>
          )}
        </nav>

        <button
          type="button"
          className={styles.hamburger}
          aria-label="Abrir menú"
          aria-expanded={isMenuOpen}
          onClick={() => setMenuOpenPath(isMenuOpen ? null : pathname)}
        >
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
        </button>
      </div>
    </header>
  );
};
