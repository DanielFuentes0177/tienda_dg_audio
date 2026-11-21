"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import styles from "./Navbar.module.css";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNavLight, setIsNavLight] = useState(false);
  const pathname = usePathname();
  const { itemCount, setIsDrawerOpen } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Intersection Observer para cambiar de color
  useEffect(() => {
    // Si la ruta no es la home (ej: admin, carrito, etc), por defecto que sea claro para que se vea
    if (pathname !== "/") {
      setIsNavLight(true);
    }

    const lightSections = document.querySelectorAll(
      '.section-light, .section-light-alt, .section-premium-white, .trust-bar-wrapper, .brands, .solutions, .how-we-work, .contact-bubbles-section'
    );
    const darkSections = document.querySelectorAll(
      '.hero, .section-dark, .section-black, .section-dark-premium, .applications, .faq, .why-us, footer'
    );

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (Array.from(lightSections).includes(entry.target)) {
            setIsNavLight(false);
          } else if (Array.from(darkSections).includes(entry.target)) {
            setIsNavLight(true);
          }
        }
      });
    }, { rootMargin: '-70px 0px -50% 0px', threshold: 0 });

    lightSections.forEach(s => observer.observe(s));
    darkSections.forEach(s => observer.observe(s));

    return () => observer.disconnect();
  }, [pathname]);

  // Cerrar menú al cambiar de ruta
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <header className={`${styles.navbar} ${isScrolled ? styles.scrolled : ""} ${isNavLight ? styles.navLight : ""}`}>
      <div className={styles.navContainer}>
        <Link href="https://www.dgaudiosound.com/" className={styles.logo}>
          <Image 
            src="/dg_logo@2x.webp" 
            alt="DG AUDIOSOUND Logo" 
            width={105} 
            height={105}
            className={styles.logoImg}
            priority
          />
        </Link>
        
        <nav className={`${styles.navMenu} ${isMenuOpen ? styles.open : ""}`}>
          <ul className={styles.navList}>
            <li className={styles.navItem}>
              <Link href="https://www.dgaudiosound.com/" className={styles.navLink}>
                Inicio
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/tienda" className={`${styles.navLink} ${pathname.includes("/tienda") ? styles.active : ""}`}>
                Tienda
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/blog" className={`${styles.navLink} ${pathname.includes("/blog") ? styles.active : ""}`}>
                Blog
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link href="https://www.dgaudiosound.com/#contacto" className={styles.navLink}>
                Contacto
              </Link>
            </li>
          </ul>
          
          <button 
            className={styles.navCta} 
            style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            onClick={() => setIsDrawerOpen(true)}
          >
            <ShoppingCart size={18} />
            Cotización ({itemCount})
          </button>
        </nav>
        
        <div className={styles.hamburger} onClick={toggleMenu}>
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
        </div>
      </div>
    </header>
  );
};
