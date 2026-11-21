"use client";

import React from "react";
import Link from "next/link";
import { LayoutDashboard, Package, LogOut, ShoppingCart, FileText, PenLine } from "lucide-react";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isProducts = pathname?.startsWith("/admin/products");
  const isDashboard = pathname === "/admin";
  const isTextos = pathname?.startsWith("/admin/textos");
  const isBlog = pathname?.startsWith("/admin/blog");

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "var(--bg-secondary)" }}>
      {/* Sidebar */}
      <aside style={{ 
        width: "260px", 
        backgroundColor: "var(--bg-dark)", 
        color: "var(--text-inverse)", 
        padding: "2rem 1rem",
        display: "flex",
        flexDirection: "column"
      }}>
        <div style={{ marginBottom: "2rem", paddingLeft: "1rem" }}>
          <h2 style={{ color: "var(--color-accent)", margin: 0 }}>DG ADMIN</h2>
        </div>
        
        <nav style={{ display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1 }}>
          <Link 
            href="/admin" 
            style={{ 
              padding: "0.75rem 1rem", 
              borderRadius: "8px", 
              display: "flex", 
              alignItems: "center", 
              gap: "0.75rem", 
              backgroundColor: isDashboard ? "rgba(212, 164, 55, 0.1)" : "transparent",
              color: isDashboard ? "var(--color-accent)" : "var(--text-inverse)" 
            }}
          >
            <LayoutDashboard size={20} />
            Dashboard
          </Link>
          <Link 
            href="/admin/products" 
            style={{ 
              padding: "0.75rem 1rem", 
              borderRadius: "8px", 
              backgroundColor: isProducts ? "rgba(212, 164, 55, 0.1)" : "transparent", 
              color: isProducts ? "var(--color-accent)" : "var(--text-inverse)", 
              display: "flex", 
              alignItems: "center", 
              gap: "0.75rem" 
            }}
          >
            <Package size={20} />
            Productos
          </Link>
          <Link 
            href="/admin/quotes" 
            style={{ 
              padding: "0.75rem 1rem", 
              borderRadius: "8px", 
              backgroundColor: pathname?.startsWith("/admin/quotes") ? "rgba(212, 164, 55, 0.1)" : "transparent", 
              color: pathname?.startsWith("/admin/quotes") ? "var(--color-accent)" : "var(--text-inverse)", 
              display: "flex", 
              alignItems: "center", 
              gap: "0.75rem" 
            }}
          >
            <ShoppingCart size={20} />
            Cotizaciones
          </Link>
          <Link 
            href="/admin/blog" 
            style={{ 
              padding: "0.75rem 1rem", 
              borderRadius: "8px", 
              backgroundColor: isBlog ? "rgba(212, 164, 55, 0.1)" : "transparent", 
              color: isBlog ? "var(--color-accent)" : "var(--text-inverse)", 
              display: "flex", 
              alignItems: "center", 
              gap: "0.75rem" 
            }}
          >
            <FileText size={20} />
            Blog
          </Link>
          <Link 
            href="/admin/textos" 
            style={{ 
              padding: "0.75rem 1rem", 
              borderRadius: "8px", 
              backgroundColor: isTextos ? "rgba(212, 164, 55, 0.1)" : "transparent", 
              color: isTextos ? "var(--color-accent)" : "var(--text-inverse)", 
              display: "flex", 
              alignItems: "center", 
              gap: "0.75rem" 
            }}
          >
            <PenLine size={20} />
            Textos
          </Link>
        </nav>

        <button 
          onClick={() => signOut({ callbackUrl: '/' })}
          style={{ padding: "0.75rem 1rem", display: "flex", alignItems: "center", gap: "0.75rem", color: "var(--text-muted)", marginTop: "auto", background: "none", border: "none", cursor: "pointer", fontSize: "1rem", fontFamily: "var(--font-body)" }}
        >
          <LogOut size={20} />
          Cerrar Sesión
        </button>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, minWidth: 0 }}>
        {children}
      </main>
    </div>
  );
}
