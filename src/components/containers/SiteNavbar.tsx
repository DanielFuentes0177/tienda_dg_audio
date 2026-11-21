"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Navbar, type NavbarCta } from "@/components/organisms/Navbar";
import { useCart } from "@/context/CartContext";
import { NAV_LINKS, SITE, isServiceRoute } from "@/content/site";

/** Contenedor (smart): conecta Navbar con la ruta y el carrito. */
export const SiteNavbar = () => {
  const pathname = usePathname() ?? "/";
  const { itemCount, setIsDrawerOpen } = useCart();

  if (pathname.startsWith("/admin")) return null;

  const isStoreFlow = pathname.startsWith("/tienda") || pathname.startsWith("/checkout");
  const service = isServiceRoute(pathname);
  const cta: NavbarCta = isStoreFlow
    ? { kind: "cart", count: itemCount, onClick: () => setIsDrawerOpen(true) }
    : { kind: "link", label: "Cotiza aquí", href: service ? "#contacto" : "/#contacto" };

  return (
    <Navbar links={NAV_LINKS} cta={cta} pathname={pathname} homeHref={`${SITE.url}/`} adaptiveTheme={service} />
  );
};
