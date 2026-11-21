"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Footer } from "@/components/organisms/Footer";
import {
  SITE,
  FOOTER_DESCRIPTION,
  FOOTER_NAV_LINKS,
  FOOTER_SOLUTION_LINKS,
  FOOTER_LEGAL_LINKS,
} from "@/content/site";

/** Contenedor (smart): decide dónde se muestra el Footer y le pasa el contenido. */
export const SiteFooter = () => {
  const pathname = usePathname() ?? "/";
  if (pathname.startsWith("/admin")) return null;

  return (
    <Footer
      description={FOOTER_DESCRIPTION}
      navLinks={FOOTER_NAV_LINKS}
      solutionLinks={FOOTER_SOLUTION_LINKS}
      legalLinks={FOOTER_LEGAL_LINKS}
      contact={{ phone: SITE.phoneDisplay, email: SITE.email, location: SITE.location }}
      social={SITE.social}
      year={new Date().getFullYear()}
      homeHref={`${SITE.url}/`}
    />
  );
};
