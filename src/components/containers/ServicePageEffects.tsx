"use client";

import { useEffect } from "react";

/**
 * Contenedor (smart, sin UI): comportamientos de las páginas de servicio que en el sitio HTML
 * hacía subpage.js — revelado al hacer scroll y efecto de inclinación 3D en tarjetas.
 */
export const ServicePageEffects = ({ variant = "service", kickers }: { variant?: "service" | "hub" | "home"; kickers?: string[] }) => {
  useEffect(() => {
    const root = document.querySelector(".svc");
    if (!root) return;

    // Revelado progresivo
    const reveals = Array.from(root.querySelectorAll<HTMLElement>(".reveal, .reveal-lux"));
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active", "revealed");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: "0px 0px -20px 0px" }
    );
    reveals.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) el.classList.add("active", "revealed");
      io.observe(el);
    });

    // Carrusel del hero (crossfade cada 4 s)
    const slides = Array.from(root.querySelectorAll<HTMLElement>(variant === "hub" ? ".hero-lux-slide" : variant === "home" ? ".hero .slide" : ".corp-hero-v2 .slide"));
    const kicker = root.querySelector<HTMLElement>(".hero-kicker");
    // Home: las diapositivas 2-4 cargan su fondo de forma diferida (rendimiento)
    const lazyTimer = variant === "home" ? setTimeout(() => {
      slides.forEach((sl) => {
        const bg = sl.getAttribute("data-bg-class");
        if (bg) { sl.classList.add(bg); sl.removeAttribute("data-bg-class"); }
      });
    }, 2500) : undefined;
    let slideTimer: ReturnType<typeof setInterval> | undefined;
    if (slides.length > 1) {
      let current = 0;
      slideTimer = setInterval(() => {
        slides[current].classList.remove("active");
        current = (current + 1) % slides.length;
        slides[current].classList.add("active");
        if (variant === "home" && kicker && kickers?.[current]) kicker.textContent = kickers[current];
      }, variant === "hub" ? 5500 : variant === "home" ? 5000 : 4000);
    }

    // Inclinación 3D (solo con puntero fino)
    const cleanups: Array<() => void> = [];
    if (variant !== "home" && window.matchMedia("(hover: hover)").matches) {
      root
        .querySelectorAll<HTMLElement>(variant === "hub" ? ".card-lux, .process-bento-item" : ".benefit-v2-card, .process-bento-item, .include-card, .brand-marquee-item, .antithesis-problem-card")
        .forEach((card) => {
          const move = (e: MouseEvent) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const px = (x / rect.width) * 100;
            const py = (y / rect.height) * 100;
            const rx = ((rect.height / 2 - y) / (rect.height / 2)) * 10;
            const ry = ((x - rect.width / 2) / (rect.width / 2)) * 10;
            card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.03, 1.03, 1.03)`;
            card.style.setProperty("--mouse-x", `${px}%`);
            card.style.setProperty("--mouse-y", `${py}%`);
            card.style.setProperty("--glow-x", `${(px - 50) * 2}%`);
            card.style.setProperty("--glow-y", `${(py - 50) * 2}%`);
          };
          const leave = () => {
            card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
            card.style.setProperty("--mouse-x", "50%");
            card.style.setProperty("--mouse-y", "50%");
            card.style.setProperty("--glow-x", "0%");
            card.style.setProperty("--glow-y", "0%");
          };
          card.addEventListener("mousemove", move);
          card.addEventListener("mouseleave", leave);
          cleanups.push(() => {
            card.removeEventListener("mousemove", move);
            card.removeEventListener("mouseleave", leave);
          });
        });
    }

    return () => {
      io.disconnect();
      if (slideTimer) clearInterval(slideTimer);
      if (lazyTimer) clearTimeout(lazyTimer);
      cleanups.forEach((fn) => fn());
    };
  }, [variant, kickers]);

  return null;
};
