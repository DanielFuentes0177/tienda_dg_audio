import React from "react";
import Link from "next/link";
import { isNextRoute } from "@/content/site";

export interface AppLinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  href: string;
}

/**
 * Átomo dumb: enlace que usa next/link solo para rutas de esta app.
 * Rutas aún servidas por el sitio HTML (o externas) usan <a> normal.
 */
export const AppLink = ({ href, children, ...props }: AppLinkProps) =>
  isNextRoute(href) ? (
    <Link href={href} {...props}>
      {children}
    </Link>
  ) : (
    <a href={href} {...props}>
      {children}
    </a>
  );
