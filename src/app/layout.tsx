import type { Metadata } from "next";
import { SiteNavbar } from "@/components/containers/SiteNavbar";
import { SiteFooter } from "@/components/containers/SiteFooter";
import { ConsentManager } from "@/components/containers/ConsentManager";
import { Analytics } from "@/components/containers/Analytics";
import { Providers } from "@/components/providers";
import { CartProvider } from "@/context/CartContext";
import { CartDrawer } from "@/components/organisms/CartDrawer";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.dgaudiosound.com"),
  // Verificación de propiedad en Google Search Console (la tenían todas las páginas del sitio HTML)
  verification: { google: "LTYvaEhYRteW0y2IE0yfsdva3Xlj-y9Lx0XByyAHjPY" },
  title: "Tienda | DG Audiosound",
  description: "Soluciones integrales de audio, video e iluminación premium para hogares y negocios",
  openGraph: {
    title: "Tienda | DG Audiosound",
    description: "Soluciones integrales de audio, video e iluminación premium para hogares y negocios",
    url: "https://www.dgaudiosound.com",
    siteName: "DG Audiosound",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DG Audiosound - Soluciones integrales de audio, video e iluminación premium",
      },
    ],
    locale: "es_MX",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tienda | DG Audiosound",
    description: "Soluciones integrales de audio, video e iluminación premium para hogares y negocios",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <Analytics />
        <Providers>
          <CartProvider>
            <SiteNavbar />
            <CartDrawer />
            <Toaster position="bottom-right" />
            <main style={{ minHeight: "calc(100vh - 300px)" }}>
              {children}
            </main>
            <SiteFooter />
            <ConsentManager />
          </CartProvider>
        </Providers>
      </body>
    </html>
  );
}
