"use client";

import React from "react";
import Link from "next/link";
import { LayoutDashboard, Package, LogOut, ShoppingCart, FileText, PenLine, ExternalLink } from "lucide-react";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import styles from "./admin.module.css";

const NAV: { group: string; items: { href: string; label: string; icon: React.ReactNode; exact?: boolean }[] }[] = [
  {
    group: "Tienda",
    items: [
      { href: "/admin", label: "Resumen", icon: <LayoutDashboard size={19} />, exact: true },
      { href: "/admin/products", label: "Productos", icon: <Package size={19} /> },
      { href: "/admin/quotes", label: "Cotizaciones", icon: <ShoppingCart size={19} /> },
    ],
  },
  {
    group: "Contenido",
    items: [
      { href: "/admin/blog", label: "Blog", icon: <FileText size={19} /> },
      { href: "/admin/textos", label: "Textos SEO", icon: <PenLine size={19} /> },
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  const isActive = (href: string, exact?: boolean) => (exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`));

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <Link href="/admin" className={styles.brand}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/dg_logo.webp" alt="" />
          <span>
            <div className={styles.brandName}>DG Audiosound</div>
            <div className={styles.brandSub}>Administración</div>
          </span>
        </Link>

        <nav className={styles.nav} aria-label="Administración">
          {NAV.map((g) => (
            <React.Fragment key={g.group}>
              <div className={styles.group}>{g.group}</div>
              {g.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${styles.link} ${isActive(item.href, item.exact) ? styles.linkActive : ""}`}
                  aria-current={isActive(item.href, item.exact) ? "page" : undefined}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </React.Fragment>
          ))}
        </nav>

        <div className={styles.foot}>
          <a href="/" target="_blank" rel="noopener noreferrer" className={styles.footBtn}>
            <ExternalLink size={18} /> Ver sitio
          </a>
          <button type="button" className={styles.footBtn} onClick={() => signOut({ callbackUrl: "/" })}>
            <LogOut size={18} /> Cerrar sesión
          </button>
        </div>
      </aside>

      <main className={styles.main}>{children}</main>
    </div>
  );
}
